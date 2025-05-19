const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connection = require("./config/db");

const app = express();
app.use(
  cors({
    origin: "https://habit-vault-fe.vercel.app/",
    // origin: "http://localhost:5173/",
    credentials: true,
    httpOnly: true
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use("/habit_vault/api/user", require("./routes/userRoutes"));
app.use("/habit_vault/api/habit", require("./routes/habitRoutes"));

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
