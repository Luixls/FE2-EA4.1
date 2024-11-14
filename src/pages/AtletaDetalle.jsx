import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
        const response = await axios.get(`http://localhost:5000/api/atletas/${id}`);
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

  if (loading) return <p className="text-center mt-4">Cargando datos del atleta...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!atleta) return <p className="text-center">No se encontraron detalles para el atleta especificado.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4">{atleta.nombre}</h1>
      <p>
        <strong>Fecha de Nacimiento:</strong> {new Date(atleta.fechaNacimiento).toLocaleDateString()}
      </p>
      <p>
        <strong>Nacionalidad:</strong> {atleta.nacionalidad}
      </p>
      <p>
        <strong>Género:</strong> {atleta.genero}
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Competencias</h2>
      {atleta.competencias && atleta.competencias.length > 0 ? (
        <ul className="text-left space-y-4">
          {atleta.competencias.map((comp, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-md shadow-md">
              <p>
                <strong>Nombre:</strong> {comp.nombre}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(comp.fecha).toLocaleDateString()}
              </p>
              <p>
                <strong>Resultado:</strong> {comp.resultado}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay competencias registradas para este atleta.</p>
      )}
    </div>
  );
}

export default AtletaDetalle;
