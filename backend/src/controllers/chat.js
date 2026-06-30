import db from "../config/db.js";

const mapConversation = (conversation) => ({
  id_conversa: conversation.id_conversa,
  id_vaga_conversa: conversation.id_vaga_conversa,
  other_user_id: conversation.other_user_id,
  other_user_name: conversation.other_user_name,
  other_user_email: conversation.other_user_email,
  job_title: conversation.job_title,
  last_message: conversation.last_message,
  last_message_created_at: conversation.last_message_created_at,
  created_at: conversation.created_at,
});

const getConversationForUser = async (conversationId, userId) => {
  const [rows] = await db.query(
    `SELECT c.id_conversa,
            c.id_user_contratante_conversa,
            c.id_user_freelancer_conversa,
            c.id_vaga_conversa
     FROM conversa c
     WHERE c.id_conversa = ?
       AND ? IN (c.id_user_contratante_conversa, c.id_user_freelancer_conversa)
     LIMIT 1`,
    [conversationId, userId]
  );

  return rows[0];
};

export const getConversations = async (req, res) => {
  try {
    const [conversations] = await db.query(
      `SELECT c.id_conversa,
              c.id_vaga_conversa,
              c.created_at,
              v.title AS job_title,
              CASE
                WHEN c.id_user_contratante_conversa = ? THEN uf.id
                ELSE uc.id
              END AS other_user_id,
              CASE
                WHEN c.id_user_contratante_conversa = ? THEN uf.name
                ELSE uc.name
              END AS other_user_name,
              CASE
                WHEN c.id_user_contratante_conversa = ? THEN uf.email
                ELSE uc.email
              END AS other_user_email,
              (
                SELECT m.conteudo
                FROM mensagem m
                WHERE m.id_conversa_mensagem = c.id_conversa
                ORDER BY m.created_at DESC, m.id_mensagem DESC
                LIMIT 1
              ) AS last_message,
              (
                SELECT m.created_at
                FROM mensagem m
                WHERE m.id_conversa_mensagem = c.id_conversa
                ORDER BY m.created_at DESC, m.id_mensagem DESC
                LIMIT 1
              ) AS last_message_created_at
       FROM conversa c
       INNER JOIN users uc ON uc.id = c.id_user_contratante_conversa
       INNER JOIN users uf ON uf.id = c.id_user_freelancer_conversa
       LEFT JOIN vagas v ON v.id_vagas = c.id_vaga_conversa
       WHERE ? IN (c.id_user_contratante_conversa, c.id_user_freelancer_conversa)
       ORDER BY COALESCE(last_message_created_at, c.created_at) DESC`,
      [req.user.id, req.user.id, req.user.id, req.user.id]
    );

    return res.status(200).json(conversations.map(mapConversation));
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return res.status(500).json({ message: "Erro ao buscar conversas" });
  }
};

export const getMessages = async (req, res) => {
  const { id_conversa } = req.params;

  try {
    const conversation = await getConversationForUser(id_conversa, req.user.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversa nao encontrada" });
    }

    const [messages] = await db.query(
      `SELECT m.id_mensagem,
              m.id_conversa_mensagem,
              m.id_sender,
              m.conteudo,
              m.created_at,
              u.name AS sender_name
       FROM mensagem m
       INNER JOIN users u ON u.id = m.id_sender
       WHERE m.id_conversa_mensagem = ?
       ORDER BY m.created_at ASC, m.id_mensagem ASC`,
      [id_conversa]
    );

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
};

export const createConversation = async (req, res) => {
  const { id_user_freelancer_conversa, id_vaga_conversa } = req.body;

  if (!id_vaga_conversa) {
    return res.status(400).json({ message: "Id da vaga nao informado" });
  }

  try {
    const [jobs] = await db.query(
      "SELECT id_vagas, id_user FROM vagas WHERE id_vagas = ? LIMIT 1",
      [id_vaga_conversa]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ message: "Vaga nao encontrada" });
    }

    const contractorId = jobs[0].id_user;
    const freelancerId =
      req.user.user_type === 0 ? req.user.id : id_user_freelancer_conversa;

    if (!freelancerId) {
      return res.status(400).json({ message: "Id do freelancer nao informado" });
    }

    if (req.user.id !== contractorId && req.user.id !== Number(freelancerId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const [existing] = await db.query(
      `SELECT id_conversa
       FROM conversa
       WHERE id_user_contratante_conversa = ?
         AND id_user_freelancer_conversa = ?
         AND id_vaga_conversa = ?
       LIMIT 1`,
      [contractorId, freelancerId, id_vaga_conversa]
    );

    if (existing.length > 0) {
      return res.status(200).json({ id_conversa: existing[0].id_conversa });
    }

    const [[next]] = await db.query(
      "SELECT COALESCE(MAX(id_conversa), 0) + 1 AS nextId FROM conversa"
    );

    await db.query(
      `INSERT INTO conversa
       (id_conversa, id_user_contratante_conversa, id_user_freelancer_conversa, id_vaga_conversa, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [next.nextId, contractorId, freelancerId, id_vaga_conversa]
    );

    return res.status(201).json({ id_conversa: next.nextId });
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    return res.status(500).json({ message: "Erro ao criar conversa" });
  }
};

export const sendMessage = async (req, res) => {
  const { id_conversa } = req.params;
  const conteudo = req.body?.conteudo?.trim();

  if (!conteudo) {
    return res.status(400).json({ message: "Mensagem vazia" });
  }

  try {
    const conversation = await getConversationForUser(id_conversa, req.user.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversa nao encontrada" });
    }

    const [[next]] = await db.query(
      "SELECT COALESCE(MAX(id_mensagem), 0) + 1 AS nextId FROM mensagem"
    );

    await db.query(
      `INSERT INTO mensagem
       (id_mensagem, id_conversa_mensagem, id_sender, conteudo, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [next.nextId, id_conversa, req.user.id, conteudo]
    );

    const [messages] = await db.query(
      `SELECT m.id_mensagem,
              m.id_conversa_mensagem,
              m.id_sender,
              m.conteudo,
              m.created_at,
              u.name AS sender_name
       FROM mensagem m
       INNER JOIN users u ON u.id = m.id_sender
       WHERE m.id_mensagem = ?
       LIMIT 1`,
      [next.nextId]
    );

    return res.status(201).json(messages[0]);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
};

export const deleteConversation = async (req, res) => {
  const { id_conversa } = req.params;
  let connection;

  try {
    const conversation = await getConversationForUser(id_conversa, req.user.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversa nao encontrada" });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.query(
      "DELETE FROM mensagem WHERE id_conversa_mensagem = ?",
      [id_conversa]
    );

    await connection.query(
      "DELETE FROM conversa WHERE id_conversa = ?",
      [id_conversa]
    );

    await connection.commit();

    return res.status(200).json({ message: "Chat apagado com sucesso" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Erro ao apagar chat:", error);
    return res.status(500).json({ message: "Erro ao apagar chat" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
