import db from "../config/db.js";

export const allJobs = async (req, res) => {
    try {
         const [jobs] = await db.query(
            `SELECT idvagas,
            title,
            category,
            modality,
            salary,
            location,
            data_final,
            description,
            requirements
            FROM vagas`,
        );
        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        return res.status(500).json({ message: "Erro ao buscar vagas" });
    }
};
