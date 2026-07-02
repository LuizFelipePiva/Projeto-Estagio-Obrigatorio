import db from "../config/db.js";

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
            nota_avaliacao
            FROM vagas
            WHERE COALESCE(flag_status, 0) = 0`,
        );
        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        return res.status(500).json({ message: "Erro ao buscar vagas" });
    }
};
