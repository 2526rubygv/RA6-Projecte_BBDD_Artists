const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "artists.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

// Creem la taula i ens assegurem que hi hagi dades inicials.
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist_id INTEGER NOT NULL,
      FOREIGN KEY (artist_id) REFERENCES artists(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cancion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      album_id INTEGER NOT NULL,
      FOREIGN KEY (album_id) REFERENCES albums(id)
    )
  `);

  db.get("SELECT id FROM artists WHERE name = ?", ["Txarango"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Txarango"]);
    }
  });

  db.get("SELECT id FROM artists WHERE name = ?", ["Oques Grasses"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Oques Grasses"]);
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.post("/api/AddArtist",  (req, res) => {
  const name = req.body.data;
  db.run("INSERT INTO artists (name) VALUES (?)", [name], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Artista desat: ${name}`);
  });
});

app.post("/api/artists",  (req, res) => {
  const table = req.body.data;
  db.all(`SELECT * FROM ${table} ORDER BY id DESC`, (err, rows) => {
    if (err){
      return res.status(500).json({ error: err.message });
    }
    console.log(rows);
    res.json({ result: rows });
  });
});

app.post("/api/AddAlbum", (req, res) => {
  const { title, artist_id } = req.body;

  if (!title || !artist_id) {
    return res.status(400).type("text").send("Falten dades: title o artist_id");
  }

  db.run("INSERT INTO albums (title, artist_id) VALUES (?, ?)", [title, artist_id], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Àlbum desat: ${title}`);
  });
});

app.post("/api/albums", (req, res) => {
  db.all(`SELECT albums.id, albums.title, artists.name AS artist_name 
          FROM albums 
          JOIN artists ON albums.artist_id = artists.id
          ORDER BY albums.id DESC`, (err, rows) => {

          if (err){
            return res.status(500).json({ error: err.message });
          }
          res.json({ result: rows });
  });
});

app.post("/api/AddCancion", (req, res) => {
  const { title, album_id } = req.body;

  if (!title || !album_id) {
    return res.status(400).type("text").send("Falten dades: title o album_id");
  }

  db.run("INSERT INTO cancion (title, album_id) VALUES (?, ?)", [title, album_id], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Cancion desada: ${title}`);
  });
});

app.post("/api/canciones", (req, res) => {
  db.all(`SELECT cancion.id, cancion.title, albums.title AS album_title 
          FROM cancion 
          JOIN albums ON cancion.album_id = albums.id
          ORDER BY cancion.id DESC`, (err, rows) => {
            if (err){
              return res.status(500).json({ error: err.message });
            }
            res.json({ result: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor a http://localhost:${PORT}`);
  console.log(`Base de dades SQLite: ${dbPath}`);
});
