const express = require("express");
const app = express();
const path = require("path")
const util = require("util")
const fs = require("fs")
const readFileAsync = util.promisify(fs.readFile)
const writefileAsync = util.promisify(fs.writeFile)


//---------------TO DO---------------

//Pull notes from db.json and add them to the saved window. when saving a note, add it to the saved window above the previous note.
//add delete button functionality
var notes = require("./db/db.json")
var PORT = 8888;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


function saveNote() {
    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        if (err) {
            throw err;
        }
    });
}

app.get("/api/notes", function (req, res) {
    readFileAsync("db/db.json", "utf8")
        .then(notes => {
            res.json(JSON.parse(notes))
        })
});

app.post("/api/notes", function (req, res) {
    console.log(req.body)
    const newNote = req.body


    notes.push(newNote);
    saveNote();
    writefileAsync("./db/db.json", JSON.stringify(newNote));
});


app.delete("/api/notes/:id", function (req, res) {
    const id = req.params.id;



    saveNote();
});


app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});


//<----------- Nothing bellow this ----------->

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

app.listen(PORT, function () {

    console.log("Server listening on: http://localhost:" + PORT);
});

