import db from "../config/db.js";

export const minhasVagas = async (req, res) => {
    try {
        const [vagas] = await db.query(`
            SELECT v.id_vagas,
            v.title,
            v.category,
            v.modality,
            v.salary,
            v.location,
            v.description,
            v.requirements,
            va.idvagas_aplicadas,

            CASE
	            WHEN va.flag_pendencia = 0 THEN 'Recusado'
	            WHEN va.flag_pendencia = 1 THEN 'Pendente'
	            WHEN va.flag_pendencia = 2 THEN 'Aprovado'
            END AS flag_pendencia

            FROM vagas_aplicadas va
            INNER JOIN vagas v ON va.id_vagas = v.id_vagas
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
