//Step01 :
socket.on("server-send-list-users-online" , listUsersId =>{
  
  listUsersId.forEach( userId => {
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
  })
})


//Step02 :
socket.on("server-send-user-just-online" , currentUserId => {
  $(`.person[data-chat=${currentUserId}]`).find("div.dot").addClass("online");
  $(`.person[data-chat=${currentUserId}]`).find("img").addClass("avatar-online");
})

socket.on("server-send-user-just-offline" , currentUserId => {
  $(`.person[data-chat=${currentUserId}]`).find("div.dot").removeClass("online");
  $(`.person[data-chat=${currentUserId}]`).find("img").removeClass("avatar-online");
})