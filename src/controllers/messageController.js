import {validationResult} from "express-validator/check"
import {message} from "./../services/index" ;
import multer from "multer";
import {app} from "./../config/app"
import { transErrors } from "../../lang/vi";
import fsExtra from "fs-extra";
import uuidv4 from "uuid/v4";
let addNewTextEmoji = async (req , res) => {
  let errorArr = []; 
  let validationError = validationResult(req);
  if(!validationError.isEmpty()){
    let errors = Object.values(validationError.mapped());
    errors.forEach( error => {
      errorArr.push(error.msg);
    })
    return res.status(500).send(errorArr);
  }
  
  try {
    let sender = {
      id : req.user._id ,
      name: req.user.username ,
      avatar : req.user.avatar
    }
    let receiverId = req.body.uid ;
    let messageVal = req.body.messageVal ;
    let isChatGroup = req.body.isChatGroup  ;
    let newMessage = await message.addNewTextEmoji(sender , receiverId , messageVal , isChatGroup) ;
    return res.status(200).send({message : newMessage})
  } catch (error) {
    return res.status(500).send(error);
  }
}
// ========================================  Image chat   =========================================== 

let storageImageChat= multer.diskStorage({
  destination : (req , file ,callback) => {
    callback(null , app.image_message_directory);
  },
  filename : (req , file , callback) => {
    let match = app.image_type; 
    if(match.indexOf(file.mimetype) === -1){

      return callback(transErrors.image_type ,null);
    }
    let imageName = `${Date.now()}-${file.originalname}`
    callback(null , imageName);
  }
})


let imageMessageUploadFile = multer({
  storage : storageImageChat ,
  limits : {fileSize : app.avatar_limit_Size}
}).single("my-image-chat")

let addNewImage = (req , res) => {
  imageMessageUploadFile( req , res ,async (error )=>{
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.image_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id ,
        name : req.user.username , 
        avatar : req.user.avatar 
      }
      let receiverId = req.body.uid ; 
      let messageVal = req.file ;
      let isChatGroup = req.body.isChatGroup ;

      
      let newMessage = await message.addNewImage(sender , receiverId , messageVal , isChatGroup); 

      //Remove Image because this image is saved to mongodb
      await fsExtra.remove(req.file.path);

      return res.status(200).send({message : newMessage})
    } catch (error) {
      return res.status(500).send(error);
    }
  })
  
}

// ========================================  Attachment chat   ===========================================

let attachmentStorage = multer.diskStorage({
  destination : (req , file , callback) => {
    callback(null , app.attachment_directory); 
  },
  filename : ( req , file , callback) => {
    let attachmentName = `${Date.now()}-${file.originalname}` ; 
    callback(null , attachmentName) ; 
  }
})

let attachmentUploadFile = multer({
  storage : attachmentStorage , 
  limits : {fileSize : app.attachment_limit_Size}
}).single("my-attachment-chat")

let addNewAttachment = (req , res) => {
  attachmentUploadFile( req , res ,async error => {
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.attachment_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id : req.user._id  ,
        name : req.user.username , 
        avatar : req.user.avatar  
      }
      let receiverId = req.body.uid ;
      let messageVal = req.file ; 
      let isChatGroup = req.body.isChatGroup ;

      let newMessage = await message.addNewAttachment(sender ,  receiverId , messageVal , isChatGroup) ;
      await fsExtra.remove(req.file.path);
      return res.status(200).send({message : newMessage});
    } catch (error) {
      return res.status(500).send(error); 
    }
  })
}
module.exports = {
  addNewTextEmoji : addNewTextEmoji,
  addNewImage : addNewImage ,
  addNewAttachment : addNewAttachment
}