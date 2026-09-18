import db from '../../../shared/config/db.js';

export const getMyJobs = async (req, res) => {
    try {
        const [jobs] = await db.query(
            `SELECT id_vagas,
            title,
            category,
            modality,
            salary,
            location,
            data_final,
            description,
            requirements,
            usuario_selecionado,
            COALESCE(flag_status, 0) AS flag_status,
            nota_avaliacao,
            users.name AS user_name
            FROM vagas 
            JOIN users ON vagas.id_user = users.id
            WHERE id_user = ? `,
            [req.user.id]
        );
        res.json(jobs);
        console.log(jobs);

    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        res.status(500).json({ message: "Erro ao buscar vagas" });
    }
}
