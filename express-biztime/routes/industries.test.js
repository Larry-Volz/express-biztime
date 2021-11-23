// npm packages
const request = require("supertest");
const { response } = require("../app");

// app imports
const app = require("../app");
const db = require("../db");

afterAll(async function() {
    // close db connection
    await db.end();
  });

describe("GET industries",function(){
    test("GETS list of industries", async function(){
        const response = await request(app).get('/industries');
        expect(response.statusCode).toEqual(201);
        expect(response.body).toContain(`{"code": "ent","industry_name": "entertainment","companies": ["ibm"]}`)
    });

    // expect()
});