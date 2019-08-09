import {pushSocketIdToArray ,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper"
/**
 * 
 * @param io from socket.io lib
 */
let newGroupChat = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    let currentUserId = socket.request.user._id ;
    
    clients = pushSocketIdToArray( clients , currentUserId , socket.id);
    
    socket.request.user.chatGroupIds.forEach( group => {
      clients = pushSocketIdToArray( clients , group._id , socket.id);
    })

    socket.on("create-new-group" , (data) =>{
      clients = pushSocketIdToArray( clients , data.groupChat._id , socket.id);
      
      let response = {
        groupChat : data.groupChat
      }
      data.groupChat.members.forEach( member => {
        if(clients[member.userId] && member.userId != socket.request.user._id){
          emitNotifyToArray(clients, member.userId , io , "response-create-new-group" , response);
        }
      })
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

module.exports = newGroupChat;