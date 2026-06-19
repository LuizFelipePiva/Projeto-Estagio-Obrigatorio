import db from "../config/db.js";

export const deleteJob = async (req, res) => {
  const { id_vagas } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM vagas WHERE id_vagas = ? AND id_user = ?",
      [id_vagas, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vaga nao encontrada" });
    }

    return res.json({ message: "Vaga excluida com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir vaga:", error);
    return res.status(500).json({ message: "Erro ao excluir vaga" });
  }
};
