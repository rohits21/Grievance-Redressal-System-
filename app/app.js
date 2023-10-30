const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const ejs = require("ejs");

//importing routes
const { util,index,faculty,student,admin} = require("./routes");

app.set("views", path.resolve(__dirname, "../assets", "../assets"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parsing form data to access it in routes

//creating session
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
    resave: true,
    saveUninitialized: false,
    sameSite: true,
    httpOnly: true,
    secure: true
  })
);
  
//routes
app.use('/',index)
app.use('/student',student)
app.use('/faculty',faculty)
app.use('/setstatus',faculty)
app.use('/admin',admin)
app.use('/dashboard',util)
app.use('/complaint',util)
app.use('/allprofiles',util)
app.use('logout',index)

app.listen(4000, () => {
  console.log("server listening on port 4000");
});
