// npm packages
const request = require("supertest");
const { response } = require("../app");

// app imports
const app = require("../app");
const db = require("../db");

afterAll(async function(){
    await db.query(`DELETE FROM industries WHERE code='test'`);
    await db.query(`DELETE FROM industry_company WHERE (indust_code='test' AND comp_code ='test') `)
    
});

afterAll(async function() {
    // close db connection
    await db.end();
  });

describe("GET industries",function(){
    test("GETS list of industries", async function(){
        const response = await request(app).get('/industries');
        expect(response.statusCode).toEqual(200);
        //following works with toEqual as well
        expect(response.body).toEqual({
            "industries": [
              {
                "code": "act",
                "industry_name": "accounting",
                "companies": [
                  "apple",
                  "ibm"
                ]
              },
              {
                "code": "ent",
                "industry_name": "entertainment",
                "companies": [
                  "ibm"
                ]
              },
              {
                "code": "hr",
                "industry_name": "human resources",
                "companies": [
                  "apple",
                  "ibm"
                ]
              }
            ]
          })
    });
});

describe("Posting & updating industriesfunctions", function(){
    test("POST a new industry", async function(){
        const response = await request(app)
        .post('/industries')
        .send({"code":"test","industry_name":"testing new industry post"});

        expect(response.status).toEqual(201);
        expect(response.body).toEqual({
            "industry": {
              "code": "test",
              "industry_name": "testing new industry post"
            }
          });

    });

    test("POST a new industry_company relation", async function(){
        const response = await request(app)
        .post('/industries/test')
        .send({"indust_code":"test", "comp_code":"test"});

        expect(response.status).toEqual(201);
        expect(response.body).toEqual({
            "company": {
              "indust_code": "test",
              "comp_code": "test"
            }
          })
    })

    
})