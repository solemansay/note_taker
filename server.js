const express = require("express");
const app = express();
const path = require("path");
const util = require("util");
const fs = require("fs");
const readFileAsync = util.promisify(fs.readFile);
const writefileAsync = util.promisify(fs.writeFile);
const id = require('uniqid');
let notes = require("./db/db.json")
const PORT = process.env.PORT || 8888;


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/notes", (req, res) => res.json(notes));

app.get("api/notes/id", (req, res) => res.json(notes));

app.delete("/api/notes/:id", function (req, res) {
    notes = notes.filter (notes => notes.id !== req.params.id);
    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes), "utf8", function (err) {
        if (err) throw err;
        res.json(notes)
    });
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.get("/api/notes", function (req, res) {
    readFileAsync("./db/db.json", "utf8")
        .then(notes => {
            res.json(JSON.parse(notes))
        })
});

app.post("/api/notes", function (req, res) {

    const newNote = req.body

    newNote.id = id("");

    console.log(newNote.id)

    notes.push(newNote);

    console.log(newNote);

    writefileAsync("./db/db.json", JSON.stringify(newNote));

    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify([...notes]), "utf8", function (err) {
        if (err) throw err;
        res.json([notes])
    });
});

//<----------- Nothing bellow this ------------->

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

app.listen(PORT, function () {

    console.log("Server listening on: http://localhost:" + PORT);
});

