const db = require("../db");
const express = require("express");
const expressError = require("../expressError");
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
});


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


router.put("/:code", async function(req, res, next){

    try{
        const code = req.params.code;
        const { name, description } = req.body;

        const results = await db.query(
            `UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description`, [name, description, code]
        );

        if (results.rows.length == 0) {
            throw new expressError(`${code} COMPANY NOT FOUND`, 404)
          } else {
            return res.json({"company": results.rows[0]});
          }
    
    } catch(err) {
        return next(err);
    }
    });

    router.delete("/:code", async function(req, res, next){

        try{
            const code = req.params.code;
            const results = await db.query(
                `DELETE FROM companies 
                WHERE code = $1
                RETURNING code`, [code]
            )
            
            if (results.rows.length == 0) {
                throw new expressError(`${code} COMPANY NOT FOUND`, 404)
              } else {
                return res.json({"status": `${code} DELETED`});
              }
        
        } catch(err) {
            return next(err);
        }
        });


module.exports = router;