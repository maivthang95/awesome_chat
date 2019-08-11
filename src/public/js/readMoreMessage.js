function readMoreMessages(){
  $(".right .chat").scroll(function(){
    //get first message
    
    let firstMessage = $(this).find("div.bubble:first");
    //get position of first message 
    
    let currentOffsetTop = firstMessage.offset().top - $(this).scrollTop();
    console.log(firstMessage.offset().top );
    console.log($(this).scrollTop());
    if($(this).scrollTop() === 0){
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
      $(this).prepend(messageLoading);
      let targetId = $(this).data("chat") ; 
      let skipMessage = $(this).find("div.bubble").length ;
      let chatInGroup = $(`#write-chat-${targetId}`).hasClass("chat-in-group") ? true  : false ;
      
      $.get(`/message/read-more-messages?skipMessages=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,function(data){
        //Step01 : handle RightSide
        $(`.chat[data-chat = ${targetId}]`).prepend(data.rightSideData);
       console.log(firstMessage.offset().top )
        $(`.chat[data-chat = ${targetId}]`).scrollTop(firstMessage.offset().top -  currentOffsetTop);
        //Step02 : prevent Scroll
        
        $(`.chat[data-chat = ${targetId}]`).find("img.message-loading").remove();
        //step03 : convert EmojiText
        convertEmoji();
        //Step04 : Handle Image Modal
        $(`#imagesModal_${targetId}`).find("div.all-images").prepend(data.imageModalData);
        gridPhotos(5); 
        //Step05 : handle Attachment Modal
        $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").prepend(data.attachmentModalData);

      })
    }
  })
}

$(document).ready(function () {
  readMoreMessages();
});