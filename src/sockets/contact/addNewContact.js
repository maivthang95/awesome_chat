import {pushSocketIdToArray ,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper"
/**
 * 
 * @param io from socket.io lib
 */
let addNewContact = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    let currentUserId = socket.request.user._id ;

    clients = pushSocketIdToArray( clients , currentUserId , socket.id);
    
    socket.on("add-new-contact" , (data) =>{
      let currentUser = {
        id : socket.request.user._id  ,
        username : socket.request.user.username , 
        avatar : socket.request.user.avatar,
        address : socket.request.user.address ? socket.request.user.address : ""
      }

      //emit notification 
      if(clients[data.contactId]){
        emitNotifyToArray(clients , data.contactId , io ,"response-add-new-contact" , currentUser)
      }
     
    })

    socket.on("disconnect" , ()=>{
      //remove socket.id when socket disconnect
      clients = removeSocketIdFromArray(clients , currentUserId , socket.id);
    });
  
  })
}

module.exports = addNewContact;