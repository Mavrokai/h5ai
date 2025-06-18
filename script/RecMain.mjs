import fs from "fs";
import path from "path";

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};

function listDirectory(absPath, relPath, callback) {
  fs.readdir(absPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return callback(err);
    }
    const files = entries.map((entry) => {
      const entryPath = path.join(absPath, entry.name);
      const stats = fs.statSync(entryPath);
      return {
        name: entry.name,
        path: path.join(relPath, entry.name),
        isDirectory: entry.isDirectory(),
        isFile: entry.isFile(),
        size: stats.size,
        formattedSize: entry.isDirectory() ? "-" : formatFileSize(stats.size),
        extension: entry.isDirectory() ? "" : path.extname(entry.name).toLowerCase(),
      };
    });
    callback(null, files);
  });
}

function statPath(absPath, callback) {
  fs.stat(absPath, callback);
}

function sendFile(res, absPath) {
  res.sendFile(absPath);
}

function handlePath(req, res, rootPath, relPath) {
  const absPath = path.join(rootPath, relPath);
  statPath(absPath, (err, stats) => {
    if (err) {
      return res.status(404).send("Fichier ou dossier introuvable");
    }
    if (stats.isDirectory()) {
      listDirectory(absPath, relPath, (err, files) => {
        if (err) {
          return res.status(500).send("Erreur de lecture du dossier");
        }
        res.render("index", {
          files,
          currentPath: relPath === "" ? "/" : "/" + relPath,
          formatFileSize,
        });
      });
    } else {
      sendFile(res, absPath);
    }
  });
}

function getTree(rootPath, relPath, callback) {
  const absPath = path.join(rootPath, relPath);
  fs.readdir(absPath, { withFileTypes: true }, (err, entries) => {
    if (err) return callback(err);
    let results = [];
    let pending = entries.length;
    if (!pending) return callback(null, results);
    entries.forEach((entry) => {
      const childRelPath = path.join(relPath, entry.name);
      if (entry.isDirectory()) {
        getTree(rootPath, childRelPath, (err, children) => {
          results.push({ name: entry.name, isDirectory: true, children });
          if (!--pending) callback(null, results);
        });
      } else {
        results.push({ name: entry.name, isDirectory: false });
        if (!--pending) callback(null, results);
      }
    });
  });
}

export { getTree, handlePath, listDirectory, sendFile, statPath };
