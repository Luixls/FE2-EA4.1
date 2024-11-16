// ruta: backend/routes/competenciaRoutes.js

const express = require("express");
const {
  obtenerCompetencias,
  crearCompetencia,
  editarCompetencia,
  eliminarCompetencia,
} = require("../controllers/competenciaController");
const verificarAdmin = require("../middleware/verificarAdmin");
const autenticarToken = require("../middleware/authMiddleware");
const verificarMod = require("../middleware/verificarMod");
const router = express.Router();

router.get("/", obtenerCompetencias);
router.post("/", autenticarToken, verificarAdmin, crearCompetencia); // Ruta protegida
router.put("/:id", autenticarToken, verificarMod, editarCompetencia);
router.delete("/:id", autenticarToken, verificarAdmin, eliminarCompetencia);

module.exports = router;
