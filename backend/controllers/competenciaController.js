// ruta: backend/controllers/competenciaController.js

const Competencia = require("../models/Competencia");
const Atleta = require("../models/Atleta");

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

// Crear una nueva competencia y actualizar los perfiles de los atletas participantes
exports.crearCompetencia = async (req, res) => {
  const { deporte, categoria, anio, participantes } = req.body;
  try {
    const { primerLugar, segundoLugar, tercerLugar } =
      obtenerLugares(participantes);

    // Crear la competencia
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

    // Actualizar cada atleta participante de manera individual
    for (const participante of participantes) {
      try {
        await Atleta.findByIdAndUpdate(participante.atleta, {
          $push: { competencias: nuevaCompetencia._id },
        });
      } catch (error) {
        console.error(
          `Error al actualizar el atleta ${participante.atleta}:`,
          error.message
        );
      }
    }

    res.status(201).json(nuevaCompetencia);
  } catch (error) {
    console.error("Error al crear competencia:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear competencia", error: error.message });
  }
};

// Editar una competencia y actualizar los participantes
exports.editarCompetencia = async (req, res) => {
  const { id } = req.params;
  const { deporte, categoria, anio, participantes } = req.body;

  try {
    const competenciaExistente = await Competencia.findById(id);

    if (!competenciaExistente) {
      return res.status(404).json({ mensaje: "La competencia no existe." });
    }

    // Obtener los ID de los participantes actuales y nuevos
    const participantesAnteriores = competenciaExistente.participantes.map(
      (p) => p.atleta.toString()
    );
    const participantesNuevos = participantes.map((p) => p.atleta.toString());

    // Calcular los atletas eliminados y los nuevos
    const atletasEliminados = participantesAnteriores.filter(
      (id) => !participantesNuevos.includes(id)
    );
    const atletasAgregados = participantesNuevos.filter(
      (id) => !participantesAnteriores.includes(id)
    );

    // Eliminar la referencia a la competencia en los atletas eliminados
    await Promise.all(
      atletasEliminados.map((atletaId) =>
        Atleta.findByIdAndUpdate(atletaId, { $pull: { competencias: id } })
      )
    );

    // Agregar la referencia de la competencia en los nuevos atletas
    await Promise.all(
      atletasAgregados.map((atletaId) =>
        Atleta.findByIdAndUpdate(atletaId, { $push: { competencias: id } })
      )
    );

    // Calcular los nuevos lugares
    const { primerLugar, segundoLugar, tercerLugar } =
      obtenerLugares(participantes);

    // Actualizar la competencia
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
    console.error("Error al editar competencia:", error.message);
    res.status(500).json({ mensaje: "Error al editar competencia" });
  }
};

// Eliminar una competencia y actualizar los atletas participantes
exports.eliminarCompetencia = async (req, res) => {
  const { id } = req.params;

  try {
    const competencia = await Competencia.findById(id);

    if (!competencia) {
      return res.status(404).json({ mensaje: "La competencia no existe." });
    }

    // Eliminar la referencia de la competencia en los atletas participantes
    await Promise.all(
      competencia.participantes.map((participante) =>
        Atleta.findByIdAndUpdate(participante.atleta, {
          $pull: { competencias: id },
        })
      )
    );

    // Eliminar la competencia
    await Competencia.findByIdAndDelete(id);

    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar competencia:", error.message);
    res.status(500).json({ mensaje: "Error al eliminar competencia" });
  }
};

// Obtener todas las competencias con los atletas participantes y sus lugares
exports.obtenerCompetencias = async (req, res) => {
  try {
    const competencias = await Competencia.find()
      .populate("deporte", "nombre")
      .populate("participantes.atleta", "nombre")
      .populate("primerLugar", "nombre")
      .populate("segundoLugar", "nombre")
      .populate("tercerLugar", "nombre");
    res.json(competencias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener competencias" });
  }
};
