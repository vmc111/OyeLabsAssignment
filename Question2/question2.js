const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "question2.db");

let dataBase = null;

const initializeAndRunDb = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("SERVER RUNNING at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DATA BASE ERROR: #${error.message}`);
    process.exit(1);
  }
};

initializeAndRunDb();

app.get("/getSubjects/", async (request, response) => {
  const query = `SELECT c.customerId, c.name, GROUP_CONCAT(s.subjectName, ',') AS subjects
        FROM customers c
        JOIN SubjectStudentMapping m ON c.customerId = m.customerId
        JOIN Subjects s ON m.subjectId = s.subjectId
        GROUP BY c.customerId, c.name
        ORDER BY c.name ASC;
        `;
  const data = await dataBase.all(query);
  response.send(data);
});
