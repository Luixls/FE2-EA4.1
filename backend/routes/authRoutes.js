// ruta: backend/routes/authRoutes.js
const express = require("express");
const { registrarUsuario, iniciarSesion, crearAdminSiNoExiste } = require("../controllers/authController");

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/registro", registrarUsuario);

// Ruta para iniciar sesión
router.post("/login", iniciarSesion);

// Crear admin si no existe
crearAdminSiNoExiste();

module.exports = router;
