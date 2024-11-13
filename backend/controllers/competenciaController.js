// ruta: backend/controllers/competenciaController.js

const Competencia = require("../models/Competencia");

function convertirATiempoEnSegundos(tiempo) {
  const regex = /(\d+h)?\s*(\d+m)?\s*(\d+s)?/;
  const [, horas, minutos, segundos] = tiempo.match(regex) || [];
  return (
    (parseInt(horas) || 0) * 3600 +
    (parseInt(minutos) || 0) * 60 +
    (parseInt(segundos) || 0)
  );
}

function obtenerLugares(participantes) {
  const participantesOrdenados = [...participantes].sort((a, b) => {
    return (
      convertirATiempoEnSegundos(a.tiempo) -
      convertirATiempoEnSegundos(b.tiempo)
    );
  });
  return {
    primerLugar: participantesOrdenados[0]?.atleta || null,
    segundoLugar: participantesOrdenados[1]?.atleta || null,
    tercerLugar: participantesOrdenados[2]?.atleta || null,
  };
}

exports.crearCompetencia = async (req, res) => {
  const { deporte, categoria, anio, participantes } = req.body;
  try {
    const { primerLugar, segundoLugar, tercerLugar } =
      obtenerLugares(participantes);

    const nuevaCompetencia = new Competencia({
      deporte,
      categoria,
      anio,
      participantes,
      primerLugar,
      segundoLugar,
      tercerLugar,
    });
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
    const { primerLugar, segundoLugar, tercerLugar } =
      obtenerLugares(participantes);

    const competenciaActualizada = await Competencia.findByIdAndUpdate(
      id,
      {
        deporte,
        categoria,
        anio,
        participantes,
        primerLugar,
        segundoLugar,
        tercerLugar,
      },
      { new: true }
    );
    res.json(competenciaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar competencia" });
  }
};

exports.obtenerCompetencias = async (req, res) => {
  try {
    const competencias = await Competencia.find()
      .populate("deporte", "nombre")
      .populate("participantes.atleta", "nombre")
      .populate("primerLugar", "nombre")
      .populate("segundoLugar", "nombre")
      .populate("tercerLugar", "nombre"); // Agregar el populate aquí
    res.json(competencias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener competencias" });
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
