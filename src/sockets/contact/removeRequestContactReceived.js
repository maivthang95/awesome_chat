import {pushSocketIdToArray ,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper"

/**
 * 
 * @param io from socket.io lib
 */
let removeRequestContactReceived = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    //push socket.id array
    let currentUserId = socket.request.user._id ;

    clients = pushSocketIdToArray( clients , currentUserId , socket.id);

    
    socket.on("remove-request-contact-received" , (data) =>{
      let currentUser = {
        id : socket.request.user._id
      }

      //emit notification 
      if(clients[data.contactId]){
        emitNotifyToArray(clients , data.contactId , io ,"response-remove-request-contact-received" , currentUser)
      }
   
    })

    socket.on("disconnect" , ()=>{
      //remove socket.id when socket disconnect
      clients = removeSocketIdFromArray(clients , currentUserId , socket.id);

    });
    
   
  })
}

module.exports = removeRequestContactReceived;