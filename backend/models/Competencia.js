// ruta: backend/models/Competencia.js

const mongoose = require("mongoose");

const CompetenciaSchema = new mongoose.Schema({
  deporte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deporte",
    required: true,
  },
  categoria: { type: String, required: true },
  anio: { type: Number, required: true },
  participantes: [
    {
      atleta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Atleta",
        required: true,
      },
      tiempo: { type: String, required: true },
    },
  ],
  primerLugar: { type: mongoose.Schema.Types.ObjectId, ref: "Atleta" },
  segundoLugar: { type: mongoose.Schema.Types.ObjectId, ref: "Atleta" },
  tercerLugar: { type: mongoose.Schema.Types.ObjectId, ref: "Atleta" },
});

module.exports = mongoose.model("Competencia", CompetenciaSchema);
