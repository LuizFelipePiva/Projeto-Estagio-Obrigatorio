import db from "../config/db.js";

export const removerCandidatura = async (req, res) => {
  const { idvagas_aplicadas } = req.params;

  if (!idvagas_aplicadas) {
    return res.status(400).json({ message: "Id da candidatura nao informado" });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM vagas_aplicadas WHERE idvagas_aplicadas = ? AND id_user_vagas_aplicadas = ?",
      [idvagas_aplicadas, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Candidatura nao encontrada" });
    }

    return res.json({ message: "Candidatura removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover candidatura:", error);
    return res.status(500).json({ message: "Erro ao remover candidatura" });
  }
};
