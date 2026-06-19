import db from "../config/db.js";

export const getFreelancerProfile = async (req, res) => {
  try {
    const [profiles] = await db.query(
      `SELECT user_id,
              category,
              descricao AS description,
              habilidades AS habilities,
              telefone
       FROM perfil_freelancer
       WHERE user_id = ?`,
      [req.user.id]
    );

    return res.status(200).json(profiles[0] || null);
  } catch (error) {
    console.error("Erro ao buscar curriculo:", error);
    return res.status(500).json({ message: "Erro ao buscar curriculo" });
  }
};

export const saveFreelancerProfile = async (req, res) => {
  const { category, description, habilities, telefone } = req.body;

  try {
    await db.query(
      `INSERT INTO perfil_freelancer
        (user_id, category, descricao, habilidades, telefone)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        category = VALUES(category),
        descricao = VALUES(descricao),
        habilidades = VALUES(habilidades),
        telefone = VALUES(telefone)`,
      [req.user.id, category, description, habilities, telefone]
    );

    return res.status(200).json({ message: "Curriculo salvo com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar curriculo:", error);
    return res.status(500).json({ message: "Erro ao salvar curriculo" });
  }
};
