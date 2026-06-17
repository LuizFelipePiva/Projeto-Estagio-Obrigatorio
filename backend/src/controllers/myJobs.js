import db from '../config/db.js';

export const getMyJobs = async (req, res) => {
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
            FROM vagas WHERE id_user = ? `,
            [req.user.id]
        );
        res.json(jobs);
        console.log(jobs);

    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        res.status(500).json({ message: "Erro ao buscar vagas" });
    }
}