// ruta: src/pages/Deportes.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function Deportes() {
  const [deportes, setDeportes] = useState([]);
  const [nuevoDeporte, setNuevoDeporte] = useState({ nombre: "", descripcion: "", imagen: "" });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  const isAuthenticated = !!token;
  const isAdmin = isAuthenticated && userRole === "admin";
  const isMod = isAuthenticated && userRole === "mod";

  useEffect(() => {
    fetchDeportes();
  }, []);

  const fetchDeportes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/deportes");
      setDeportes(response.data);
    } catch (error) {
      console.error("Error al obtener deportes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoDeporte({ ...nuevoDeporte, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateDeporte();
    } else {
      await createDeporte();
    }
  };

  const createDeporte = async () => {
    try {
      await axios.post("http://localhost:5000/api/deportes", nuevoDeporte, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDeportes();
      resetForm();
    } catch (error) {
      console.error("Error al crear deporte:", error);
    }
  };

  const updateDeporte = async () => {
    try {
      await axios.put(`http://localhost:5000/api/deportes/${editId}`, nuevoDeporte, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDeportes();
      resetForm();
    } catch (error) {
      console.error("Error al actualizar deporte:", error);
    }
  };

  const handleEdit = (deporte) => {
    setNuevoDeporte({ nombre: deporte.nombre, descripcion: deporte.descripcion, imagen: deporte.imagen });
    setEditing(true);
    setEditId(deporte._id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/deportes/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDeportes();
      setShowConfirmDelete(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar deporte:", error);
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
    setNuevoDeporte({ nombre: "", descripcion: "", imagen: "" });
    setEditing(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Gestión de Deportes</h2>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Deporte"
            value={nuevoDeporte.nombre}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción del Deporte"
            value={nuevoDeporte.descripcion}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            name="imagen"
            placeholder="URL de la Imagen"
            value={nuevoDeporte.imagen}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editing ? "Actualizar Deporte" : "Crear Deporte"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deportes.map((deporte) => (
          <div key={deporte._id} className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            {deporte.imagen && (
              <img src={deporte.imagen} alt={deporte.nombre} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-2xl font-semibold mb-2">{deporte.nombre}</h3>
              <p className="text-gray-700 mb-4">{deporte.descripcion}</p>
              <div className="flex space-x-2">
                {(isAdmin || isMod) && (
                  <button
                    onClick={() => handleEdit(deporte)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => confirmDelete(deporte._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
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

export default Deportes;
