const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "question3.db");

let dataBase = null;

const initializeAndRunDb = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Move the app.listen() outside of the try-catch block
  } catch (error) {
    console.log(`DATA BASE ERROR: #${error.message}`);
    process.exit(1);
  }
};

initializeAndRunDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("SERVER RUNNING at http://localhost:3000");
    });
    const customers = [
      {
        email: "anurag11@yopmail.com",
        name: "anurag",
      },
      {
        email: "sameer11@yopmail.com",
        name: "sameer",
      },
      {
        email: "ravi11@yopmail.com",
        name: "ravi",
      },
      {
        email: "akash11@yopmail.com",
        name: "akash",
      },
      {
        email: "anjali11@yopmail.com",
        name: "anjai",
      },
      {
        email: "santosh11@yopmail.com",
        name: "santosh",
      },
    ];

    const insertData = async (customers) => {
      for (const eachCustomer of customers) {
        const { email, name } = eachCustomer;

        // check if Email already exists
        const checkEmailQuery = `SELECT * FROM customers WHERE email = '${email}'`;
        const dbEmail = await dataBase.get(checkEmailQuery);

        if (dbEmail === undefined) {
          const addQuery = `INSERT INTO customers (name, email) VALUES ('${name}', '${email}')`;
          await dataBase.run(addQuery);
        } else {
          const updateNameQuery = `UPDATE customers SET name = '${name}' WHERE email = '${email}'`;
          await dataBase.run(updateNameQuery);
        }
      }

      const updatedTableQuery = `SELECT * FROM customers`;
      const updatedTable = await dataBase.all(updatedTableQuery);
      console.log(updatedTable);
    };

    insertData(customers);
  })
  .catch((error) => {
    console.log(`ERROR: ${error.message}`);
    process.exit(1);
  });
