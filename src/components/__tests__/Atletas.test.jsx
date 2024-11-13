// ruta: src/pages/__tests__/Atletas.test.jsx
import { render, screen } from "@testing-library/react";
import Atletas from "../Atletas";
import { BrowserRouter as Router } from "react-router-dom";

describe("Página de Atletas", () => {
  it("Debe mostrar el título 'Gestión de Atletas'", () => {
    render(
      <Router>
        <Atletas />
      </Router>
    );
    expect(screen.getByText("Gestión de Atletas")).toBeInTheDocument();
  });
});
