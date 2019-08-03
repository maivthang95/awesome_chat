import passport from "passport" ; 
import passportFacebook from "passport-facebook" ;
import userModel from "./../../models/userModel" ;
import {transErrors , transSuccess} from "./../../../lang/vi";
import chatGroupModel from "./../../models/chatGroupModel";
let FacebookStrategy = passportFacebook.Strategy ; 

let fbAppId = process.env.FB_APP_ID ;
let fbAppSecret = process.env.FB_APP_SECRET ; 
let fbAppCallBackURL = process.env.FB_CALLBACK_URL
/**
 * Valid account type : Facebook
 */
let initPassportFacebook = () => {
  passport.use(new FacebookStrategy({
    clientID : fbAppId , 
    clientSecret : fbAppSecret , 
    callbackURL : fbAppCallBackURL ,
    passReqToCallback : true ,
    profileFields : ["email" , "gender" , "displayName"]
  } ,async (req , accessToken , refreshToken , profile , done) => {
    try {
      let user = await userModel.findByFacebookUid(profile.id);
      if(user){
        return done(null , user , req.flash("success" , transSuccess.login_success(user.username)));
      }
      
      let newUserItem = {
        username : profile.displayName , 
        gender : profile.gender ,
        local : { isActive : true } ,
        facebook : {
          uid : profile.id,
          token : accessToken ,
          email : profile.emails[0].value
        },
        
      }

      let newUser = await userModel.createNew(newUserItem) ; 
      return done(null ,  newUser , req.flash("success" , transSuccess.login_success(newUser.username)));

    } catch (error) {
      console.log(error) ; 
      return done(null , false , req.flash("errors" , transErrors.server_error));
    }
  }));
  
  passport.serializeUser( (user ,done) => {
    done(null , user._id) ;
  })

  passport.deserializeUser( async (id, done) => {
    try {
      let user = await userModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await chatGroupModel.getChatGroupIdsByUser(id);
      user = user.toObject() ;
      user.chatGroupIds = getChatGroupIds ; 
      return done(null , user);
    } catch (error) {
      return done(error , false );
    }
  })
}

module.exports = initPassportFacebook; 
