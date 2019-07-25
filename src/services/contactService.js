import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel"
import _ from "lodash";

const LIMIT_NUMBER = 8 ; 
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

let getContacts = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await contactModel.getContacts(currenUserId , LIMIT_NUMBER);
      let users = contacts.map( async ( contact ) => {
        if(contact.contactId == currenUserId){
          return await userModel.findUserById(contact.userId)
        }else{
          return await userModel.findUserById(contact.contactId) ;
        }
      })
      resolve(await Promise.all(users))
    } catch (error) {
      reject(error)
    }
  })
}

let getContactsSent = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await contactModel.getContactsSent(currenUserId , LIMIT_NUMBER);
      let users = contacts.map( async ( contact ) => {
        return await userModel.findUserById(contact.contactId) ;
        
      })
      resolve(await Promise.all(users))
    } catch (error) {
      reject(error)
    }
  })
}

let getContactsReceived = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await contactModel.getContactsReceived(currenUserId , LIMIT_NUMBER);
      let users = contacts.map( async ( contact ) => {
        return await userModel.findUserById(contact.userId) ;
      })
      resolve(await Promise.all(users))
    } catch (error) {
      reject(error)
    }
  })
}


let countAllContacts = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contacts = await contactModel.countAllContacts(currenUserId);
      resolve(contacts);
    } catch (error) {
      reject(error)
    }
  })
}

let countAllContactsSent = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contactsSent = await contactModel.countAllContactsSent(currenUserId );
     resolve(contactsSent);
    } catch (error) {
      reject(error)
    }
  })
}


let countAllContactsReceived = (currenUserId  ) => {
  return new Promise(async (resolve , reject) => {
    try {
      let contactsReceived = await contactModel.countAllContactsReceived(currenUserId);
     resolve(contactsReceived);
    } catch (error) {
      reject(error)
    }
  })
}



module.exports = {
  findUserContact : findUserContact,
  addNew : addNew ,
  removeRequestContact : removeRequestContact,
  getContacts : getContacts ,
  getContactsSent : getContactsSent , 
  getContactsReceived : getContactsReceived ,
  countAllContacts : countAllContacts , 
  countAllContactsSent : countAllContactsSent , 
  countAllContactsReceived : countAllContactsReceived
}