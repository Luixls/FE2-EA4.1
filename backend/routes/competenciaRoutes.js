// ruta: backend/routes/competenciaRoutes.js

const express = require("express");
const {
  obtenerCompetencias,
  crearCompetencia,
  editarCompetencia,
  eliminarCompetencia,
} = require("../controllers/competenciaController");
const verificarAdmin = require("../middleware/verificarAdmin");
const router = express.Router();

router.get("/", obtenerCompetencias);
router.post("/", verificarAdmin, crearCompetencia); // Ruta protegida
router.put("/:id", verificarAdmin, editarCompetencia);
router.delete("/:id", verificarAdmin, eliminarCompetencia);

module.exports = router;
