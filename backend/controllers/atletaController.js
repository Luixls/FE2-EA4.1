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

exports.agregarAtleta = async (req, res) => {
  let { nombre, fechaNacimiento, nacionalidad, genero } = req.body;
  fechaNacimiento = new Date(fechaNacimiento);
  fechaNacimiento.setMinutes(
    fechaNacimiento.getMinutes() + fechaNacimiento.getTimezoneOffset()
  ); // Ajuste de zona horaria

  const nuevoAtleta = new Atleta({
    nombre,
    fechaNacimiento,
    nacionalidad,
    genero,
  });
  try {
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
