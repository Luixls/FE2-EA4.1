// ruta: backend/controllers/usuarioController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

exports.crearUsuario = async (req, res) => {
  const { username, nombre, email, password, rol, sistemaPassword } = req.body;

  if (sistemaPassword !== process.env.ADMIN_SISPASS) {
    return res.status(403).json({ mensaje: "Contraseña del sistema incorrecta." });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ username, nombre, email, password: hashPassword, rol });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario creado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear usuario." });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios." });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const { sistemaPassword } = req.body;

  if (sistemaPassword !== process.env.ADMIN_SISPASS) {
    return res.status(403).json({ mensaje: "Contraseña del sistema incorrecta." });
  }

  try {
    await Usuario.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar usuario." });
  }
};
