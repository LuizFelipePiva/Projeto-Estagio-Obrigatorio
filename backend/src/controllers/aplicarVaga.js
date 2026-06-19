import db from "../config/db.js";

export const applyForJob = async (req, res) => {
    const { id_vagas } = req.params;
    const id_user = req.user.id; // Supondo que o ID do candidato esteja disponível no token de autenticação

    try {
        // Verificar se o candidato já se inscreveu para a vaga
        const checkQuery = "SELECT * FROM vagas_aplicadas WHERE id_user = ? AND id_vagas = ?";
        const [existingApplication] = await db.query(checkQuery, [id_user, id_vagas]);
        if (existingApplication.length > 0) {
            return res.status(400).json({ message: "Você já se inscreveu para esta vaga." });
        }

        // Inserir a candidatura no banco de dados
        const insertQuery = `
            INSERT INTO vagas_aplicadas (idvagas_aplicadas, id_user, id_vagas, flag_pendencia)
            SELECT COALESCE(MAX(idvagas_aplicadas), 0) + 1, ?, ?, 1
            FROM vagas_aplicadas
        `;
        await db.query(insertQuery, [id_user, id_vagas]);
        res.status(201).json({ message: "Inscrição realizada com sucesso." });

    } catch (error) {

        console.error("Erro ao se inscrever para a vaga:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}
