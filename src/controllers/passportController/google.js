import passport from "passport" ;
import passportGoogle from "passport-google-oauth" ;
import userModel from "./../../models/userModel";
import {transErrors , transSuccess} from "./../../../lang/vi";

let googleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID ;
let ggAppSecret = process.env.GG_APP_SECRET ;
let ggAppURL = process.env.GG_CALLBACK_URL ; 

let initPassportGoogle = () => {
  passport.use( new googleStrategy({
  clientID : ggAppId , 
  clientSecret : ggAppSecret , 
  callbackURL : ggAppURL ,
  passReqToCallback : true 
} ,async (req, accessToken , refreshToken , profile , done) => {
  try {
    let user = await userModel.findByGoogleUid(profile.id) ; 
    if(user){
      return done(null , user , req.flash("success" , transSuccess.login_success(user.username)));
    }
    console.log(profile);
    let userItem = {
      username : profile.displayName , 
      gender : profile.gender , 
      local : {isActive : true } , 
      google : {
        uid : profile.id , 
        token : accessToken , 
        email : profile.emails[0].value 
      }
    }
  
    let newUser = await userModel.createNew(userItem);
    return done (null , newUser , req.flash("success" , transSuccess.login_success(newUser.username)));

  } catch (error) {
    console.log(error);
    return done(null , false , transErrors.server_error);
  }
}));
  passport.serializeUser( (user , done) => {
    done(null , user._id) ; 
  })

  passport.deserializeUser( (id, done) => {
    userModel.findUserById(id)
    .then(user => done(null , user))
    .catch(err => done(err, null))
  })
}

module.exports = initPassportGoogle ;
