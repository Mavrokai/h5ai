const dotenv = require("dotenv");
const express = require("express");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
