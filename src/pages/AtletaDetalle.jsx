// ruta: src/pages/AtletaDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AtletaDetalle() {
  const { id } = useParams();
  const [atleta, setAtleta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAtletaDetalle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/atletas/${id}/detalle`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAtleta(response.data);
      } catch (error) {
        console.error("Error al obtener detalles del atleta:", error);
        setError("No se pudo cargar la información del atleta.");
      }
    };
    fetchAtletaDetalle();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!atleta) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{atleta.nombre}</h2>
      <p><strong>Fecha de Nacimiento:</strong> {new Date(atleta.fechaNacimiento).toLocaleDateString()}</p>
      <p><strong>Nacionalidad:</strong> {atleta.nacionalidad}</p>
      <p><strong>Género:</strong> {atleta.genero}</p>

      <h3 className="text-2xl font-semibold mt-6 mb-2">Competencias</h3>
      {atleta.competencias && atleta.competencias.length > 0 ? (
        <ul className="list-disc pl-5">
          {atleta.competencias.map((competencia) => (
            <li key={competencia._id}>
              <strong>Deporte:</strong> {competencia.deporte?.nombre || "No especificado"} <br />
              <strong>Categoría:</strong> {competencia.categoria} <br />
              <strong>Año:</strong> {competencia.anio}
            </li>
          ))}
        </ul>
      ) : (
        <p>Este atleta no ha participado en ninguna competencia.</p>
      )}
    </div>
  );
}

export default AtletaDetalle;
