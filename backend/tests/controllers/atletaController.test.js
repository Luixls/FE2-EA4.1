// ruta: backend/tests/controllers/atletaController.test.js
const request = require("supertest");
const app = require("../../server");

describe("Controlador de Atleta", () => {
  it("Debe obtener todos los atletas", async () => {
    const response = await request(app).get("/api/atletas");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("Debe agregar un nuevo atleta", async () => {
    const newAtleta = { nombre: "Juan Perez", fechaNacimiento: "1995-06-15", nacionalidad: "Mexicana", genero: "masculino" };
    const response = await request(app).post("/api/atletas").send(newAtleta);
    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe(newAtleta.nombre);
  });
});
