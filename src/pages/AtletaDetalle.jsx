import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function AtletaDetalle() {
  const { id } = useParams();
  const [atleta, setAtleta] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtleta = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/atletas/${id}/detalle`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setAtleta(response.data);
        } else {
          setError("No se encontró el atleta.");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del atleta:", error);
        setError("Hubo un problema al obtener los datos del atleta.");
      } finally {
        setLoading(false);
      }
    };

    fetchAtleta();
  }, [id]);

  if (loading)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center mt-4"
      >
        Cargando datos del atleta...
      </motion.p>
    );

  if (error)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center text-red-500"
      >
        {error}
      </motion.p>
    );

  if (!atleta)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center"
      >
        No se encontraron detalles para el atleta especificado.
      </motion.p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center"
    >
      <h1 className="text-3xl font-bold mb-4">{atleta.nombre}</h1>
      <p>
        <strong>Fecha de Nacimiento:</strong>{" "}
        {new Date(atleta.fechaNacimiento).toLocaleDateString()}
      </p>
      <p>
        <strong>Nacionalidad:</strong> {atleta.nacionalidad}
      </p>
      <p>
        <strong>Género:</strong> {atleta.genero}
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Competencias</h2>
      {atleta.competencias && atleta.competencias.length > 0 ? (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-left space-y-4"
        >
          {atleta.competencias.map((comp, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-gray-100 rounded-md shadow-md"
            >
              <p>
                <strong>Deporte:</strong> {comp.deporte.nombre}
              </p>
              <p>
                <strong>Categoría:</strong> {comp.categoria}
              </p>
              <p>
                <strong>Año:</strong> {comp.anio}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          No hay competencias registradas para este atleta.
        </motion.p>
      )}
    </motion.div>
  );
}

export default AtletaDetalle;
