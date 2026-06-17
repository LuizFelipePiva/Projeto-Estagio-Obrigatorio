import db from "../config/db.js";

export const editJob = async (req, res) => {
    const { idvagas } = req.params;
    const userId = req.user.id;
    const formData = req.body?.formData ?? {};

    const {
        title,
        category,
        modality,
        salary,
        location,
        description,
        requirements,
        data_final,
    } = formData;

    try {
        const [result] = await db.query(
            `UPDATE vagas
             SET title = ?,
                 category = ?,
                 modality = ?,
                 salary = ?,
                 location = ?,
                 description = ?,
                 requirements = ?,
                 data_final = ?
             WHERE idvagas = ? AND id_user = ?`,
            [
                title,
                category,
                modality,
                salary,
                location,
                description,
                requirements,
                data_final,
                idvagas,
                userId,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vaga nao encontrada" });
        }

        return res.status(200).json({ message: "Vaga atualizada com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar vaga:", error);
        return res.status(500).json({ message: "Erro ao atualizar vaga" });
    }
};
