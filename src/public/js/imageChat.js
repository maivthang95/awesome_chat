function BufferToBase64(buffer){
  return btoa( new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

function imageChat(divId){
  $(`#image-chat-${divId}`).off("change").on("change" , function(){
    let fileData = $(this).prop("files")[0];
   
    let match = ["image/png" , "image/jpg" , "image/jpeg"] ; 
    let limit = 1048576 ; //1 MG = .. bytes 

    if($.inArray(fileData.type , match) === -1 ) {
      alertify.notify("Kieu file khong hop le, chi chap nhan jpg,jpeg,png" ,"error" , 7);
      $(this).val(null);
      return false ;
    }

    if(fileData.size > limit){
      alertify.notify("Anh upload toi da chi duoc 1MB " , "error" , 7);
      $(this).val(null) ;
      return false ;
    }

    let targetId = $(this).data("chat");

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat" , fileData);
    messageFormData.append("uid" , targetId);
    if($(this).hasClass("chat-in-group")){
      messageFormData.append("isChatGroup" , true);
    }
    $.ajax({
      url : "/message/add-new-image" , 
      type : "post" , 
      cache : false , 
      contentType : false , 
      processData : false , 
      data : messageFormData , 
      success : function(data){
        let dataToEmit = {
          message : data.message
        }
         //01 : handle message data before show
        let myMessage = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message.senderId}"></div>`);
        let ImageMessage = `<img src="data:${data.message.file.contentType};base64,${ BufferToBase64(data.message.file.data.data) }" class="show-image-chat">`;
        
        if( $(`#image-chat-${divId}`).hasClass("chat-in-group")){
          dataToEmit.groupId = divId ; 
          let senderAvatar = `<img src="images/users/${data.message.sender.avatar}" class="avatar-small">`;
          myMessage.html(`${senderAvatar} ${ImageMessage}`); 
          increaseNumberMessageGroup(divId);
        }else{
          dataToEmit.contactId = divId ; 
          myMessage.html(`${ImageMessage}`);
        }

        //02 :  append message data to screen
        $(`.right .chat[data-chat = ${divId}]`).append(myMessage);
        nineScrollRight(divId);

        //03 : change data preview and time in leftSide
        $(`.person[data-chat = ${divId}]`).find(".preview").html("Hình ảnh ...");
        $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());

        //04 : Move Conversation to top
        $(`li.person[data-chat=${divId}]`).on("moveConversationImageMessageToTop" , function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove); 
          $(this).off("moveConversationImageMessageToTop");
        })
        $(`li.person[data-chat=${divId}]`).trigger("moveConversationImageMessageToTop");

        //05 : resolve realtime
        socket.emit("chat-image" , dataToEmit); 

        //06 : append to all-images
        $(`#imagesModal_${divId}`).find("div.all-images").append(`<img src="data:${data.message.file.contentType};base64,${ BufferToBase64(data.message.file.data.data)}">`);
        
        
      },
      error : function(error){
        alertify.notify(error , "error" , 5)
      }
    });
  })
}

$(document).ready(function () {
  socket.on("response-chat-image" , response => {
    console.log(response);
    let divId = "" ; 
    //01: handle message before show
    let yourMessage = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message.senderId}"></div>`);
    let imageMessage = `<img src="data:${response.message.file.contentType};base64,${ BufferToBase64(response.message.file.data.data) }" class="show-image-chat">`;
    if(response.currentGroupId){
      divId = response.currentGroupId ; 
      let senderAvatar = `<img src="images/users/${response.message.sender.avatar}" class="avatar-small">`;
      yourMessage.html(`${senderAvatar} ${imageMessage}`);
      
    }else{
      divId = response.currentUserId ;
      yourMessage.html(`${imageMessage}`);
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

    //03
    $(`.person[data-chat=${divId}]`).find(".preview").html("Hình ảnh ...");
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());

    //04
    $(`li.person[data-chat=${divId}]`).on("moveConversationImageMessageToTop" , function(){
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove); 
      $(this).off("moveConversationImageMessageToTop");
    })
    $(`li.person[data-chat=${divId}]`).trigger("moveConversationImageMessageToTop");

    //06 : append to all-images
    if( response.currentUserId !=  $("#dropdown-navbar-user").data("uid")){
    $(`#imagesModal_${divId}`).find("div.all-images").append(`<img src="data:${response.message.file.contentType};base64,${BufferToBase64(response.message.file.data.data) }">`);
    }
  })
});

