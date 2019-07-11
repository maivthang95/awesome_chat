import express from "express";
import connectDB from "./config/connectDB";
import contactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
// Init app
let app = express() ;

connectDB();

//Config view engine 
configViewEngine(app) ;
app.get("/",(req , res) => {
  res.render("main/master")
})

app.get("/login-register",(req , res) => {
  res.render("auth/loginRegister")
})
app.listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST }`));

