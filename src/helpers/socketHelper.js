export let pushSocketIdToArray = (clients ,  userId ,  socketId) => {
  if(clients[userId]){
    clients[userId].push(socketId) ; 
  }else{
    clients[userId] = [socketId];
  }
  return clients;
} ;
export let emitNotifyToArray = (clients , userId, io , nameEvent , data) => {
  clients[userId].forEach( socketId => io.sockets.connected[socketId].emit(nameEvent , data));

} ;
export let removeSocketIdFromArray = (clients , userId , socketId ) => {
  clients[userId] =  clients[userId].filter( socketItem => socketItem !== socketId )
  if(!clients[userId].length){
    delete clients[userId];
  }
  return clients;
};