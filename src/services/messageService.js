import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import messageModel from "./../models/messageModel";
import _ from "lodash";
const LIMIT_CONVERSATION = 15;
const LIMIT_MESSAGES = 30;
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
        let getMessages = await messageModel.model.getMessages(currentUserId , conversation._id , LIMIT_MESSAGES);
        conversation = conversation.toObject();
        conversation.messages = getMessages; 
        return conversation ; 
      })

      let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
      allConversationsWithMessages = _.sortBy( allConversationsWithMessages , (item) => -item.updatedAt);

      
      resolve({usersConversation: usersConversation , 
                groupConversations : groupConversations ,
                allConversations : allConversations,
                allConversationsWithMessages : allConversationsWithMessages
              })
     
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {
  getAllConversationItems: getAllConversationItems
}
