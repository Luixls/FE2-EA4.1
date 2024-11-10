// ruta: backend/routes/deporteRoutes.js
const express = require("express");
const {
  obtenerDeportes,
  agregarDeporte,
  editarDeporte,
  eliminarDeporte,
} = require("../controllers/deporteController");

const router = express.Router();

router.get("/", obtenerDeportes);
router.post("/", agregarDeporte);
router.put("/:id", editarDeporte);
router.delete("/:id", eliminarDeporte);

module.exports = router;
