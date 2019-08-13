import {notification,contact,message , groupChat} from "./../services/index";
import {bufferToBase64 ,lastItemOfArray , convertTimeStampToHumanTime} from "./../helpers/clientHelper";
import request from "request";
let getICETurnServer = () => {
  return new Promise (async (resolve , reject ) =>{
    // // Node Get ICE STUN and TURN list
    //   let o = {
    //     format: "urls"
    //   };

    //   let bodyString = JSON.stringify(o);
    //   let options = {
    //         url : "https://global.xirsys.net/_turn/awesome-chat",
    //         // host: "global.xirsys.net",
    //         // path: "/_turn/awesome-chat",
    //         method: "PUT",
    //         headers: {
    //             "Authorization": "Basic " + Buffer.from("maivthang95:c239aed2-b974-11e9-a4b3-0242ac110003").toString("base64"),
    //             "Content-Type": "application/json",
    //             "Content-Length": bodyString.length
    //         }
    //   };

    //   //Call a request to get ICE list of turn server 
    //   request(options , (error , response , body ) => {
    //     if(error){
    //       console.log("Error when get ICE list: " + error) ;
    //       return reject(error);
    //     }
    //     let bodyJSON = JSON.parse(body);
    //    resolve(bodyJSON.v.iceServers);
    //   })
    resolve([]);
  })
}

let getHome = async (req , res) => {
  //only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);
  //get amount notifications unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  //get contact 10 item one time
  let contacts = await contact.getContacts(req.user._id);
  //get contact send item 
  let contactsSent = await contact.getContactsSent(req.user._id);
  //get contact receive item 
  let contactsReceived = await contact.getContactsReceived(req.user._id);


  //count All contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  //count all contacts sent
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  //count ll contacts received
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);

  let getGroupAndAllMembersInfor = await groupChat.getGroupInforAndAllMembers( req.user._id) ; 

  let allConversationsWithMessages = getAllConversationItems.allConversationsWithMessages ; 

  //get ICE list from xirsys turn server
  let iceServersList = await getICETurnServer() ;
  
   res.render("main/home/home" , {
    errors : req.flash("errors"),
    success : req.flash("success"),
    user : req.user  ,
    notifications : notifications ,
    countNotifUnread : countNotifUnread ,
    contacts : contacts , 
    contactsSent : contactsSent , 
    contactsReceived : contactsReceived,
    countAllContacts : countAllContacts ,
    countAllContactsSent : countAllContactsSent,
    countAllContactsReceived : countAllContactsReceived,
    getGroupAndAllMembersInfor : getGroupAndAllMembersInfor,
    allConversationsWithMessages : allConversationsWithMessages,
    
    bufferToBase64 : bufferToBase64,
    lastItemOfArray : lastItemOfArray,
    convertTimeStampToHumanTime : convertTimeStampToHumanTime,
    iceServersList : JSON.stringify(iceServersList),
    
  }); 
}

module.exports = {
  getHome : getHome
}
