function callReadMoreAllChats(){
  let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
  let skipGroup = $("#all-chat").find("li.group-chat").length;
  $("#link-read-more-all-chat").css("display" , "none")
  $(".read-more-all-chat-loading").css("display" , "inline-block");
  console.log(skipPersonal);
  console.log(skipGroup);
  $.get(`/messages/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,
  function (data) {
    if(data.leftSideData.trim() == ""){
      alertify.notify("Không còn cuộc trò chuyện nào để xem" , "error" , 5);
      $("#link-read-more-all-chat").css("display" , "inline-block")
      $(".read-more-all-chat-loading").css("display" , "none");
      return false ;
    }
    //Step01 : handle leftSide
    $("#all-chat").find("ul").append(data.leftSideData);
    //Step02 : call scroll 
    resizeNiceScrollLeft();
    nineScrollLeft();

    //Step03 :handle rightSide 
    $("#screen-chat").append(data.rightSideData);
    convertEmoji();
    //Step04: call function screen chat 
    changeScreenChat();

    //Step05 : handle image Modal
    $("body").append(data.imageModalData);
    gridPhotos(5);
    //Step06 : handle attachment Modal
    $("body").append(data.attachmentModalData);

    //Step07 : check status
    socket.emit("check-status");

    $("#link-read-more-all-chat").css("display" , "inline-block")
    $(".read-more-all-chat-loading").css("display" , "none");

    
  }
);
}



$(document).ready(function () {
  $("#link-read-more-all-chat").bind("click" , function(){
   callReadMoreAllChats();   
  })
});