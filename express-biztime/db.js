/** Database setup for BizTime. */

const { Client } = require("pg");
process.env.NODE_ENV = "test"

let DB_URI;

//TODO: CREATE USERS_TEST database - then do tests

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///users_test";
  console.log(`############################### OPERATING IN TEST MODE ########################################`)
} else {
  DB_URI = "postgresql:///biztime";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;