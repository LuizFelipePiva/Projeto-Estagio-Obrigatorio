import db from "../../../shared/config/db.js";

export const allJobs = async (req, res) => {
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
            COALESCE(flag_status, 0) AS flag_status,
            nota_avaliacao,
            users.name AS user_name
            FROM vagas
            JOIN users ON vagas.id_user = users.id
            WHERE COALESCE(flag_status, 0) = 0 AND (data_final IS NULL OR data_final >= CURDATE())`,
        );
        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        return res.status(500).json({ message: "Erro ao buscar vagas" });
    }
};
