import userModel from "./../models/userModel";
import bcrypt from "bcrypt" ;
import uuidv4 from "uuid/v4";
import {transErrors, transSuccess , transMail} from "./../../lang/vi";
import sendMail from "./../config/mailer" ;

let saltRound = 7 ;

let register = (email, gender, password , protocol , host) => {
  return new Promise( async (resolve , reject) =>{
    let userByEmail = await userModel.findEmail(email) ;
    if(userByEmail){
      if(userByEmail.deletedAt != null ){
        return reject(transErrors.account_removed)
      }
      if(!userByEmail.local.isActive){
        return reject(transErrors.account_not_active)
      }
      return reject(transErrors.account_in_use);
    }
    let salt = bcrypt.genSaltSync(salt); 
    
    let userItem = {
      username : email.split("@")[0] ,
      gender : gender ,
      local : {
        email : email , 
        password : bcrypt.hashSync(password , salt) ,
        verifyToken : uuidv4()
      }
    };

    let user = await userModel.createNew(userItem) ;
    //send email
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`
    sendMail(email , transMail.subject , transMail.template(linkVerify))
    .then( success => {
      resolve(transSuccess.userCreated(user.local.email));
    })
    .catch( async error => {
      await userModel.removeById(user._id);
      console.log(error) ;
      reject(error)
    })
    resolve(transSuccess.userCreated(user.local.email));
  })
  
}

let verifyAccount = (token) => {
  return new Promise( async (resolve , reject) => {
    let UserByToken = await userModel.findByToken(token) ;
    if(!UserByToken){
      return reject(transErrors.token_undifined);
    }
    await userModel.verify(token) ;
    resolve(transSuccess.account_active); 
  })
}
module.exports = {
  register : register,
  verifyAccount : verifyAccount
}

