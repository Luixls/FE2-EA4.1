// ruta: src/pages/Atletas.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function Atletas() {
  const [atletas, setAtletas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroNacionalidad, setFiltroNacionalidad] = useState("");
  const [filtroAnioNacimiento, setFiltroAnioNacimiento] = useState("");
  const [nuevoAtleta, setNuevoAtleta] = useState({ nombre: "", fechaNacimiento: "", nacionalidad: "", genero: "masculino" });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  const isAuthenticated = !!token;
  const isAdmin = isAuthenticated && userRole === "admin";
  const isMod = isAuthenticated && userRole === "mod";

  useEffect(() => {
    fetchAtletas();
  }, []);

  const fetchAtletas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/atletas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAtletas(response.data);
    } catch (error) {
      console.error("Error al obtener atletas:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAtleta({ ...nuevoAtleta, [name]: value });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setNuevoAtleta({ nombre: "", fechaNacimiento: "", nacionalidad: "", genero: "masculino" });
    setEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateAtleta();
    } else {
      await createAtleta();
    }
  };

  const createAtleta = async () => {
    try {
      await axios.post("http://localhost:5000/api/atletas", nuevoAtleta, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAtletas();
      toggleForm();
    } catch (error) {
      console.error("Error al crear atleta:", error);
    }
  };

  const updateAtleta = async () => {
    try {
      await axios.put(`http://localhost:5000/api/atletas/${editId}`, nuevoAtleta, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAtletas();
      toggleForm();
    } catch (error) {
      console.error("Error al actualizar atleta:", error);
    }
  };

  const handleEdit = (atleta) => {
    setNuevoAtleta({
      nombre: atleta.nombre,
      fechaNacimiento: atleta.fechaNacimiento,
      nacionalidad: atleta.nacionalidad,
      genero: atleta.genero,
    });
    setEditing(true);
    setEditId(atleta._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/atletas/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAtletas();
      setShowConfirmDelete(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar atleta:", error);
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

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const resetForm = () => {
    setNuevoAtleta({ nombre: "", fechaNacimiento: "", nacionalidad: "", genero: "masculino" });
    setEditing(false);
    setEditId(null);
  };

  const atletasFiltrados = atletas.filter((atleta) => {
    const coincideNombre = atleta.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideGenero = filtroGenero ? atleta.genero === filtroGenero : true;
    const coincideNacionalidad = filtroNacionalidad ? atleta.nacionalidad.toLowerCase().includes(filtroNacionalidad.toLowerCase()) : true;
    const coincideAnioNacimiento = filtroAnioNacimiento ? atleta.fechaNacimiento.startsWith(filtroAnioNacimiento) : true;

    return coincideNombre && coincideGenero && coincideNacionalidad && coincideAnioNacimiento;
  });

  const paginatedAtletas = atletasFiltrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(atletasFiltrados.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Gestión de Atletas</h2>

      {/* Botón para mostrar formulario */}
      {isAdmin && (
        <button onClick={toggleForm} className="bg-blue-500 text-white p-2 rounded mb-4">
          {showForm ? "Ocultar Formulario" : editing ? "Editar Atleta" : "Agregar Atleta"}
        </button>
      )}

      {/* Formulario para agregar/editar atleta */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Atleta"
            value={nuevoAtleta.nombre}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="date"
            name="fechaNacimiento"
            placeholder="Fecha de Nacimiento"
            value={nuevoAtleta.fechaNacimiento}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            name="nacionalidad"
            placeholder="Nacionalidad"
            value={nuevoAtleta.nacionalidad}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          />
          <select
            name="genero"
            value={nuevoAtleta.genero}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Confirmar
          </button>
        </form>
      )}

      {/* Búsqueda y Filtros */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Filtrar por género</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
        <input
          type="text"
          placeholder="Filtrar por nacionalidad"
          value={filtroNacionalidad}
          onChange={(e) => setFiltroNacionalidad(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Filtrar por año de nacimiento"
          value={filtroAnioNacimiento}
          onChange={(e) => setFiltroAnioNacimiento(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
      </div>

      <ul className="space-y-4">
        {paginatedAtletas.map((atleta) => (
          <li key={atleta._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{atleta.nombre}</h3>
            <p>Fecha de Nacimiento: {new Date(atleta.fechaNacimiento).toLocaleDateString()}</p>
            <p>Nacionalidad: {atleta.nacionalidad}</p>
            <p>Género: {atleta.genero}</p>

            <div className="mt-2">
              {(isAdmin || isMod) && (
                <button
                  onClick={() => handleEdit(atleta)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Editar
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => confirmDelete(atleta._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Eliminar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">¿Está seguro que desea eliminar el elemento seleccionado?</h3>
            <div className="flex justify-end space-x-4">
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                Confirmar
              </button>
              <button onClick={cancelDelete} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Atletas;
