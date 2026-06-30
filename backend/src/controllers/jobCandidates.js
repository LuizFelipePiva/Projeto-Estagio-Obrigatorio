import db from "../config/db.js";

export const getJobCandidates = async (req, res) => {
  const { id_vagas } = req.params;

  if (!id_vagas) {
    return res.status(400).json({ message: "Id da vaga nao informado" });
  }

  try {
    const [jobs] = await db.query(
      "SELECT id_vagas FROM vagas WHERE id_vagas = ? AND id_user = ? LIMIT 1",
      [id_vagas, req.user.id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ message: "Vaga nao encontrada" });
    }

    const [candidates] = await db.query(
      `SELECT va.idvagas_aplicadas,
              va.id_user_vagas_aplicadas AS user_id,
              u.name,
              u.email,
              pf.category,
              pf.descricao AS description,
              pf.habilidades AS habilities,
              pf.telefone,
              CASE
                WHEN va.flag_pendencia = 0 THEN 'Recusado'
                WHEN va.flag_pendencia = 1 THEN 'Pendente'
                WHEN va.flag_pendencia = 2 THEN 'Aprovado'
                ELSE 'Pendente'
              END AS flag_pendencia
       FROM vagas_aplicadas va
       INNER JOIN users u ON u.id = va.id_user_vagas_aplicadas
       LEFT JOIN perfil_freelancer pf ON pf.user_id = u.id
       WHERE va.id_vagas = ?
       ORDER BY va.idvagas_aplicadas DESC`,
      [id_vagas]
    );

    return res.status(200).json(candidates);
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    return res.status(500).json({ message: "Erro ao buscar candidatos" });
  }
};

export const updateJobCandidateStatus = async (req, res) => {
  const { id_vagas, idvagas_aplicadas } = req.params;
  const status = Number(req.body?.flag_pendencia);
  let connection;

  if (!id_vagas || !idvagas_aplicadas) {
    return res.status(400).json({ message: "Id da vaga ou candidatura nao informado" });
  }

  if (!Number.isInteger(status) || ![0, 1, 2].includes(status)) {
    return res.status(400).json({ message: "Status da candidatura invalido" });
  }

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [candidates] = await connection.query(
      `SELECT va.idvagas_aplicadas,
              va.id_user_vagas_aplicadas AS user_id
       FROM vagas_aplicadas va
       INNER JOIN vagas v ON v.id_vagas = va.id_vagas
       WHERE va.idvagas_aplicadas = ?
         AND va.id_vagas = ?
         AND v.id_user = ?
       LIMIT 1
       FOR UPDATE`,
      [idvagas_aplicadas, id_vagas, req.user.id]
    );

    if (candidates.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Candidatura nao encontrada" });
    }

    const selectedCandidate = candidates[0];

    if (status === 2) {
      await connection.query(
        `UPDATE vagas_aplicadas
         SET flag_pendencia = CASE
           WHEN idvagas_aplicadas = ? THEN 2
           ELSE 0
         END
         WHERE id_vagas = ?`,
        [idvagas_aplicadas, id_vagas]
      );

      await connection.query(
        "UPDATE vagas SET usuario_selecionado = ? WHERE id_vagas = ? AND id_user = ?",
        [selectedCandidate.user_id, id_vagas, req.user.id]
      );
    } else {
      await connection.query(
        "UPDATE vagas_aplicadas SET flag_pendencia = ? WHERE idvagas_aplicadas = ? AND id_vagas = ?",
        [status, idvagas_aplicadas, id_vagas]
      );
    }

    await connection.commit();

    return res.status(200).json({ message: "Status da candidatura atualizado com sucesso" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Erro ao atualizar candidatura:", error);
    return res.status(500).json({ message: "Erro ao atualizar candidatura" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
