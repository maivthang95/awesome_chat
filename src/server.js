import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session"; 
import passport from "passport";
import pem from "pem" ;
import https from "https";

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err
  }
  let app = express()

  connectDB();

  //Config Session
  configSession(app);

  //Enable post data for request
  app.use(bodyParser.urlencoded({extended : true }));

  //Config view engine 
  configViewEngine(app) ;

  //Eanble post data request
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true }));

  //enable flash messages
  app.use(connectFlash())

  //Config passport 
  app.use(passport.initialize());
  app.use(passport.session());

  //Init all routes
  initRoutes(app);

  https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST }`));
})
// Init app
// let app = express() ;

// connectDB();

// //Config Session
// configSession(app);

// //Enable post data for request
// app.use(bodyParser.urlencoded({extended : true }));

// //Config view engine 
// configViewEngine(app) ;

// //Eanble post data request
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended : true }));

// //enable flash messages
// app.use(connectFlash())

// //Config passport 
// app.use(passport.initialize());
// app.use(passport.session());

// //Init all routes
// initRoutes(app);
// app.listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST }`));

