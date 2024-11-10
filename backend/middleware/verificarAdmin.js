// ruta: backend/middleware/verificarAdmin.js
const jwt = require("jsonwebtoken");

const verificarAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado. No se proporcionó un token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado. Se requiere rol de administrador." });
    }
    next();
  } catch (error) {
    res.status(403).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarAdmin;
