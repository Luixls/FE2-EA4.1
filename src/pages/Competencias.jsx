// ruta: src/pages/Competencias.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

function Competencias() {
  const [competencias, setCompetencias] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [nuevaCompetencia, setNuevaCompetencia] = useState({
    deporte: "",
    categoria: "",
    anio: "",
    participantes: [{ atleta: "", tiempo: "" }],
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("rol") === "admin";

  useEffect(() => {
    fetchCompetencias();
    fetchDeportes();
    fetchAtletas();
  }, []);

  const fetchCompetencias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/competencias");
      setCompetencias(response.data);
    } catch (error) {
      console.error("Error al obtener competencias:", error);
    }
  };

  const fetchDeportes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/deportes");
      setDeportes(response.data);
    } catch (error) {
      console.error("Error al obtener deportes:", error);
    }
  };

  const fetchAtletas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/atletas");
      setAtletas(response.data);
    } catch (error) {
      console.error("Error al obtener atletas:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCompetencia({ ...nuevaCompetencia, [name]: value });
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipantes = [...nuevaCompetencia.participantes];
    updatedParticipantes[index][field] = value;
    setNuevaCompetencia({ ...nuevaCompetencia, participantes: updatedParticipantes });
  };

  const addParticipant = () => {
    setNuevaCompetencia({
      ...nuevaCompetencia,
      participantes: [...nuevaCompetencia.participantes, { atleta: "", tiempo: "" }],
    });
  };

  const removeParticipant = (index) => {
    const updatedParticipantes = [...nuevaCompetencia.participantes];
    updatedParticipantes.splice(index, 1);
    setNuevaCompetencia({ ...nuevaCompetencia, participantes: updatedParticipantes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/competencias/${editId}`, nuevaCompetencia, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/competencias", nuevaCompetencia, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchCompetencias();
      resetForm();
    } catch (error) {
      console.error("Error al guardar competencia:", error);
    }
  };

  const handleEdit = (competencia) => {
    setNuevaCompetencia({
      deporte: competencia.deporte._id,
      categoria: competencia.categoria,
      anio: competencia.anio,
      participantes: competencia.participantes.map((p) => ({
        atleta: p.atleta._id,
        tiempo: p.tiempo,
      })),
    });
    setEditing(true);
    setEditId(competencia._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/competencias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompetencias();
    } catch (error) {
      console.error("Error al eliminar competencia:", error);
    }
  };

  const resetForm = () => {
    setNuevaCompetencia({ deporte: "", categoria: "", anio: "", participantes: [{ atleta: "", tiempo: "" }] });
    setEditing(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Gestión de Competencias</h2>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-4">
          <select name="deporte" value={nuevaCompetencia.deporte} onChange={handleInputChange} required>
            <option value="">Selecciona un Deporte</option>
            {deportes.map((deporte) => (
              <option key={deporte._id} value={deporte._id}>{deporte.nombre}</option>
            ))}
          </select>

          <input type="text" name="categoria" placeholder="Categoría" value={nuevaCompetencia.categoria} onChange={handleInputChange} required />

          <input type="number" name="anio" placeholder="Año" value={nuevaCompetencia.anio} onChange={handleInputChange} required />

          <h3>Participantes:</h3>
          {nuevaCompetencia.participantes.map((participante, index) => (
            <div key={index} className="mb-2">
              <select value={participante.atleta} onChange={(e) => handleParticipantChange(index, "atleta", e.target.value)} required>
                <option value="">Selecciona un Atleta</option>
                {atletas.map((atleta) => (
                  <option key={atleta._id} value={atleta._id}>{atleta.nombre}</option>
                ))}
              </select>
              <input type="text" placeholder="Tiempo (ej. 1min 3seg)" value={participante.tiempo} onChange={(e) => handleParticipantChange(index, "tiempo", e.target.value)} required />
              {index > 0 && (
                <button type="button" onClick={() => removeParticipant(index)}>-</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addParticipant}>Agregar Participante</button>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editing ? "Actualizar Competencia" : "Crear Competencia"}
          </button>
        </form>
      )}

      <ul>
        {competencias.map((competencia) => (
          <li key={competencia._id} className="p-4 bg-white shadow mb-2 rounded">
            <h3 className="font-bold">{competencia.deporte.nombre} - {competencia.categoria} ({competencia.anio})</h3>
            <ul>
              {competencia.participantes.map((p, index) => (
                <li key={index}>{p.atleta.nombre} - {p.tiempo}</li>
              ))}
            </ul>
            {isAdmin && (
              <div>
                <button onClick={() => handleEdit(competencia)}>Editar</button>
                <button onClick={() => handleDelete(competencia._id)}>Eliminar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Competencias;
