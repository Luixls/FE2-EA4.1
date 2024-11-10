// ruta: src/pages/Inicio.jsx
import React from "react";

function Inicio() {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
      <h2 className="text-4xl font-bold text-blue-600 mb-4 text-center dark:text-blue-400">
        Bienvenidos a UVM Torneos
      </h2>
      <p className="text-lg text-gray-700 text-center max-w-2xl dark:text-gray-300 mb-8">
        Administra y visualiza resultados de competencias deportivas de aguas abiertas, natación, acuatlón, triatlón, y atletismo. Permite el registro de atletas, actualización de tiempos, y visualización de ganadores por categoría y general.
      </p>
    </div>
  );
}

export default Inicio;
