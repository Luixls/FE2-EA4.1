// ruta: backend/models/Atleta.js
const mongoose = require("mongoose");

const CompetenciaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true },
  resultado: { type: String, required: true },
});

const AtletaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  nacionalidad: { type: String, required: true },
  genero: { type: String, required: true },
  competencias: [CompetenciaSchema], // Array de competencias en las que ha participado
});

module.exports = mongoose.model("Atleta", AtletaSchema);
