import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session"; 
// Init app
let app = express() ;

connectDB();

//Config Session
configSession(app);

//Config view engine 
configViewEngine(app) ;

//Eanble post data request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));

//enable flash messages
app.use(connectFlash())
//Init all routes
initRoutes(app);
app.listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST }`));

