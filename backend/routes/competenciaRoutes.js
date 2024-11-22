// ruta: backend/routes/competenciaRoutes.js

const express = require("express");
const {
  obtenerCompetencias,
  crearCompetencia,
  editarCompetencia,
  eliminarCompetencia,
  actualizarTiempos, // Nuevo controlador para registrar tiempos
} = require("../controllers/competenciaController");
const verificarAdmin = require("../middleware/verificarAdmin");
const autenticarToken = require("../middleware/authMiddleware");
const verificarMod = require("../middleware/verificarMod");

const router = express.Router();

router.get("/", obtenerCompetencias);
router.post("/", autenticarToken, verificarAdmin, crearCompetencia); // Ruta protegida
router.put("/:id", autenticarToken, verificarMod, editarCompetencia);
router.put("/:id/categoria/:categoriaId/tiempos", autenticarToken, verificarMod, actualizarTiempos); // Nueva ruta para registrar tiempos
router.delete("/:id", autenticarToken, verificarAdmin, eliminarCompetencia);

module.exports = router;
