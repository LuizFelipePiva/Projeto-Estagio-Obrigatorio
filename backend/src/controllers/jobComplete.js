import db from "../config/db.js";

export const completeJob = async (req, res) => {
  const { id_vagas } = req.params;
  const rating = Number(req.body?.nota_avaliacao);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Nota invalida" });
  }

  try {
    const [result] = await db.query(
      `UPDATE vagas
       SET flag_status = 1,
           nota_avaliacao = ?
       WHERE id_vagas = ?
         AND id_user = ?
         AND usuario_selecionado IS NOT NULL
         AND COALESCE(flag_status, 0) = 0`,
      [rating, id_vagas, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Vaga nao encontrada, sem candidato aceito ou ja concluida",
      });
    }

    return res.status(200).json({ message: "Vaga marcada como concluida" });
  } catch (error) {
    console.error("Erro ao concluir vaga:", error);
    return res.status(500).json({ message: "Erro ao concluir vaga" });
  }
};

export const getCompletedFreelancerJobs = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT v.id_vagas,
              v.title,
              v.category,
              v.modality,
              v.salary,
              v.location,
              v.data_final,
              v.description,
              v.requirements,
              v.usuario_selecionado,
              COALESCE(v.flag_status, 0) AS flag_status,
              v.nota_avaliacao,
              va.idvagas_aplicadas,
              CASE
                WHEN va.flag_pendencia = 0 THEN 'Recusado'
                WHEN va.flag_pendencia = 1 THEN 'Pendente'
                WHEN va.flag_pendencia = 2 THEN 'Aprovado'
              END AS flag_pendencia
       FROM vagas_aplicadas va
       INNER JOIN vagas v ON va.id_vagas = v.id_vagas
       WHERE va.id_user_vagas_aplicadas = ?
         AND va.flag_pendencia = 2
         AND COALESCE(v.flag_status, 0) = 1
       ORDER BY v.id_vagas DESC`,
      [req.user.id]
    );

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Erro ao buscar projetos concluidos:", error);
    return res.status(500).json({ message: "Erro ao buscar projetos concluidos" });
  }
};
