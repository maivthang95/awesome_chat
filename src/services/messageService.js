import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import messageModel from "./../models/messageModel";
import {transErrors} from "./../../lang/vi";
import {app} from "./../config/app"
import _ from "lodash";
import fsExtra from "fs-extra";
const LIMIT_CONVERSATION = 4;
const LIMIT_MESSAGES = 20;
/**
 * get all conversation
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
  return new Promise (async (resolve , reject ) => {
    try {
      let contacts = await contactModel.getContacts(currentUserId , LIMIT_CONVERSATION);
      let usersConversationPromise = contacts.map( async ( contact ) => {
        if(contact.contactId == currentUserId){
          let user = await userModel.getNormalUserDataById(contact.userId);
          
          user.updatedAt = contact.updatedAt ; 
          return user;
        }else{
          let user= await userModel.getNormalUserDataById(contact.contactId) ;
           
          user.updatedAt = contact.updatedAt ;
          return user;
        }
      })
      let usersConversation = await Promise.all(usersConversationPromise);
      
      let groupConversations = await chatGroupModel.getChatGroups(currentUserId , LIMIT_CONVERSATION) ; 
      let allConversations = usersConversation.concat(groupConversations);
      
      allConversations = _.sortBy(allConversations , (item) => -item.updatedAt)
      
      
      //get messages to apply in screen chat
      let allConversationsWithMessagesPromise = allConversations.map(async  (conversation) => {
        conversation = conversation.toObject();
        
        if(conversation.members){
          let getMessages = await messageModel.model.getMessagesInGroup(conversation._id , LIMIT_MESSAGES);
          conversation.messages = _.reverse(getMessages); 
          return conversation ; 
        }else{
          let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId , conversation._id , LIMIT_MESSAGES);
          conversation.messages = _.reverse(getMessages); 
          return conversation ; 
        }
        
      })
      
      let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
      
      
      allConversationsWithMessages = _.sortBy( allConversationsWithMessages , (item) => -item.updatedAt);
      
    
      resolve({
                allConversationsWithMessages : allConversationsWithMessages
              })
     
    } catch (error) {
      reject(error);
    }
  })
}
/**
 * 
 * @param {object} sender 
 * @param {string} receiverId 
 * @param {string} messageVal 
 * @param {bool} isGroupChat 
 */
