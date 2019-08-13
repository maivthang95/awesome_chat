import {pushSocketIdToArray ,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper"

/**
 * 
 * @param io from socket.io lib
 */
let removeMemberRequestContactSent = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    //push socket.id array
    let currentUserId = socket.request.user._id ;

    clients = pushSocketIdToArray( clients , currentUserId , socket.id);

    
    socket.on("remove-member-request-contact-sent" , (data) =>{
      let currentUser = {
        id : socket.request.user._id
      }

      //emit notification 
      if(clients[data.contactId]){
        emitNotifyToArray(clients , data.contactId , io ,"response-remove-member-request-contact-sent" , currentUser)
      }
   
    })

    socket.on("disconnect" , ()=>{
      //remove socket.id when socket disconnect
      clients = removeSocketIdFromArray(clients , currentUserId , socket.id);

    });
    
   
  })
}

module.exports = removeMemberRequestContactSent;