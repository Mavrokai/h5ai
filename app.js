const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT;
const rootPath = process.argv[2] || __dirname;

app.use(express.static(path.join(__dirname, "public")));
app.use("/style", express.static(path.join(__dirname, "style")));

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const relPath = "";
  const absPath = path.join(rootPath, relPath);

  fs.stat(absPath, (err, stats) => {
    if (err) {
      return res.status(404).send("Fichier ou dossier introuvable");
    }
    if (stats.isDirectory()) {
      fs.readdir(absPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
          return res.status(500).send("Erreur de lecture du dossier");
        }
        const files = entries.map((entry) => ({
          name: entry.name,
          path: path.join(relPath, entry.name),
          isDirectory: entry.isDirectory(),
        }));
        res.render("index", {
          files,
          currentPath: "/",
        });
      });
    } else {
      res.sendFile(absPath);
    }
  });
});

app.get(/^(.+)$/, (req, res) => {
  const relPath = req.params[0] || "";
  const absPath = path.join(rootPath, relPath);

  fs.stat(absPath, (err, stats) => {
    if (err) {
      return res.status(404).send("Fichier ou dossier introuvable");
    }
    if (stats.isDirectory()) {
      fs.readdir(absPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
          return res.status(500).send("Erreur de lecture du dossier");
        }
        const files = entries.map((entry) => ({
          name: entry.name,
          path: path.join(relPath, entry.name),
          isDirectory: entry.isDirectory(),
        }));
        res.render("index", {
          files,
          currentPath: "/" + relPath,
        });
      });
    } else {
      res.sendFile(absPath);
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
