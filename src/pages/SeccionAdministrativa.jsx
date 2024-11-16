import React, { useState, useEffect } from "react";
import axios from "axios";

function SeccionAdministrativa() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    nombre: "",
    email: "",
    password: "",
    rol: "mod",
  });
  const [sistemaPassword, setSistemaPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
    } catch (error) {
      setError("Error al obtener los usuarios.");
      resetMessages();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    if (!sistemaPassword) {
      setError("Debe ingresar la contraseña del sistema.");
      resetMessages();
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/usuarios",
        { ...nuevoUsuario, sistemaPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Usuario creado exitosamente.");
      fetchUsuarios();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.mensaje || "Error al crear usuario.");
      resetMessages();
    }
  };

  const handleEliminarUsuario = async () => {
    if (!sistemaPassword) {
      setError("Debe ingresar la contraseña del sistema.");
      resetMessages();
      return;
    }
    try {
      await axios.delete(
        `http://localhost:5000/api/usuarios/${usuarioAEliminar}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { sistemaPassword },
        }
      );
      setSuccess("Usuario eliminado exitosamente.");
      fetchUsuarios();
      setShowDeletePopup(false);
      setSistemaPassword("");
    } catch (error) {
      setError(error.response?.data?.mensaje || "Error al eliminar usuario.");
      resetMessages();
    }
  };

  const confirmEliminarUsuario = (id) => {
    setUsuarioAEliminar(id);
    setShowDeletePopup(true);
  };

  const resetForm = () => {
    setNuevoUsuario({
      username: "",
      nombre: "",
      email: "",
      password: "",
      rol: "mod",
    });
    setSistemaPassword("");
    setShowForm(false);
  };

  const resetMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">
        Sección Administrativa
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <div className="mb-6 text-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? "Ocultar formulario" : "Crear un nuevo usuario"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-center">
            Crear Nuevo Usuario
          </h3>
          <form onSubmit={handleCrearUsuario} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={nuevoUsuario.username}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={nuevoUsuario.email}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={nuevoUsuario.password}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full"
            />
            <select
              name="rol"
              value={nuevoUsuario.rol}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="mod">Moderador</option>
              <option value="admin">Administrador</option>
            </select>
            <input
              type="password"
              placeholder="Contraseña del sistema"
              value={sistemaPassword}
              onChange={(e) => setSistemaPassword(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Crear Usuario
            </button>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">Usuarios Registrados</h3>
        <ul className="space-y-4">
          {usuarios.map((usuario) => (
            <li
              key={usuario._id}
              className="p-4 bg-gray-100 rounded shadow relative"
            >
              <p>
                <strong>Username:</strong> {usuario.username}
              </p>
              <p>
                <strong>Nombre:</strong> {usuario.nombre}
              </p>
              <p>
                <strong>Email:</strong> {usuario.email}
              </p>
              <p>
                <strong>Rol:</strong> {usuario.rol}
              </p>
              <button
                onClick={() => confirmEliminarUsuario(usuario._id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Inserte la contraseña del sistema para confirmar la eliminación
              del usuario seleccionado.
            </h3>
            <input
              type="password"
              placeholder="Contraseña del sistema"
              value={sistemaPassword}
              onChange={(e) => setSistemaPassword(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              required
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setSistemaPassword("");
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarUsuario}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeccionAdministrativa;
