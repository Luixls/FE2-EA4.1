// ruta: backend/controllers/deporteController.js
const Deporte = require("../models/Deporte");

// Obtener todos los deportes
exports.obtenerDeportes = async (req, res) => {
  try {
    const deportes = await Deporte.find();
    res.json(deportes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener deportes" });
  }
};

// Agregar un nuevo deporte
exports.agregarDeporte = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const nuevoDeporte = new Deporte({ nombre, descripcion });
    await nuevoDeporte.save();
    res.status(201).json(nuevoDeporte);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar deporte" });
  }
};

// Editar un deporte
exports.editarDeporte = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const deporteActualizado = await Deporte.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true }
    );
    res.json(deporteActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar deporte" });
  }
};

// Eliminar un deporte
exports.eliminarDeporte = async (req, res) => {
  const { id } = req.params;

  try {
    await Deporte.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar deporte" });
  }
};
