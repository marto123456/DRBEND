import mysql from "mysql"

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "P@ssw0rd",
  database: "discovereality",
})

db.connect(function (err) {
  if (err) throw err
  console.log("Connected to database")
})
