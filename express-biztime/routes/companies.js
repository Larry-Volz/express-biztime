const db = require("../db");
const express = require("express");
const expressError = require("../expressError");
const router = express.Router();
const slugify = require("slugify");

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


router.get('/:code', async function(req, res, next){
    try{
        const { code } = req.params;

        const computersRes = await db.query(
            `SELECT code, name, description
             FROM companies
             WHERE code = $1`,
          [code]
      );
  
      const invoicesRes = await db.query(
            `SELECT id
             FROM invoices
             WHERE comp_code = $1`,
          [code]
      );

        if (computersRes.rows.length == 0) {
            throw new expressError(`${code} COMPANY NOT FOUND`, 404)
          } else {

            const company = computersRes.rows[0];
            const invoices = invoicesRes.rows;


            const industList = await db.query(
              `SELECT indust_code, comp_code, industry_name
              FROM industry_company
              JOIN industries
              ON code=indust_code
              WHERE comp_code = $1`, [code]
            )

            const industries = industList.rows;
            company.industries = industries.map(ind => ind.industry_name)



            company.invoices = invoices.map(inv => inv.id);
            //to create {company:code,name, description, invoices: [id,,,]}
            
            return res.json({"company": company });
          }

    } catch(err) {
        next(err)
    }


});


router.post("/", async function(req, res, next){

try{
    const { name, description } = req.body;

    let code = slugify(name, {
      // replacement: '-',  // replace spaces with replacement character, defaults to `-`
      // remove: undefined, // remove characters that match regex, defaults to `undefined`
      // lower: false,      // convert to lower case, defaults to `false`
      // strict: false,     // strip special characters except replacement, defaults to `false`
      // locale: 'vi',       // language code of the locale to use
      // trim: true         // trim leading and trailing replacement chars, defaults to `true`
    });

    const results = await db.query(
        `INSERT INTO companies (code, name, description) 
        VALUES ($1,$2,$3) 
        RETURNING code, name, description`, [code, name, description]
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


