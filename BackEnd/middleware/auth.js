import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

/*   Resumindo:
Primeiro if → verifica se existe o cabeçalho Authorization.
Segundo if → verifica se existe um token dentro desse cabeçalho.
São duas validações diferentes. Sem a primeira, o código quebra ao chamar .split(). Sem a segunda, um cabeçalho como Authorization: Bearer seria aceito mesmo sem token. */

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    /* console.log("JWT_SECRET:", process.env.JWT_SECRET); *///teste
    /* console.log("Token:", token); */ //teste
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("Erro ao validar token:", err.message); //teste
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

export default auth;
