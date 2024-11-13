// ruta: backend/tests/controllers/deporteController.test.js
const request = require("supertest");
const app = require("../../server");

describe("Controlador de Deporte", () => {
  it("Debe obtener todos los deportes", async () => {
    const response = await request(app).get("/api/deportes");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
