import userModel from "./../models/userModel";
import { transErrors } from "../../lang/vi";
import bcrypt from "bcrypt" ;
/**
 * 
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id , item) => {
  return userModel.updateUser(id , item );
}

let saltRound = 7 ; 

/**
 * 
 * @param {userid} id 
 * @param {data update} item 
 */
let updatePassword = (id , dataUpdate ) => {
  return new Promise( async (resolve , reject ) => {
    let currentUser = await userModel.findUserByIdToUpdatePassword(id);
    if(!currentUser){
      return reject(transErrors.account_undefined) ;
    }
    let checkPassword = await currentUser.ComparePassword(dataUpdate.currentPassword);
    if(!checkPassword){
      return reject(transErrors.password_error);
    }
    let salt = bcrypt.genSaltSync(saltRound) ;
    
    await userModel.updatePassword(id , bcrypt.hashSync(dataUpdate.newPassword , salt) )
    resolve(true);

  })
}
module.exports = {
  updateUser : updateUser ,
  updatePassword : updatePassword
}