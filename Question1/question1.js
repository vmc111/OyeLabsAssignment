const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

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

// 1)1. Make a api for phone number login
// a. Make add Customer api for customer, assume admin is adding customer ..
// use the input params validation, code commenting, logging and check for
// duplicates where required .

// Assuming api url path to be "/register/" and post method is used to send phone number and userName

app.post("/register/", async (request, response) => {
  const { number, username, password } = request.body;
  console.log(number);
  //   Check if user is already registered
  const checkUserQuery = `SELECT * FROM user WHERE number = ${number};`;
  const userDetails = await db.get(checkUserQuery);
  if (userDetails !== undefined) {
    response.status(400);
    response.send("Number already Registered");
  } else {
    // using Bcrypt to hash password before saving into Data Base
    const addUserQuery = `INSERT INTO user 
        (
            number, username, password
        ) 
        VALUES(
            ${num}, '${username}', '${password}'
        )`;

    await db.run(addUserQuery);
    response.send("User added Successfully");
  }
});

// Login Api assuming path to be "/login/"

app.post("/login/", async (request, response) => {
  const { number, password } = request.body;
  //validate input fields
  if (number === "" || password === "") {
    response.status(400);
    response.send("number and password fields cannot be empty");
  } else {
    const checkUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
    //checking whether the user exists or not
    const dbUser = await dataBase.get(checkUserQuery);
    if (dbUser !== undefined) {
      const checkPassword = await bcrypt.compare(password, dbUser.password);
      if (checkPassword === true) {
        response.status(200);
        response.send("Login Success");
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
