// ruta: src/pages/__tests__/Competencias.test.jsx
import { render, screen } from "@testing-library/react";
import Competencias from "../Competencias";
import { BrowserRouter as Router } from "react-router-dom";

describe("Página de Competencias", () => {
  it("Debe mostrar el título 'Gestión de Competencias'", () => {
    render(
      <Router>
        <Competencias />
      </Router>
    );
    expect(screen.getByText("Gestión de Competencias")).toBeInTheDocument();
  });
});
