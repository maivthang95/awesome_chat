import {pushSocketIdToArray ,removeSocketIdFromArray} from "./../../helpers/socketHelper"

let userOnlineOffline = (io) => {
  let clients = {} ; 
  io.on("connection" , (socket) => {
    
    clients = pushSocketIdToArray( clients , socket.request.user._id  , socket.id);
    
    socket.request.user.chatGroupIds.forEach( group => {
      clients = pushSocketIdToArray( clients , group._id , socket.id);
    })

    let listUsersOnline = Object.keys(clients);
    console.log(listUsersOnline);
    //Step01 : Emit to user after login or f5
    socket.emit("server-send-list-users-online" , listUsersOnline );

    //Step02: Emit to all another user when has new user online
    socket.broadcast.emit("server-send-user-just-online" , socket.request.user._id );

    socket.on("disconnect" , ()=>{
      //remove socket.id when socket disconnect
      clients = removeSocketIdFromArray(clients , socket.request.user._id , socket.id);
      socket.request.user.chatGroupIds.forEach( group => {
      clients = removeSocketIdFromArray(clients , group._id , socket.id);
      });
      if(!clients[socket.request.user._id ]){
      socket.broadcast.emit("server-send-user-just-offline" , socket.request.user._id );
      }
    });
  
  })
}

module.exports = userOnlineOffline;