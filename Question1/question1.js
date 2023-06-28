const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "question1.db");
let db = null;

const startAndRunServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("SERVER RUNNING at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB ERROR: #${e.message}`);
    process.exit(1);
  }
};

startAndRunServer();

app.post("/register/", async (request, response) => {
  const { number, username, password } = request.body;
  console.log(number);
  const checkUserQuery = `SELECT * FROM user WHERE number = ${number};`;
  const userDetails = await db.get(checkUserQuery);
  if (userDetails !== undefined) {
    response.status(400);
    response.send("Number already registered");
  } else {
    const addUserQuery = `INSERT INTO user 
        (number, name, password) 
        VALUES (
            ${number}, '${username}', '${password}'
        )`;

    await db.run(addUserQuery);
    response.send("User added successfully");
  }
});

app.post("/login/", async (request, response) => {
  const { number, password } = request.body;
  if (number === "" || password === "") {
    response.status(400);
    response.send("Number and password fields cannot be empty");
  } else {
    const checkUserQuery = `SELECT * FROM user WHERE number = '${number}';`;
    const dbUser = await db.get(checkUserQuery);
    if (dbUser !== undefined) {
      const checkPassword = await bcrypt.compare(password, dbUser.password);
      if (checkPassword === true) {
        response.status(200);
        response.send("Login success");
      } else {
        response.status(400);
        response.send("Invalid password");
      }
    } else {
      response.status(400);
      response.send("Invalid user");
    }
  }
});
