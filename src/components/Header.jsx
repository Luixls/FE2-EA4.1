// ruta: src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function Header({ toggleModoNocturno, modoNocturno }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMensaje("Sesión cerrada correctamente.");
    setTimeout(() => {
      setMensaje("");
      navigate("/login");
    }, 2000);
    setMenuAbierto(false);
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const closeMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="bg-gray-800 text-white p-4 dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/" onClick={closeMenu}>UVM Torneos</Link>
        </h1>
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none"
        >
          ☰
        </button>

        <AnimatePresence>
          {menuAbierto && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 left-0 w-full bg-gray-800 dark:bg-gray-900 p-4 flex flex-col items-center space-y-4 z-50"
            >
              <Link to="/" className="hover:underline" onClick={closeMenu}>Inicio</Link>
              <Link to="/deportes" className="hover:underline" onClick={closeMenu}>Deportes</Link>
              <Link to="/atletas" className="hover:underline" onClick={closeMenu}>Atletas</Link>
              <Link to="/competencias" className="hover:underline" onClick={closeMenu}>Competencias</Link>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <>
                  <Link to="/registro" className="hover:underline" onClick={closeMenu}>Registro</Link>
                  <Link to="/login" className="hover:underline" onClick={closeMenu}>Iniciar Sesión</Link>
                </>
              )}

              <button
                onClick={() => {
                  toggleModoNocturno();
                  closeMenu();
                }}
                className="w-28 h-8 border border-gray-300 rounded text-sm text-center hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {modoNocturno ? "Modo Claro" : "Modo Nocturno"}
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
      {mensaje && <p className="mt-2 text-center text-green-500">{mensaje}</p>}
    </header>
  );
}

export default Header;
