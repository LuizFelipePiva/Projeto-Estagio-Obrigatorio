import db from "../../../shared/config/db.js";

export const minhasVagas = async (req, res) => {
    try {
        const [vagas] = await db.query(`
            SELECT v.id_vagas,
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
            u.name AS user_name,

            CASE
	            WHEN va.flag_pendencia = 0 THEN 'Recusado'
	            WHEN va.flag_pendencia = 1 THEN 'Pendente'
	            WHEN va.flag_pendencia = 2 THEN 'Aprovado'
            END AS flag_pendencia

            FROM vagas_aplicadas va
            INNER JOIN vagas v ON va.id_vagas = v.id_vagas
            LEFT JOIN users u ON v.id_user = u.id
            WHERE va.id_user_vagas_aplicadas = ?`,
            [req.user.id]
        );

        res.json(vagas);
        console.log(vagas);

    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        res.status(500).json({ message: "Erro ao buscar vagas" });
    }
}
