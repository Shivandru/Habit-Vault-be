const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.use("/", (req, res) => {
  res.send(`welcome to hobbie vault`);
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
