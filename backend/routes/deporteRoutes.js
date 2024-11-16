// ruta: backend/routes/deporteRoutes.js
const express = require("express");
const {
  obtenerDeportes,
  agregarDeporte,
  editarDeporte,
  eliminarDeporte,
} = require("../controllers/deporteController");
const autenticarToken = require("../middleware/authMiddleware");
const verificarAdmin = require("../middleware/verificarAdmin");
const verificarMod = require("../middleware/verificarMod");


const router = express.Router();

router.get("/", obtenerDeportes);
router.post("/", autenticarToken, verificarAdmin, agregarDeporte);
router.put("/:id", autenticarToken, verificarMod, editarDeporte);
router.delete("/:id", autenticarToken, verificarAdmin, eliminarDeporte);

module.exports = router;
