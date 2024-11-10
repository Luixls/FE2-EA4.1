// ruta: src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PaginaAnimada from "./components/PaginaAnimada";
import Inicio from "./pages/Inicio";
import Deportes from "./pages/Deportes";
import Atletas from "./pages/Atletas";
import Competencias from "./pages/Competencias";
import SeccionAdministrativa from "./pages/SeccionAdministrativa";
import Registro from "./pages/Registro";
import Login from "./pages/Login";

function App() {
  const [modoNocturno, setModoNocturno] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", modoNocturno);
  }, [modoNocturno]);

  const toggleModoNocturno = () => {
    setModoNocturno(!modoNocturno);
  };

  return (
    <>
      <Header toggleModoNocturno={toggleModoNocturno} modoNocturno={modoNocturno} />
      <main className="container mx-auto p-4">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PaginaAnimada><Inicio /></PaginaAnimada>} />
            <Route path="/deportes" element={<PaginaAnimada><Deportes /></PaginaAnimada>} />
            <Route path="/atletas" element={<PaginaAnimada><Atletas /></PaginaAnimada>} />
            <Route path="/competencias" element={<PaginaAnimada><Competencias /></PaginaAnimada>} />
            <Route path="/seccion-administrativa" element={<PaginaAnimada><SeccionAdministrativa /></PaginaAnimada>} />
            <Route path="/registro" element={<PaginaAnimada><Registro /></PaginaAnimada>} />
            <Route path="/login" element={<PaginaAnimada><Login /></PaginaAnimada>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default App;
