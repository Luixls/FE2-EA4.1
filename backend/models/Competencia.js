// ruta: backend/models/Competencia.js
const mongoose = require("mongoose");

const ParticipanteSchema = new mongoose.Schema({
  atleta: { type: mongoose.Schema.Types.ObjectId, ref: "Atleta", required: true },
  tiempo: { type: String, required: true }, // Formato: "1h 30m 25s"
});

const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  participantes: [ParticipanteSchema],
  primerLugar: { type: mongoose.Schema.Types.ObjectId, ref: "Atleta" },
  segundoLugar: { type: mongoose.Schema.Types.ObjectId, ref: "Atleta" },
  tercerLugar: { type: mongoose.Schema.Types.ObjectId, ref: "Atleta" },
});

const CompetenciaSchema = new mongoose.Schema({
  deporte: { type: mongoose.Schema.Types.ObjectId, ref: "Deporte", required: true },
  anio: { type: Number, required: true },
  categorias: [CategoriaSchema],
});

module.exports = mongoose.model("Competencia", CompetenciaSchema);
