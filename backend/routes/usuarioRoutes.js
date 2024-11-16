// ruta: backend/routes/usuarioRoutes.js
const express = require("express");
const {
  crearUsuario,
  obtenerUsuarios,
  eliminarUsuario,
} = require("../controllers/usuarioController");
const autenticarToken = require("../middleware/authMiddleware");

const router = express.Router();

// Rutas para usuarios
router.post("/", autenticarToken, crearUsuario);
router.get("/", autenticarToken, obtenerUsuarios);
router.delete("/:id", autenticarToken, eliminarUsuario);

module.exports = router;
