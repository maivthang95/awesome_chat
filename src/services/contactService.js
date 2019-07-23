import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel"
import _ from "lodash";

let findUserContact = ( currentUserId , keyword ) => {
  return new Promise ( async (resolve , reject) => {
    let deprecatedUserIds = [currentUserId]  ;
    let contactsByUser = await contactModel.findAllByUsers(currentUserId);
    contactsByUser.forEach( (contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    })
    
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    let users = await userModel.findAllForAddContact(deprecatedUserIds , keyword);
    resolve(users);
  })
}


let addNew = (currentUserId , contactId) => {
  return new Promise( async (resolve , reject )=>{
    let contactExists = await contactModel.checkExists( currentUserId , contactId )
    if(contactExists){
      return reject(false ) ;
    }
    //create Contact
    let newContactItem = {
      userId : currentUserId ,
      contactId :contactId
    }
    let newContact = await contactModel.createNew(newContactItem);

    //create Notification
    let notificationItem = {
      senderId : currentUserId , 
      receiverId : contactId , 
      type : NotificationModel.types.ADD_CONTACT
    }

    await NotificationModel.model.createNew(notificationItem);
    resolve(newContact)
  })
}

let removeRequestContact = (currenUserId , contactId ) => {
  return new Promise(async (resolve , reject) => {
    let removeReq = await contactModel.removeRequestContact(currenUserId , contactId ) ;
    if(removeReq.result.n == 0){
      return reject(false);
    }

    //remove notification
    let NotificationAddContact = NotificationModel.types.ADD_CONTACT
    await NotificationModel.model.removeRequestContactNotification(currenUserId , contactId , NotificationAddContact );
    resolve(true);
  })
}

module.exports = {
  findUserContact : findUserContact,
  addNew : addNew ,
  removeRequestContact : removeRequestContact
}