// ruta: src/pages/Competencias.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

function Competencias() {
  const [competencias, setCompetencias] = useState([]);
  const [filteredCompetencias, setFilteredCompetencias] = useState([]); // Competencias filtradas
  const [deportes, setDeportes] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [searchCategory, setSearchCategory] = useState(""); // Búsqueda por categoría
  const [filterYear, setFilterYear] = useState(""); // Filtro por año
  const [filterDeporte, setFilterDeporte] = useState(""); // Filtro por deporte
  const [nuevaCompetencia, setNuevaCompetencia] = useState({
    deporte: "",
    categoria: "",
    anio: "",
    participantes: [{ atleta: "", tiempo: "" }],
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("rol") === "admin";

  useEffect(() => {
    fetchCompetencias();
    fetchDeportes();
    fetchAtletas();
  }, []);

  useEffect(() => {
    filterCompetencias();
  }, [searchCategory, filterYear, filterDeporte, competencias]);

  const fetchCompetencias = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/competencias"
      );
      setCompetencias(response.data);
      setFilteredCompetencias(response.data); // Inicializar con todas las competencias
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

  const filterCompetencias = () => {
    let results = competencias;

    // Filtro de categoría
    if (searchCategory) {
      results = results.filter((competencia) =>
        competencia.categoria
          .toLowerCase()
          .includes(searchCategory.toLowerCase())
      );
    }

    // Filtro de año
    if (filterYear) {
      results = results.filter(
        (competencia) => competencia.anio === parseInt(filterYear)
      );
    }

    // Filtro de deporte
    if (filterDeporte) {
      results = results.filter(
        (competencia) => competencia.deporte._id === filterDeporte
      );
    }

    setFilteredCompetencias(results);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCompetencia({ ...nuevaCompetencia, [name]: value });
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipantes = [...nuevaCompetencia.participantes];
    updatedParticipantes[index][field] = value;
    setNuevaCompetencia({
      ...nuevaCompetencia,
      participantes: updatedParticipantes,
    });
  };

  const addParticipant = () => {
    setNuevaCompetencia({
      ...nuevaCompetencia,
      participantes: [
        ...nuevaCompetencia.participantes,
        { atleta: "", tiempo: "" },
      ],
    });
  };

  const removeParticipant = (index) => {
    const updatedParticipantes = [...nuevaCompetencia.participantes];
    updatedParticipantes.splice(index, 1);
    setNuevaCompetencia({
      ...nuevaCompetencia,
      participantes: updatedParticipantes,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(
          `http://localhost:5000/api/competencias/${editId}`,
          nuevaCompetencia,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/competencias",
          nuevaCompetencia,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchCompetencias();
      resetForm();
      setShowForm(false); // Ocultar formulario después de enviar
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
    setShowForm(true); // Mostrar formulario para editar
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/competencias/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompetencias();
      setShowConfirmDelete(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar competencia:", error);
    }
  };

  const confirmDelete = (id) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setNuevaCompetencia({
      deporte: "",
      categoria: "",
      anio: "",
      participantes: [{ atleta: "", tiempo: "" }],
    });
    setEditing(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Gestión de Competencias</h2>

      {/* Búsqueda y Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por categoría"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border p-2 w-full sm:w-1/3 rounded"
        />

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border p-2 w-full sm:w-1/3 rounded"
        >
          <option value="">Filtrar por año</option>
          {[
            ...new Set(competencias.map((competencia) => competencia.anio)),
          ].map((anio) => (
            <option key={anio} value={anio}>
              {anio}
            </option>
          ))}
        </select>

        <select
          value={filterDeporte}
          onChange={(e) => setFilterDeporte(e.target.value)}
          className="border p-2 w-full sm:w-1/3 rounded"
        >
          <option value="">Filtrar por deporte</option>
          {deportes.map((deporte) => (
            <option key={deporte._id} value={deporte._id}>
              {deporte.nombre}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <div className="mb-4">
          <button
            onClick={() => {
              setShowForm(!showForm);
              resetForm();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            {showForm ? "Cerrar formulario" : "Agregar Competencia"}
          </button>
        </div>
      )}

      {/* Formulario para agregar/editar competencias */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 bg-gray-100 rounded shadow-md"
        >
          <select
            name="deporte"
            value={nuevaCompetencia.deporte}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          >
            <option value="">Selecciona un Deporte</option>
            {deportes.map((deporte) => (
              <option key={deporte._id} value={deporte._id}>
                {deporte.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={nuevaCompetencia.categoria}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          />

          <input
            type="number"
            name="anio"
            placeholder="Año"
            value={nuevaCompetencia.anio}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          />

          <h3 className="font-semibold mt-2 mb-2">Participantes:</h3>
          {nuevaCompetencia.participantes.map((participante, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={participante.atleta}
                onChange={(e) =>
                  handleParticipantChange(index, "atleta", e.target.value)
                }
                className="border p-2 w-full"
                required
              >
                <option value="">Selecciona un Atleta</option>
                {atletas.map((atleta) => (
                  <option key={atleta._id} value={atleta._id}>
                    {atleta.nombre}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Tiempo (ej: 1min 3seg)"
                value={participante.tiempo}
                onChange={(e) =>
                  handleParticipantChange(index, "tiempo", e.target.value)
                }
                className="border p-2 w-full"
                required
              />
              <button
                type="button"
                onClick={() => removeParticipant(index)}
                className="bg-red-500 text-white px-2 rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParticipant}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Agregar Participante
          </button>

          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            {editing ? "Guardar Cambios" : "Guardar Competencia"}
          </button>
        </form>
      )}

      {/* Lista de competencias */}
      <ul className="space-y-4">
        {filteredCompetencias.map((competencia) => (
          <li key={competencia._id} className="bg-white p-4 rounded shadow-md">
            {/* Actualización: Deporte y categoría en el mismo encabezado */}
            <h3 className="text-xl font-semibold">
              {competencia.deporte.nombre} - {competencia.categoria}
            </h3>
            <p>Año: {competencia.anio}</p>
            <h4 className="font-semibold">Participantes:</h4>
            <ul className="list-disc pl-5">
              {competencia.participantes.map((p, index) => (
                <li key={index} className="text-gray-700">
                  {p.atleta.nombre} - {p.tiempo}
                </li>
              ))}
            </ul>
            {isAdmin && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(competencia)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDelete(competencia._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              ¿Está seguro que desea eliminar el elemento seleccionado?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Confirmar
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Competencias;
