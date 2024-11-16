// ruta: backend/models/Atleta.js
const mongoose = require("mongoose");

const AtletaSchema = new mongoose.Schema({
  nombre: String,
  fechaNacimiento: Date,
  nacionalidad: String,
  genero: String,
  competencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competencia' }]
});

module.exports = mongoose.model('Atleta', AtletaSchema);
