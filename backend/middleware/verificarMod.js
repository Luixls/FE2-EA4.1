// ruta: backend/middleware/verificarMod.js
const jwt = require("jsonwebtoken");

const verificarMod = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado. No se proporcionó un token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "admin" && decoded.rol !== "mod") {
      return res.status(403).json({ mensaje: "Acceso denegado. Se requiere rol de administrador o moderador." });
    }
    next();
  } catch (error) {
    res.status(403).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarMod;
