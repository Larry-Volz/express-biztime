const db = require("../db");
const express = require("express");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT code, name 
            FROM companies 
            ORDER BY name`);
  
      return res.json({'companies' : results.rows});
    }
  
    catch (err) {
      return next(err);
    }
  });

router.get("/:code", async function(req, res, next){

try{
    const code = req.params.code;
    const results = await db.query(
        `SELECT code, name, description FROM companies WHERE code = $1`, [code]
    )
    return res.json({"company": results.rows[0]})

} catch(err) {
    return next(err);
}
})


router.post("/", async function(req, res, next){

try{
    const { code, name, description } = req.body;
    const results = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description`, [code, name, description]
    )
    return res.json({"company": results.rows[0]})

} catch(err) {
    return next(err);
}
})


module.exports = router;