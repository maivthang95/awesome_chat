import express from "express";
import connectDB from "./config/connectDB";
import contactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
// Init app
let app = express() ;

connectDB();

//Config view engine 
configViewEngine(app) ;

//Init all routes
initRoutes(app);
app.listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST }`));

