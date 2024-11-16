// ruta: src/components/__tests__/Header.test.jsx
import { render, screen } from "@testing-library/react";
import Header from "../Header";
import { BrowserRouter as Router } from "react-router-dom";

describe("Componente Header", () => {
  it("Debe mostrar el título 'UVM Torneos'", () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByText("UVM Torneos")).toBeInTheDocument();
  });
});
