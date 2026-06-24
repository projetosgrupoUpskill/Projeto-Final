import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);//teste
    console.log("Token:", token); //teste
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("Erro JWT:", err.message); //teste
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

export default auth;
