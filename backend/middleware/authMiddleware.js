// ruta: backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", ""); 
  if (!token) return res.status(401).json({ mensaje: "Acceso denegado" });

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado; // Almacena la información decodificada del usuario en `req.user`
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token inválido" });
  }
}

module.exports = autenticarToken;
