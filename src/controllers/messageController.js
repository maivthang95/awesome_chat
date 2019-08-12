import {validationResult} from "express-validator/check"
import {message} from "./../services/index" ;
import multer from "multer";
import {app} from "./../config/app"
import { transErrors } from "../../lang/vi";
import fsExtra from "fs-extra";
import uuidv4 from "uuid/v4";
import ejs from "ejs";
import {bufferToBase64 , lastItemOfArray , convertTimeStampToHumanTime} from "./../helpers/clientHelper"
import {promisify} from "util";

//make ejs function renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);
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
// =========================================================================================
let readMoreAllChats = async (req , res) => {
  try {
    let skipPersonal = +req.query.skipPersonal ; 
    let skipGroup = +req.query.skipGroup ;
    let exceptId = req.query.exceptId;
    let newAllConversations = await message.readMoreAllChats(req.user._id , skipPersonal , exceptId, skipGroup);
    let dataToRender = {
      newAllConversations : newAllConversations , 
      bufferToBase64 : bufferToBase64 ,
      lastItemOfArray : lastItemOfArray , 
      convertTimeStampToHumanTime : convertTimeStampToHumanTime, 
      user : req.user 
    }
    let leftSideData = await renderFile("src/views/main/readMoreConversations/_leftSide.ejs" , dataToRender );
    let rightSideData = await renderFile("src/views/main/readMoreConversations/_rightSide.ejs" , dataToRender) ;
    let imageModalData = await renderFile("src/views/main/readMoreConversations/_imageModal.ejs" , dataToRender) ;
    let attachmentModalData = await renderFile("src/views/main/readMoreConversations/_attachmentModal.ejs" , dataToRender);
    
    return res.status(200).send({
      leftSideData : leftSideData , 
      rightSideData : rightSideData , 
      imageModalData : imageModalData , 
      attachmentModalData : attachmentModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readMoreMessages = async (req , res ) => {
  try {
    let currentUserId = req.user._id ; 
    let targetId = req.query.targetId ;
    let skipMessages = +req.query.skipMessages ;
    let chatInGroup = (req.query.chatInGroup === "true") ;
    let newMessages = await message.readMoreMessages(currentUserId , targetId , skipMessages , chatInGroup);
    

    let dataToRender = {
      newMessages : newMessages , 
      bufferToBase64 : bufferToBase64 ,
      user : req.user 
    }
  
    let rightSideData = await renderFile("src/views/main/readMoreMessages/_rightSide.ejs" , dataToRender) ;
    let imageModalData = await renderFile("src/views/main/readMoreMessages/_imageModal.ejs" , dataToRender) ;
    let attachmentModalData = await renderFile("src/views/main/readMoreMessages/_attachmentModal.ejs" , dataToRender);
   
    
    return res.status(200).send({
      rightSideData : rightSideData , 
      imageModalData : imageModalData , 
      attachmentModalData : attachmentModalData
    })
    //return res.status(200).send({});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readMorePersonalChat = async (req , res) => {
  try {
    let skipPersonal = +req.query.skipPersonal ; 
    let exceptId = req.query.exceptId; 
    let newMessages = await message.readMorePersonalChat(req.user._id , skipPersonal,exceptId ) ;
    
    let dataToRender = {
      newMessages : newMessages , 
      bufferToBase64 : bufferToBase64 , 
      lastItemOfArray : lastItemOfArray,
      convertTimeStampToHumanTime : convertTimeStampToHumanTime ,
      user : req.user  ,
    }

    let leftSidePersonalData = await renderFile("src/views/main/readMoreConversations/_leftSidePersonalChat.ejs" , dataToRender);
    let rightSidePersonalData = await renderFile("src/views/main/readMoreConversations/_rightSidePersonalChat.ejs" , dataToRender) ;
    let imagePersonalModalData = await renderFile("src/views/main/readMoreConversations/_imageModalPersonal.ejs" , dataToRender);
    let attachmentPersonalModalData = await renderFile("src/views/main/readMoreConversations/_attachmentModalPersonal.ejs" , dataToRender) ;
    
    return res.status(200).send({
      leftSidePersonalData : leftSidePersonalData , 
      rightSidePersonalData : rightSidePersonalData ,
      imagePersonalModalData : imagePersonalModalData ,
      attachmentModalData : attachmentPersonalModalData
    })
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readMoreGroupChat = async (req ,  res) => {
  try {
    let skipGroup = +req.query.skipGroup ; 
    let newMessages = await message.readMoreGroupChat(req.user._id , skipGroup) ;
    
    let dataToRender = {
      newMessages : newMessages ,
      bufferToBase64 : bufferToBase64 ,
      lastItemOfArray : lastItemOfArray ,
      convertTimeStampToHumanTime : convertTimeStampToHumanTime , 
      user : req.user
    }
    
    let leftSideGroupData = await renderFile("src/views/main/readMoreConversations/_leftSideGroupChat.ejs" , dataToRender);
    let rightSideGroupData = await renderFile("src/views/main/readMoreConversations/_rightSideGroupChat.ejs" , dataToRender) ;
   
    let imageGroupModalData = await renderFile("src/views/main/readMoreConversations/_imageModalGroup.ejs" , dataToRender);
    let attachmentGroupModalData = await renderFile("src/views/main/readMoreConversations/_attachmentModalGroup.ejs" , dataToRender) ;
    return res.status(200).send({
      leftSideGroupData : leftSideGroupData , 
      rightSideGroupData : rightSideGroupData , 
      imageGroupModalData : imageGroupModalData , 
      attachmentGroupModalData : attachmentGroupModalData
    })
  } catch (error) {
    return res.status(500).send(error) ;
  }
}

let chatWithFriendFromContactList = async (req , res ) => {
  try {
    let targetId = req.query.targetId;
    
    let newMessage = await message.chatWithFriendFromContactList(req.user._id ,targetId) ; 
    let newMessages = [] ; 
    newMessages.push(newMessage);
    
    let dataToRender = {
      newMessages : newMessages , 
      bufferToBase64 : bufferToBase64 , 
      lastItemOfArray : lastItemOfArray,
      convertTimeStampToHumanTime : convertTimeStampToHumanTime ,
      user : req.user  ,
    }

    let leftSidePersonalData = await renderFile("src/views/main/readMoreConversations/_leftSidePersonalChat.ejs" , dataToRender);
    let rightSidePersonalData = await renderFile("src/views/main/readMoreConversations/_rightSidePersonalChat.ejs" , dataToRender) ;
    let imagePersonalModalData = await renderFile("src/views/main/readMoreConversations/_imageModalPersonal.ejs" , dataToRender);
    let attachmentPersonalModalData = await renderFile("src/views/main/readMoreConversations/_attachmentModalPersonal.ejs" , dataToRender) ;
    
    return res.status(200).send({
      leftSidePersonalData : leftSidePersonalData , 
      rightSidePersonalData : rightSidePersonalData ,
      imagePersonalModalData : imagePersonalModalData ,
      attachmentModalData : attachmentPersonalModalData
    })
  } catch (error) {
    return res.status(500).send(error);
  }
}


module.exports = {
  addNewTextEmoji : addNewTextEmoji,
  addNewImage : addNewImage ,
  addNewAttachment : addNewAttachment, 
  readMoreAllChats : readMoreAllChats ,
  readMoreMessages : readMoreMessages , 
  readMorePersonalChat : readMorePersonalChat ,
  readMoreGroupChat : readMoreGroupChat,
  chatWithFriendFromContactList : chatWithFriendFromContactList,
}