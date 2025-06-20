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
    if (err) {
      console.error("Erreur /api/tree :", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(tree);
  });
});

app.get("/", (req, res) => {
  RecMain.handlePath(req, res, rootPath, "");
});

app.get("/search", (req, res) => {
  const q = req.query.q || "";
  if (!q) return res.json([]);
  try {
    const results = searchFiles(rootPath, q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(/^(.+)$/, (req, res) => {
  RecMain.handlePath(req, res, rootPath, req.params[0] || "");
});

function searchFiles(dir, query, results = [], relBase = "") {
  const items = fs.readdirSync(dir);
  for (const name of items) {
    const absPath = path.join(dir, name);
    const relPath = path.join(relBase, name);
    let stat;
    try {
      stat = fs.statSync(absPath);
    } catch (e) {
      continue;
    }
    if (name.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        name: name,
        path: relPath,
        isDirectory: stat.isDirectory(),
      });
    }
    if (stat.isDirectory()) {
      searchFiles(absPath, query, results, relPath);
    }
  }
  return results;
}

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
