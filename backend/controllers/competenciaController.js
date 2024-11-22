const Competencia = require("../models/Competencia");
const Atleta = require("../models/Atleta");

// Función para calcular lugares
function calcularLugares(participantes) {
  const convertirATiempoEnSegundos = (tiempo) => {
    const regex = /(\d+h)?\s*(\d+m)?\s*(\d+s)?/;
    const [, horas, minutos, segundos] = tiempo.match(regex) || [];
    return (
      (parseInt(horas) || 0) * 3600 +
      (parseInt(minutos) || 0) * 60 +
      (parseInt(segundos) || 0)
    );
  };

  const ordenados = [...participantes].sort((a, b) => {
    return convertirATiempoEnSegundos(a.tiempo) - convertirATiempoEnSegundos(b.tiempo);
  });

  return {
    primerLugar: ordenados[0]?.atleta || null,
    segundoLugar: ordenados[1]?.atleta || null,
    tercerLugar: ordenados[2]?.atleta || null,
  };
}

// Crear una nueva competencia con categorías
exports.crearCompetencia = async (req, res) => {
  const { deporte, anio, categorias } = req.body;

  try {
    if (!categorias || categorias.length === 0) {
      return res.status(400).json({ mensaje: "Se requiere al menos una categoría." });
    }

    const categoriasProcesadas = categorias.map((categoria) => {
      const { participantes } = categoria;
      const lugares = calcularLugares(participantes || []);
      return {
        ...categoria,
        ...lugares,
      };
    });

    const nuevaCompetencia = new Competencia({
      deporte,
      anio,
      categorias: categoriasProcesadas,
    });

    await nuevaCompetencia.save();

    for (const categoria of categoriasProcesadas) {
      for (const participante of categoria.participantes) {
        await Atleta.findByIdAndUpdate(participante.atleta, {
          $push: { competencias: nuevaCompetencia._id },
        });
      }
    }

    res.status(201).json(nuevaCompetencia);
  } catch (error) {
    console.error("Error al crear competencia:", error);
    res.status(500).json({ mensaje: "Error al crear competencia", error: error.message });
  }
};

// Obtener competencias
exports.obtenerCompetencias = async (req, res) => {
  try {
    const competencias = await Competencia.find()
      .populate("deporte", "nombre")
      .populate("categorias.participantes.atleta", "nombre")
      .populate("categorias.primerLugar", "nombre")
      .populate("categorias.segundoLugar", "nombre")
      .populate("categorias.tercerLugar", "nombre");

    res.status(200).json(competencias);
  } catch (error) {
    console.error("Error al obtener competencias:", error);
    res.status(500).json({ mensaje: "Error al obtener competencias", error: error.message });
  }
};

// Editar una competencia existente
exports.editarCompetencia = async (req, res) => {
  const { id } = req.params;
  const { deporte, anio, categorias } = req.body;

  try {
    if (!categorias || categorias.length === 0) {
      return res.status(400).json({ mensaje: "Se requiere al menos una categoría." });
    }

    const categoriasProcesadas = categorias.map((categoria) => {
      const { participantes } = categoria;
      const lugares = calcularLugares(participantes || []);
      return {
        ...categoria,
        ...lugares,
      };
    });

    const competenciaActualizada = await Competencia.findByIdAndUpdate(
      id,
      { deporte, anio, categorias: categoriasProcesadas },
      { new: true }
    );

    if (!competenciaActualizada) {
      return res.status(404).json({ mensaje: "Competencia no encontrada." });
    }

    res.status(200).json(competenciaActualizada);
  } catch (error) {
    console.error("Error al editar competencia:", error);
    res.status(500).json({ mensaje: "Error al editar competencia", error: error.message });
  }
};

// Eliminar una competencia
exports.eliminarCompetencia = async (req, res) => {
  const { id } = req.params;
  try {
    const competencia = await Competencia.findByIdAndDelete(id);
    if (!competencia) {
      return res.status(404).json({ mensaje: "Competencia no encontrada." });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar competencia:", error);
    res.status(500).json({ mensaje: "Error al eliminar competencia", error: error.message });
  }
};

// Actualizar tiempos de una categoría en una competencia
exports.actualizarTiempos = async (req, res) => {
  const { id, categoriaId } = req.params;
  const { tiempos } = req.body;

  try {
    if (!Array.isArray(tiempos) || tiempos.length === 0) {
      return res.status(400).json({ mensaje: "Se requiere un arreglo de tiempos válido." });
    }

    const competencia = await Competencia.findById(id);
    if (!competencia) {
      return res.status(404).json({ mensaje: "Competencia no encontrada." });
    }

    const categoria = competencia.categorias.id(categoriaId);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada en la competencia." });
    }

    categoria.participantes.forEach((participante) => {
      const tiempoActualizado = tiempos.find((t) => t.atletaId === participante.atleta.toString());
      if (tiempoActualizado) {
        participante.tiempo = tiempoActualizado.tiempo;
      }
    });

    const lugares = calcularLugares(categoria.participantes);
    categoria.primerLugar = lugares.primerLugar;
    categoria.segundoLugar = lugares.segundoLugar;
    categoria.tercerLugar = lugares.tercerLugar;

    await competencia.save();

    res.status(200).json({ mensaje: "Tiempos actualizados correctamente", competencia });
  } catch (error) {
    console.error("Error al actualizar tiempos:", error);
    res.status(500).json({ mensaje: "Error al actualizar tiempos", error: error.message });
  }
};