let addNewTextEmoji = (sender , receiverId , messageVal , isGroupChat)=> {
  return new Promise ( async (resolve , reject ) => {
    try {

      if(isGroupChat){
        let chatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
        if(!chatGroupReceiver){
          return reject(transErrors.conversation_not_found );
        }
      
        let receiver = {
          id : chatGroupReceiver._id ,
          name : chatGroupReceiver.name ,
          avatar : app.general_avatar_chatgroup 
        }
        
        let newMessageItem = {
          senderId : sender.id , 
          receiverId : receiver.id ,
          conversationType : messageModel.conversationTypes.GROUP, 
          messageType : messageModel.messageTypes.TEXT ,
          sender : sender ,
          receiver : receiver , 
          text: messageVal  ,
          createdAt : Date.now() 
        }
        
        let newMessage = await messageModel.model.createNew(newMessageItem);
        
        // //update group chat
        await chatGroupModel.updateWhenHasNewMessage( chatGroupReceiver._id, chatGroupReceiver.messageAmount + 1)

         resolve(newMessage);

      }else{
        let getUserReceiver = await userModel.getNormalUserDataById(receiverId) ;
        if(!getUserReceiver){
          return reject(transErrors.conversation_not_found);
        }
       
        let receiver = {
          id : getUserReceiver._id  ,
          name : getUserReceiver.username , 
          avatar : getUserReceiver.avatar 
        }
        
        let newMessageItem = {
          senderId : sender.id , 
          receiverId : receiver.id ,
          conversationType : messageModel.conversationTypes.PERSONAL, 
          messageType : messageModel.messageTypes.TEXT ,
          sender : sender ,
          receiver : receiver , 
          text: messageVal  ,
          createdAt : Date.now() 
        }
      

        let newMessage = await messageModel.model.createNew(newMessageItem);
      //update contact
      await contactModel.updateWhenHasNewMessage(sender.id , receiver.id )
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  })
}
/**
 * add New Image message
 * @param {object} sender 
 * @param {string} receiverId 
 * @param {Request.file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender , receiverId , messageVal , isGroupChat) => {
  return new Promise ( async (resolve , reject ) => {
    try {

      if(isGroupChat){
        let chatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
        if(!chatGroupReceiver){
          return reject(transErrors.conversation_not_found );
        }
      
        let receiver = {
          id : chatGroupReceiver._id ,
          name : chatGroupReceiver.name ,
          avatar : app.general_avatar_chatgroup 
        }
        
        let imageBuffer = await fsExtra.readFile(messageVal.path) ; 
        let imageContentType = messageVal.mimetype ; 
        let imageName = messageVal.originalname ; 
        let newMessageItem = {
          senderId : sender.id , 
          receiverId : receiver.id ,
          conversationType : messageModel.conversationTypes.GROUP, 
          messageType : messageModel.messageTypes.IMAGE ,
          sender : sender ,
          receiver : receiver , 
          file : { data : imageBuffer ,  contentType : imageContentType , fileName : imageName }, 
          createdAt : Date.now() 
        }
     
        let newMessage = await messageModel.model.createNew(newMessageItem);
        
        // //update group chat
        await chatGroupModel.updateWhenHasNewMessage( chatGroupReceiver._id, chatGroupReceiver.messageAmount + 1)

         resolve(newMessage);

      }else{
        let getUserReceiver = await userModel.getNormalUserDataById(receiverId) ;
        if(!getUserReceiver){
          return reject(transErrors.conversation_not_found);
        }
       
        let receiver = {
          id : getUserReceiver._id  ,
          name : getUserReceiver.username , 
          avatar : getUserReceiver.avatar 
        }
        
        let imageBuffer = await fsExtra.readFile(messageVal.path) ; 
        let imageContentType = messageVal.mimetype ; 
        let imageName = messageVal.originalname ; 
        let newMessageItem = {
          senderId : sender.id , 
          receiverId : receiver.id ,
          conversationType : messageModel.conversationTypes.PERSONAL, 
          messageType : messageModel.messageTypes.IMAGE ,
          sender : sender ,
          receiver : receiver , 
          file : { data : imageBuffer ,  contentType : imageContentType , fileName : imageName }, 
          createdAt : Date.now() 
        }
        

        let newMessage = await messageModel.model.createNew(newMessageItem);
      //update contact
      await contactModel.updateWhenHasNewMessage(sender.id , receiver.id )
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  })
}

//=======================================attachment Message =================================================
let addNewAttachment = (sender , receiverId , messageVal , isGroupChat) => {
  return new Promise ( async (resolve , reject ) => {
    try {

      if(isGroupChat){
        let chatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
        if(!chatGroupReceiver){
          return reject(transErrors.conversation_not_found );
        }
      
        let receiver = {
          id : chatGroupReceiver._id ,
          name : chatGroupReceiver.name ,
          avatar : app.general_avatar_chatgroup 
        }
        
        let attachmentBuffer = await fsExtra.readFile(messageVal.path) ; 
        let attachmentContentType = messageVal.mimetype ; 
        let attachmentName = messageVal.originalname ; 
        let newMessageItem = {
          senderId : sender.id , 
          receiverId : receiver.id ,
          conversationType : messageModel.conversationTypes.GROUP, 
          messageType : messageModel.messageTypes.FILE ,
          sender : sender ,
          receiver : receiver , 
          file : { data : attachmentBuffer ,  contentType : attachmentContentType , fileName : attachmentName }, 
          createdAt : Date.now() 
        }
     
        let newMessage = await messageModel.model.createNew(newMessageItem);
        
        // //update group chat
        await chatGroupModel.updateWhenHasNewMessage( chatGroupReceiver._id, chatGroupReceiver.messageAmount + 1)

         resolve(newMessage);

      }else{
        let getUserReceiver = await userModel.getNormalUserDataById(receiverId) ;
        if(!getUserReceiver){
          return reject(transErrors.conversation_not_found);
        }
       
        let receiver = {
          id : getUserReceiver._id  ,
          name : getUserReceiver.username , 
          avatar : getUserReceiver.avatar 
        }
        
        let attachmentBuffer = await fsExtra.readFile(messageVal.path) ; 
        let attachmentContentType = messageVal.mimetype ; 
        let attachmentName = messageVal.originalname ; 
        let newMessageItem = {
          senderId : sender.id , 
          receiverId : receiver.id ,
          conversationType : messageModel.conversationTypes.PERSONAL, 
          messageType : messageModel.messageTypes.FILE ,
          sender : sender ,
          receiver : receiver , 
          file : { data : attachmentBuffer ,  contentType : attachmentContentType , fileName : attachmentName }, 
          createdAt : Date.now() 
        }
        

        let newMessage = await messageModel.model.createNew(newMessageItem);
      //update contact
      await contactModel.updateWhenHasNewMessage(sender.id , receiver.id )
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * read more personal and group chat
 * @param {string} currentUserId 
 * @param {number} skipPersonal 
 * @param {number} skipGroup 
 */
let readMoreAllChats = (currentUserId , skipPersonal , exceptId ,  skipGroup ) => {
  return new Promise (async (resolve , reject ) => {
    try {
      let contacts = await contactModel.readMoreContactHasException(currentUserId ,skipPersonal  ,exceptId, LIMIT_CONVERSATION);
      
      let usersConversationPromise = contacts.map( async ( contact ) => {
        if(contact.contactId == currentUserId){
          let user = await userModel.getNormalUserDataById(contact.userId);
          
          user.updatedAt = contact.updatedAt ; 
          return user;
        }else{
          let user= await userModel.getNormalUserDataById(contact.contactId) ;
           
          user.updatedAt = contact.updatedAt ;
          return user;
        }
      })
      let usersConversation = await Promise.all(usersConversationPromise);
      
      let groupConversations = await chatGroupModel.readMoreChatsGroup(currentUserId , skipGroup, LIMIT_CONVERSATION) ; 
      let allConversations = usersConversation.concat(groupConversations);
      
      allConversations = _.sortBy(allConversations , (item) => -item.updatedAt)
      
      
      //get messages to apply in screen chat
      let allConversationsWithMessagesPromise = allConversations.map(async  (conversation) => {
        conversation = conversation.toObject();
        
        if(conversation.members){
          let getMessages = await messageModel.model.getMessagesInGroup(conversation._id , LIMIT_MESSAGES);
          conversation.messages = _.reverse(getMessages); 
          return conversation ; 
        }else{
          let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId , conversation._id , LIMIT_MESSAGES);
          conversation.messages = _.reverse(getMessages); 
          return conversation ; 
        }
        
      })
      
      let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
      
      
      allConversationsWithMessages = _.sortBy( allConversationsWithMessages , (item) => -item.updatedAt);
      
    
      resolve(allConversationsWithMessages );
     
    } catch (error) {
      reject(error);
    }
  })
}
/**
 * 
 * @param {string} currentUserId 
 * @param {string} targetId 
 * @param {number} skipMessages 
 * @param {boolean} chatInGroup 
 */
let readMoreMessages =  (currentUserId , targetId , skipMessages , chatInGroup) => {
 return new Promise ( async (resolve , reject ) => {
  try {
    if(chatInGroup){
      let getMessages = await messageModel.model.readMoreMessagesInGroup( targetId, skipMessages, LIMIT_MESSAGES);
      getMessages = _.reverse(getMessages); 
      
      return resolve(getMessages) ;
    }
      let getMessages = await messageModel.model.readMoreMessagesInPersonal(currentUserId , targetId , skipMessages , LIMIT_MESSAGES);
      getMessages = _.reverse(getMessages); 
      return resolve(getMessages)
   } catch (error) {
     reject(error);
   }
 })
}

let readMorePersonalChat = (currentUserId , skipPersonal , exceptId ) => {
  return new Promise ( async (resolve , reject) => {
    try {
      let contacts = await contactModel.readMoreContactHasException(currentUserId , skipPersonal , exceptId , LIMIT_CONVERSATION);
      let usersConversationPromise = contacts.map( contact => {
        if(contact.userId == currentUserId){
          return userModel.getNormalUserDataById(contact.contactId) ; 
        }
        return userModel.getNormalUserDataById(contact.userId) ;
      })

      let usersConversation = await Promise.all(usersConversationPromise);
        
      // push messages to user
      let usersConversationWithMessagesPromise = usersConversation.map(async conversation =>{
        conversation = conversation.toObject() ; 
        let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId , conversation._id , LIMIT_MESSAGES);
        conversation.messages = _.reverse(getMessages); 
        return conversation ; 
      })

     let usersConversationWithMessages = await Promise.all(usersConversationWithMessagesPromise);
     resolve(usersConversationWithMessages);
    } catch (error) {
      reject(error);
    }
  })
}

