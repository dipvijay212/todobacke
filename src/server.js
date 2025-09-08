const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database/index");
const path = require("path");

app.use(cors({ origin: ["http://localhost:3000/", "https://todofront-chi.vercel.app/"] }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

const router = require("./api/router/userRouter");
app.use("/api/users", router);
const todoRouter = require("./api/router/todoRouter");
app.use("/api/todos", todoRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;


