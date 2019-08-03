import {pushSocketIdToArray ,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper"
/**
 * 
 * @param io from socket.io lib
 */
let chatTextEmoji = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    let currentUserId = socket.request.user._id ;
    
    clients = pushSocketIdToArray( clients , currentUserId , socket.id);
    
    socket.request.user.chatGroupIds.forEach( group => {
      clients = pushSocketIdToArray( clients , group._id , socket.id);
    })

    socket.on("chat-text-emoji" , (data) =>{
        if(data.groupId){
          let response = {
            currentUserId : socket.request.user._id ,
            message : data.message , 
            currentGroupId : data.groupId
          }
         
          if(clients[data.groupId]){
            emitNotifyToArray(clients , data.groupId , io ,"response-chat-text-emoji" , response)
          }
        }
        if(data.contactId){
            let response = {
                currentUserId : socket.request.user._id ,
                message : data.message
            }
            if(clients[data.contactId]){
              emitNotifyToArray(clients , data.contactId , io ,"response-chat-text-emoji" , response)
            }
        }
     
    })

    socket.on("disconnect" , ()=>{
      //remove socket.id when socket disconnect
      clients = removeSocketIdFromArray(clients , currentUserId , socket.id);
      socket.request.user.chatGroupIds.forEach( group => {
      clients = removeSocketIdFromArray(clients , group._id , socket.id);
      })
    });
  
  })
}

module.exports = chatTextEmoji;