let readMoreGroupChat = (currentUserId , skipGroup ) => {
  return new Promise (async (resolve , reject) => {
    try {
      let groupConversation = await chatGroupModel.readMoreChatsGroup(currentUserId , skipGroup , LIMIT_CONVERSATION);
      
      let groupConversationWithMessagesPromise = groupConversation.map( async conversation => {
        conversation = conversation.toObject() ; 
        let getMessages = await messageModel.model.getMessagesInGroup(conversation._id , LIMIT_MESSAGES); 
        conversation.messages = _.reverse(getMessages);
        return conversation ;
      })

      let groupConversationWithMessages = await Promise.all(groupConversationWithMessagesPromise);
      
      resolve(groupConversationWithMessages);
    } catch (error) {
      reject(error);
    }
  })
}

let chatWithFriendFromContactList = (currentUserId ,  contactId ) => {
  return new Promise ( async (resolve , reject ) => {
    try {
     
      let getUserInfor = await userModel.getNormalUserDataById(contactId) ; 
      let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId , contactId , LIMIT_MESSAGES); 
      getUserInfor = getUserInfor.toObject() ; 
      getUserInfor.messages = _.reverse(getMessages) ; 
      
      resolve(getUserInfor);
    } catch (error) {
      reject(error);
    }
  })
};



module.exports = {
  getAllConversationItems: getAllConversationItems, 
  addNewTextEmoji : addNewTextEmoji,
  addNewImage : addNewImage,
  addNewAttachment : addNewAttachment,
  readMoreAllChats : readMoreAllChats,
  readMoreMessages : readMoreMessages,
  readMorePersonalChat : readMorePersonalChat,
  readMoreGroupChat : readMoreGroupChat ,
  chatWithFriendFromContactList : chatWithFriendFromContactList
}
