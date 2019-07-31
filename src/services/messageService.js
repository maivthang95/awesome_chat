import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";
const LIMIT_CONVERSATION = 15;

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
          user = user.toObject();  
          user.createdAt = contact.createdAt ; 
          return user;
        }else{
          let user= await userModel.getNormalUserDataById(contact.contactId) ;
          user = user.toObject();  
          user.createdAt = contact.createdAt ;
          return user;
        }
      })
      let usersConversation = await Promise.all(usersConversationPromise);

      let groupConversations = await chatGroupModel.getChatGroups(currentUserId , LIMIT_CONVERSATION) ; 
      let allConversations = usersConversation.concat(groupConversations);
      allConversations = _.sortBy(allConversations , (item) => -item.createdAt)

      resolve({usersConversation: usersConversation , 
                groupConversations : groupConversations ,
                allConversations : allConversations
              })
     
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {
  getAllConversationItems: getAllConversationItems
}
