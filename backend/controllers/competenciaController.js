// ruta: backend/controllers/competenciaController.js

const Competencia = require("../models/Competencia");

exports.obtenerCompetencias = async (req, res) => {
  try {
    const competencias = await Competencia.find()
      .populate("deporte", "nombre")
      .populate("participantes.atleta", "nombre");
    res.json(competencias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener competencias" });
  }
};

exports.crearCompetencia = async (req, res) => {
  const { deporte, categoria, anio, participantes } = req.body;
  try {
    const nuevaCompetencia = new Competencia({ deporte, categoria, anio, participantes });
    await nuevaCompetencia.save();
    res.status(201).json(nuevaCompetencia);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear competencia" });
  }
};

exports.editarCompetencia = async (req, res) => {
  const { id } = req.params;
  const { deporte, categoria, anio, participantes } = req.body;
  try {
    const competenciaActualizada = await Competencia.findByIdAndUpdate(
      id,
      { deporte, categoria, anio, participantes },
      { new: true }
    );
    res.json(competenciaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar competencia" });
  }
};

exports.eliminarCompetencia = async (req, res) => {
  const { id } = req.params;
  try {
    await Competencia.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar competencia" });
  }
};
