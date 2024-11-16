// ruta: backend/tests/controllers/competenciaController.test.js
const request = require("supertest");
const app = require("../../server");

describe("Controlador de Competencia", () => {
  it("Debe obtener todas las competencias", async () => {
    const response = await request(app).get("/api/competencias");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
