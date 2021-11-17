const db = require("../db");
const express = require("express");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT comp_Code, amt, paid, paid_date FROM invoices`);
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
  });


module.exports = router;