
function textAndEmojiChat(divId){
  $(".emojionearea").off("keyup").on("keyup" , function(element){
    let currentEmojioneArea = $(this);
    if(element.which == 13){
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();

      if(!targetId.length || !messageVal.length){
        return false ;
      }
      let dataTextEmojiForSend = {
        uid : targetId ,
        messageVal : messageVal
      }

      if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        dataTextEmojiForSend.isChatGroup = true ;
      }
      $.post("/message/add-new-text-emoji" , dataTextEmojiForSend , function(data){
        let dataToEmit = {
          message : data.message
        }

        //01 : handle message data before show
        let myMessage = $(`<div class="bubble me" data-mess-id="${data.message_id}"></div>`);
        myMessage.text(data.message.text);
        let convertEmojiMessage = emojione.toImage(myMessage.html());

        
        if(dataTextEmojiForSend.isChatGroup){
          let senderAvatar = `<img src="images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`
          myMessage.html(`${senderAvatar} ${convertEmojiMessage}`);
          
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
          }else{
            myMessage.html(convertEmojiMessage) ;
            dataToEmit.contactId = targetId  ;
          }
        
       
        
        //02: append message data to screen
        $(`.right .chat[data-chat = ${divId}] `).append(myMessage);
        nineScrollRight(divId);

        //03: Remove all data at right

        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");
        //04 : change data preview and  time in leftSide
        $(`.person[data-chat=${divId}]`).find(".preview").html(emojione.toImage(data.message.text));
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());

        //05 : Move conversation user to top
        $(`.person[data-chat=${divId}]`).on("concentrate.moveConversationToTop" , function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("concentrate.moveConversationToTop");
        })
        $(`.person[data-chat=${divId}]`).trigger("concentrate.moveConversationToTop")
      
        //06 : resolve real time
        socket.emit("chat-text-emoji" , dataToEmit);

        //07: emit remove typing-realtime
        typingOff(divId);

        //08:if this is typing , remove immediately
        let checkTyping = $(`.chat[data-chat = ${divId}]`).find("div.bubble-typing-gif");
        if(checkTyping.length){
          checkTyping.remove();
        }
      }).fail(function( response ){
        alertify.notify(response.responseText , "error" , 5);
      })
    }
  })
}

$(document).ready(function () {
  socket.on("response-chat-text-emoji" , response => {
    console.log(response);
    let divId = "";
    //01
    let yourMessage = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
   
    yourMessage.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(yourMessage.html());
  
      if(response.currentGroupId){
        divId = response.currentGroupId; 
        let senderAvatar = `<img src="images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}">`;
        yourMessage.html(`${senderAvatar} ${convertEmojiMessage}`);
       
      }else{
        divId = response.currentUserId;
        yourMessage.html(convertEmojiMessage) ;
      }
      
    
      //02
      if( response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        $(`.right .chat[data-chat=${divId}]`).append(yourMessage);
        increaseNumberMessageGroup(divId); 
        nineScrollRight(divId);
        $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-real-time")
      }
      else{
        nineScrollRight(divId);
      }
     
  
       //03: Remove all data at right: nothing to code
  
       //04
       $(`.person[data-chat=${divId}]`).find(".preview").html(emojione.toImage(response.message.text));
       $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
  
       //05
       $(`.person[data-chat=${divId}]`).on("concentrate.moveConversationToTop" , function(){
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("concentrate.moveConversationToTop");
      })
      $(`.person[data-chat=${divId}]`).trigger("concentrate.moveConversationToTop")
  
     
       //06 : resolve real time : nothing to code
  })
  
});
