const db = require("../db");
const express = require("express");
const expressError = require("../expressError");
const router = express.Router();


//GET all industries - show company codes for each

router.get("/", async function (req, res, next) {
    try {
    //1st just get the industry codes - then get the companies that have them and add to object
      const industries = await db.query(
            `SELECT code, industry_name
            FROM industries 
            ORDER BY code`);

    const companies = await db.query(
        `SELECT comp_code, indust_code
            FROM industry_company`);

    
    for (idx in industries.rows){
        let currIndustries = new Set;       
        for (company of companies.rows){
            console.log("company", company);
            if (industries.rows[idx].code == company.indust_code){
                currIndustries.add(company.comp_code);
            }
        }

        currIndustries = Array.from(currIndustries);
        industries.rows[idx].companies = currIndustries
    }
      return res.json({'industries' : industries.rows});
    }
  
    catch (err) {
      return next(err);
    }
  });

//POST a new industry
router.post('/', async function(req, res, next){
    try{

        //get code, industry_name from req
        let {code, industry_name} = req.body;

        //create it in sql

        const results = await db.query(
            `INSERT INTO industries (code, industry_name) 
            VALUES ($1,$2) 
            RETURNING code, industry_name`, [code, industry_name]
            )
    return res.json({"industry": results.rows[0]})

    } catch(err){
        next(err);
    }
})

/**associating an industry to a company 
 * For further study/development:
 * - make sure company exists
 * - make sure industry exists
 * - check/prevent duplication
*/

//make route /:company
router.post('/:company', async function(req, res, next){
    try{
        //get industry from body
        let { indust_code } = req.body;
        let {company} = req.params;

        console.log(`industry ${indust_code} company ${company}`)

        //patch company to add industry

        const results = await db.query(
            `INSERT INTO industry_company (indust_code, comp_code) 
            VALUES ($1, $2) 
            RETURNING indust_code, comp_code`, [indust_code, company]
        );

        if (results.rows.length == 0) {
            throw new expressError(`${code} COMPANY NOT FOUND OR UPDATED`, 404)
          } else {
            return res.json({"company": results.rows[0]});
          }

    } catch(err) {
        next(err);
    }
});



module.exports = router;