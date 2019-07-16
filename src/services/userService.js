import userModel from "./../models/userModel";

/**
 * 
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id , item) => {
  return userModel.updateUser(id , item );
}

module.exports = {
  updateUser : updateUser 
}