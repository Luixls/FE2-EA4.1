// ruta: backend/models/Atleta.js
const mongoose = require("mongoose");

const atletaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  nacionalidad: { type: String, required: true },
  genero: { type: String, enum: ["masculino", "femenino"], required: true }, // Campo de género
});

module.exports = mongoose.model("Atleta", atletaSchema);
