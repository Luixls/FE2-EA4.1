// ruta: backend/routes/atletaRoutes.js
const express = require("express");
const {
  obtenerAtletas,
  agregarAtleta,
  editarAtleta,
  eliminarAtleta,
  obtenerAtleta,
  obtenerAtletaDetalle,
} = require("../controllers/atletaController");
const autenticarToken = require("../middleware/authMiddleware");
const verificarAdmin = require("../middleware/verificarAdmin");
const verificarMod = require("../middleware/verificarMod");

const router = express.Router();

// Obtener todos los atletas (disponible para todos los usuarios autenticados)
router.get("/", obtenerAtletas);

router.get('/:id/detalle', obtenerAtletaDetalle);

// Agregar un atleta (solo para admin)
router.post("/", autenticarToken, verificarAdmin, agregarAtleta);

// Editar un atleta (para admin y mod)
router.put("/:id", autenticarToken, verificarMod, editarAtleta);

// Eliminar un atleta (solo para admin)
router.delete("/:id", autenticarToken, verificarAdmin, eliminarAtleta);

module.exports = router;
