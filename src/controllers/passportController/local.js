import passport from "passport" ;
import passportLocal from "passport-local" ;
import userModel from "./../../models/userModel";
import {transErrors,transSuccess} from "./../../../lang/vi";
import chatGroupModel from "./../../models/chatGroupModel";
let localStrategy = passportLocal.Strategy;

/**
 * Valid user account type : local 
 */

let initPassportLocal = () => {
  passport.use(new localStrategy({
    usernameField : "email", 
    passwordField : "password" , 
    passReqToCallback : true 
  } ,async (req ,email , password ,done) => {
    try {
      let user = await userModel.findEmail(email);

      if(!user)
      return  done(null, false , req.flash("errors" ,transErrors.login_failed ));

      if(!user.local.isActive)
      return  done(null, false , req.flash("errors" ,transErrors.account_not_active));

      let checkPassword = await user.ComparePassword(password);

      if(!checkPassword){
      return done(null , false , req.flash("errors" ,transErrors.login_failed));
      }
      return done(null , user , req.flash("success" ,transSuccess.login_success(user.username)))

    } catch (error) {
      console.log(error);
      return done(null,false , req.flash("errors" , transErrors.server_error))
    }
  }));
  //save userid to session
  passport.serializeUser( (user , done) => {
    done(null , user._id);
  })

  passport.deserializeUser( async (id , done) => {
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

 module.exports = initPassportLocal;