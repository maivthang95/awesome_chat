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
        
        let myMessage = $(`<div class="bubble me" data-mess-id="${data.message_id}"></div>`);
        if(dataTextEmojiForSend.isChatGroup){
          myMessage.html(`<img src="images/users/${data.sender.avatar}" class="avatar-small" title="${ data.sender.name}">`)
          myMessage.text(data.message.text);
          increaseNumberMessageGroup(divId)
        }else{
          myMessage.text(data.message.text);
        }
        let convertEmojiMessage = emojione.toImage(myMessage.html());
        myMessage.html(convertEmojiMessage) ;
        console.log(convertEmojiMessage);
        $(`.right .chat[data-chat = ${divId}] `).append(myMessage);
        nineScrollRight(divId);


        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");
        $(`.person[data-chat=${divId}]`).find(".preview").html(emojione.toImage(data.message.text));
        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());

        $(`.person[data-chat=${divId}]`).on("click.moveConversationToTop" , function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("click.moveConversationToTop");
        })

        $(`.person[data-chat=${divId}]`).click();
      }).fail(function( response ){
        alertify.notify(response.responseText , "error" , 5);
      })
    }
  })
}

