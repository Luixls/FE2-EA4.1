// ruta: backend/models/Deporte.js
const mongoose = require("mongoose");

const DeporteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String }, // Nuevo campo para la URL de la imagen
});

module.exports = mongoose.model("Deporte", DeporteSchema);
