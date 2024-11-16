// ruta: src/components/__tests__/Footer.test.jsx
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Componente Footer", () => {
  it("Debe mostrar el texto del footer", () => {
    render(<Footer />);
    expect(screen.getByText(/todos los derechos reservados/i)).toBeInTheDocument();
  });
});
