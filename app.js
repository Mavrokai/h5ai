const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const RecMain = require("./script/RecMain.mjs");

const app = express();
const port = process.env.PORT;
const rootPath = process.argv[2] || __dirname;

app.use("/script", express.static(path.join(__dirname, "script")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/style", express.static(path.join(__dirname, "style")));

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

app.get("/api/tree", (req, res) => {
  const relPath = req.query.path || "";
  RecMain.getTree(rootPath, relPath, (err, tree) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tree);
  });
});

app.get("/", (req, res) => {
  RecMain.handlePath(req, res, rootPath, "");
});

app.get(/^(.+)$/, (req, res) => {
  RecMain.handlePath(req, res, rootPath, req.params[0] || "");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
