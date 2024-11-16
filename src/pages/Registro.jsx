import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setTimeout(() => setError(""), 3000); // Elimina el mensaje después de 3 segundos
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/registro", {
        username: formData.username,
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      setMensaje(
        "Usuario registrado exitosamente. Redirigiendo a inicio de sesión..."
      );

      // Redirigir después de 3 segundos
      setTimeout(() => {
        setMensaje("");
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.response.data.mensaje || "Error al registrar usuario.");
      setTimeout(() => setError(""), 3000); // Elimina el mensaje después de 3 segundos
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 dark:text-gray-100">
        Registro de Usuario
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          name="username"
          placeholder="Nombre de usuario"
          onChange={handleChange}
          value={formData.username}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          name="nombre"
          placeholder="Nombre completo"
          onChange={handleChange}
          value={formData.nombre}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          value={formData.email}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          value={formData.password}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Registrar
        </button>
      </form>
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      {mensaje && <p className="mt-4 text-center text-green-600">{mensaje}</p>}
    </div>
  );
}

export default Registro;
