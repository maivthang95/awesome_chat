import {pushSocketIdToArray ,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper"
/**
 * 
 * @param io from socket.io lib
 */
let typingOff = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    let currentUserId = socket.request.user._id ;
    
    clients = pushSocketIdToArray( clients , currentUserId , socket.id);
    
    socket.request.user.chatGroupIds.forEach( group => {
      clients = pushSocketIdToArray( clients , group._id , socket.id);
    })

    socket.on("user-stop-typing" , (data) =>{
        if(data.groupId){
          let response = {
            currentUserId : socket.request.user._id ,
            currentGroupId : data.groupId
          }
         
          if(clients[data.groupId]){
            emitNotifyToArray(clients , data.groupId , io ,"response-user-stop-typing" , response)
          }
        }
        if(data.contactId){
            let response = {
                currentUserId : socket.request.user._id 
            }
            if(clients[data.contactId]){
              emitNotifyToArray(clients , data.contactId , io ,"response-user-stop-typing" , response)
            }
        }
     
    })

    socket.on("create-new-group" , (data) =>{
      clients = pushSocketIdToArray( clients , data.groupChat._id , socket.id);
    })

    socket.on("member-received-group-chat" , data => {
      clients = pushSocketIdToArray( clients , data.groupChatId , socket.id);
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

module.exports = typingOff;