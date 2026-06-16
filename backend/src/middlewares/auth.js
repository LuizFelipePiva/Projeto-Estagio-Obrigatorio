import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token nao fornecido" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token mal formatado" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET nao configurado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalido ou expirado" });
  }
};
