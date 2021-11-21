const db = require("../db");
const express = require("express");
const expressError = require("../expressError");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT name, id, comp_code, amt, paid, add_date, paid_date
            FROM invoices, companies
            WHERE comp_code = code 
            ORDER BY id`);
  
      return res.json({'invoices' : results.rows});
    }
  
    catch (err) {
      return next(err);
    }
  });

router.get("/:id", async function(req, res, next){

try{
    const {id} = req.params;
    const results = await db.query(
        `SELECT id, amt, paid, add_date, paid_date, c.name, c.description
        FROM invoices 
        INNER JOIN companies AS c ON (comp_code = c.code)  
        WHERE id = $1`, [id]
    )
    
    if (results.rows.length == 0) {
        throw new expressError(`INVOICE ${id} NOT FOUND`, 404)
      } else {
        return res.json({"company": results.rows[0]});
      }

} catch(err) {
    return next(err);
}
});


router.post("/", async function(req, res, next){

try{
    const { comp_code, amt } = req.body;
    const results = await db.query(
        `INSERT INTO invoices (comp_code, amt) 
        VALUES ($1,$2) 
        RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]
    )
    return res.json({"invoice": results.rows[0]});

} catch(err) {
    return next(err);
}
})


router.put("/:id", async function(req, res, next){

    try{
        const { id }  = req.params;
        const { amt, paid } = req.body;
        let paidDate = null;

        const paidStatus = await db.query(
          `SELECT paid, amt, paid_date 
          FROM invoices 
          WHERE id=$1`, [id]
        )

        if (paidStatus.rows.length === 0) {
          throw new ExpressError(`Invoice #${id} not found`, 404);
        }

        currentPaidDate = paidStatus.rows[0].paid_date;
        console.log("currentPaidDate", currentPaidDate);

        // If paying unpaid invoice: sets paid_date to todaysets paid_date to today       
        if (!currentPaidDate && paid) {
          paidDate = new Date();
          // If un-paying: sets paid_date to null
        } else if (!paid) {
          paidDate = null
          // Else: keep current paid_date
        } else {
          paidDate = currentPaidDate;
        }

        const results = await db.query(
            `UPDATE invoices 
            SET amt=$1, paid_date=$2, paid=$3 WHERE id = $4 
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paidDate, paid, id]
        );

        if (results.rows.length == 0) {
            throw new expressError(`${code} COMPANY NOT FOUND`, 404)
          } else {
            return res.json({"invoice": results.rows[0]});
          }
    
    } catch(err) {
        return next(err);
    }
    });

    router.delete("/:id", async function(req, res, next){

        try{
            const { id } = req.params;
            const results = await db.query(
                `DELETE FROM invoices 
                WHERE id = $1
                RETURNING id`, [id]
            )
            
            if (results.rows.length == 0) {
                throw new expressError(`INVOICE ${id} NOT FOUND`, 404)
              } else {
                return res.json({"INVOICE": `${id} DELETED`});
              }
        
        } catch(err) {
            return next(err);
        }
        });

        


module.exports = router;