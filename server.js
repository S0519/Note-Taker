/* We need those libraries in server.js to make it run. 
We install npm install which is express from the library according to the criteria to create a server,
the function fs from js which allows to read files, 
and uuid allows us to create ramdom Id  */

var express = require("express");
var path = require("path");
var fs = require("fs");
const { 
    v4: uuidv4,
  } = require('uuid');
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require("constants");


/* Sets up the Express App. The serve is located in the number 3000
Before to run it in the browser it is essential to go to the terminal write: node server.js. 
When the port number shows up
go the browser and write the local post number: http://localhost:3000/notes*/


var app = express();
var PORT = process.env.PORT || 3000;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Send the file which is located in index.html
app.get("/", function(req, res) {
res.sendFile(path.join(__dirname, "/public/index.html"))
})


// Send the file which is located in notes.html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})


/* We are in the db file and wants to return in the front so can be display it */
//we want to get information from the server
app.get("/api/notes", function(req, res){
    fs.readFile(__dirname + "/db/db.json", "utf8", function(error,data){ // We want to read the file which is located in /db/db.json utf8 is a caracter that the computer recognise to run the function
        if (error) {
          return console.log(error)  //If there is an error the code does not keep going. So we can see the error and fix it.
        }
        res.json(JSON.parse(data)) /* We have the array and we need to turn in into object */
    })
})


// We want to post information in the server combining with new notes
app.post("/api/notes", function(req, res){
    fs.readFile(__dirname + "/db/db.json", "utf8", function(error,data){ // We want to read the file which is located in /db/db.json utf8 is a caracter that the computer recognise to run the function
        if (error) {
          return console.log(error)  //If there is an error the code does not keep going. So we can see the error and fix it.
        }
       let notes = JSON.parse(data); 
       let newNotes = {
           title: req.body.title,
           text: req.body.text,
           id: uuidv4() 
        } 

       let allNotes = (notes.concat(newNotes))
       
       fs.writeFile(__dirname + "/db/db.json", JSON.stringify(allNotes), function(error,data){ //concataning is combining notes and new notes
          if (error) {
            return console.log(error)  
          }
          res.json(allNotes) 
        })
    })
})


/*We want to delete information from the server */
app.delete("/api/notes/:id", function (req, res) {
 

  //I was doing JSON.PARSE on string value, this is why it was not working. We just need the string value
  const noteId = (req.params.id)
    
    
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
      if (error) {
        return console.log(error)
      }

      let notes = JSON.parse(data)
      notes = notes.filter(val => val.id !== noteId)
  
      fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
        if (error) {
          return error
        }
        res.json(notes)
      })
    })       

})



// json = extension y JSON = is like a class

/* This application works calling the number of the PORT, the PORT is the number from the local computer.
We are asking the informations which is in the application notes. */

/* This function listen the port when we are calling  it */
app.listen(PORT, function(){
  console.log("App listening on PORT" + PORT )
})