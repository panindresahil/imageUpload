//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
// Set Storage Engine 
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    var imageFile = file.fieldname + '-' + Date.now().toLocaleString() + path.extname(file.originalname);
    cb(null, imageFile);
  }
});
// Init Upload
const upload = multer({
  storage:storage,
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');
// checkFileType Function
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimeType
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return (cb(null, true));
  } else {
    cb("Error: Images only!!");
  }
}
// Init App
const app = express();
// EJS
app.set('view engine', 'ejs');
// bodyparser
app.use(bodyParser.urlencoded({extended: true}));
// Public Folder
app.use(express.static("./public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.get("/",(req,res) => {
  res.render("index");
});
app.post('/upload',(req,res)=> {
  upload(req, res, (err)=>{
    if(err) {
      res.render('index',{msg : err});
    } else {
      const imageFile = "/uploads/" + req.file.filename;
      res.render('index',{imageFile: imageFile})
    }
  })
})
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
