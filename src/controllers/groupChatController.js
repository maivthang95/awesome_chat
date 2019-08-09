import {validationResult} from "express-validator/check";
import { groupChat } from "./../services/index";


let addNewGroupChat = async (req , res ) => {
  let errorArr = [] ; 
  let validationErrors = validationResult(req) ; 
  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped()) ;
    errors.forEach( error => {
      errorArr.push(error.msg);
    })
    return res.status(500).send(errorArr);
  }
  try {
    let currentUserId = req.user._id ; 
    let usersIdList = req.body.usersIdList ;
    let groupChatName = req.body.groupChatName; 
    let newGroupChat = await groupChat.addNewGroupChat(currentUserId , usersIdList , groupChatName);
    return res.status(200).send({groupChat : newGroupChat});
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  addNewGroupChat : addNewGroupChat 
}