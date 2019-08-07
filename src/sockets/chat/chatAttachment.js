import {pushSocketIdToArray , emitNotifyToArray , removeSocketIdFromArray} from "./../../helpers/socketHelper";

let chatAttachment = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) =>{
    let currentUserId = socket.request.user._id ; 
    clients = pushSocketIdToArray(clients , currentUserId , socket.id) ; 
    socket.request.user.chatGroupIds.forEach ( group => {
      clients = pushSocketIdToArray(clients , group._id , socket.id) ; 
    })

    socket.on("chat-attachment" , (data) => {
      if(data.groupId){
        let response = {
          currentUserId : currentUserId , 
          message : data.message , 
          currentGroupId : data.groupId 
        }
        if( clients[data.groupId]){
          emitNotifyToArray(clients , data.groupId , io , "response-chat-attachment" , response) ;
        }
       
      }
      if(data.contactId){
        let response = {
          currentUserId : currentUserId , 
          message : data.message 
        }
        if(clients[data.contactId]){
          emitNotifyToArray(clients , data.contactId , io , "response-chat-attachment" , response) ;
        }
      }
    });

    socket.on("disconnect" , ()=>{
      clients = removeSocketIdFromArray(clients, currentUserId , socket.id) ; 
      socket.request.user.chatGroupIds.forEach( group => {
        clients = removeSocketIdFromArray(clients , group._id , socket.id );
      })
    });
    
  })
}

module.exports = chatAttachment;