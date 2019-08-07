import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session"; 
import passport from "passport";
import pem from "pem" ;
import https from "https";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";

import cookieParser from "cookie-parser";
import configSocketio from "./config/socketio";
import events from "events";
import * as appConfig from "./config/app";
//Init app
let app = express() ;

//Set max connection event listeners
events.EventEmitter.defaultMaxListeners = appConfig.app.max_event_listener ;

//Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

connectDB();

//Config Session
session.config(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended : true }));

//Config view engine 
configViewEngine(app) ;

//Eanble post data request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));

//enable flash messages
app.use(connectFlash())

//user cookie Parser
app.use(cookieParser());

//Config passport 
app.use(passport.initialize());
app.use(passport.session());

//Init all routes
initRoutes(app);

//Config for socket.io
configSocketio(io, cookieParser , session.sessionStore);


//Init all sockets
initSockets(io);
server.listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST }`));

