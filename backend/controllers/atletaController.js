// ruta: backend/controllers/atletaController.js
const Atleta = require("../models/Atleta");

exports.obtenerAtletas = async (req, res) => {
  try {
    const atletas = await Atleta.find();
    res.json(atletas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener atletas" });
  }
};

// Nueva función para obtener un atleta específico
exports.obtenerAtleta = async (req, res) => {
  const { id } = req.params;
  console.log("Solicitud para obtener atleta con ID:", id); // Log para depuración
  try {
    const atleta = await Atleta.findById(id);
    if (!atleta) return res.status(404).json({ message: "Atleta no encontrado" });
    res.json(atleta);
  } catch (error) {
    console.error("Error en obtenerAtleta:", error); // Log para errores
    res.status(500).json({ message: "Error al obtener el atleta" });
  }
};


exports.agregarAtleta = async (req, res) => {
  try {
    const { nombre, fechaNacimiento, nacionalidad, genero } = req.body;
    const nuevoAtleta = new Atleta({
      nombre,
      fechaNacimiento: new Date(fechaNacimiento), // Asegúrate de que se convierte a Date
      nacionalidad,
      genero,
    });
    await nuevoAtleta.save();
    res.status(201).json(nuevoAtleta);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar atleta" });
  }
};


exports.editarAtleta = async (req, res) => {
  const { id } = req.params;
  let { nombre, fechaNacimiento, nacionalidad, genero } = req.body;
  fechaNacimiento = new Date(fechaNacimiento);
  fechaNacimiento.setMinutes(
    fechaNacimiento.getMinutes() + fechaNacimiento.getTimezoneOffset()
  ); // Ajuste de zona horaria
  try {
    const atleta = await Atleta.findByIdAndUpdate(
      id,
      { nombre, fechaNacimiento, nacionalidad, genero },
      { new: true }
    );
    res.json(atleta);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar atleta" });
  }
};

exports.eliminarAtleta = async (req, res) => {
  const { id } = req.params;
  try {
    await Atleta.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el atleta" });
  }
};
