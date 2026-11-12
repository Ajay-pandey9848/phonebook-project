
const request = require("supertest");
const app = require("./app");

describe("Phonebook API", () => {
  test("home route works", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Phonebook backend is running!");
  });
});
