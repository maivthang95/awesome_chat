function bufferToBase64(buffer){
  return btoa( new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
function attachmentChat(divId){
  $(`#attachment-chat-${divId}`).off("change").on("change" , function(){
    let fileData = $(this).prop("files")[0];
    let limitSize = 1048576 ; 
    let match = ["image/png" , "image/jpeg" , "image/jpg"]
    if($.inArray(fileData.type , match) > -1 ){
      alertify.notify("Tệp đính kèm không chứa file hình ảnh" , "error" , 6);
      return false ;
    }
    if(fileData.size > limitSize ) {
      alertify.notify("tệp đính kèm upload tối đa chỉ được 1MB" , "error" , 5);
      return false ;
    }

    let formData = new FormData() ; 
    formData.append("my-attachment-chat" , fileData) ;
    formData.append("uid" , divId)  ; 
    
    if($(this).hasClass("chat-in-group")){
      formData.append("isChatGroup" , true );
    }

    $.ajax({
      type: "post",
      url: "/message/add-new-attachment",
      data: formData,
      cache : false , 
      contentType : false , 
      processData : false ,
      success: function (data) {
        console.log(data) ; 
        let dataToEmit = {
          message : data.message 
        }

        //01 : handle message before show 
        let myMessage = $(`<div class="bubble me bubble-image-file" ></div>`);
        let fileMessage = `<a href="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}" downdload=${data.message.file.fileName}>
          ${data.message.file.fileName}
          </a>
        `
        if(data.message.conversationType == "group"){
          dataToEmit.groupId = divId ;
          let senderAvatar = `<img src="images/users/${data.message.sender.avatar}" class="avatar-small">`; 
          myMessage.html(`${senderAvatar} ${fileMessage}`) ;
          increaseNumberMessageGroup(divId);
        }else{
          dataToEmit.contactId = divId ;
          myMessage.html(`${fileMessage}`);
        }

        //02 : append message to screen
        $(`.right .chat[data-chat=${divId}]`).append(myMessage); 
        nineScrollRight(divId) ; 

        //03 : change data preview and time in leftSide
        $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find("span.preview").html(`Tệp đính kèm...`)

        //04 : Move Conversation to top 
        $(`.person[data-chat = ${divId}]`).on("moveFileConversationToTop" , function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("moveFileConversationToTop")
        })
        $(`.person[data-chat = ${divId}]`).trigger("moveFileConversationToTop");

        //05 : resolve realtime
        socket.emit("chat-attachment" , dataToEmit);

        //06 :  append to all-file-attachment
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(`<li>${fileMessage}</li>`);
      },
      error : function(error){
        alertify.notify(new Error ("có lỗi xảy ra : " + error) , "error" , 7);
      }
    });
  })
};


$(document).ready(function () {
  socket.on("response-chat-attachment" , response => {
    console.log(response);
    let divId = "" ; 
    //01
    let yourMessage = $(`<div class="bubble you bubble-image-file" ></div>`);
    let fileMessage = `<a href="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}" downdload="${response.message.file.fileName}">
    ${response.message.file.fileName}
    </a>
    `;
    if(response.currentGroupId){
      divId = response.currentGroupId ; 
      let senderAvatar = `<img src="images/users/${response.message.sender.avatar}" class="avatar-small">`; 
      yourMessage.html(`${senderAvatar} ${fileMessage}`) ;
    }else{
      divId = response.currentUserId ; 
      yourMessage.html(`${fileMessage}`);
    }
    //02
    if( response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat = ${divId}]`).append(yourMessage);
      nineScrollRight(divId);
      increaseNumberMessageGroup(divId) ; 
      $(`.person[data-chat = ${divId}]`).find("span.time").addClass("message-real-time")
    }else{
      nineScrollRight(divId);
    }

    //03: change data preview and time in leftSide
    $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat = ${divId}]`).find("span.preview").html(`Tệp đính kèm...`)

    //04 : move conversation to top
    $(`.person[data-chat = ${divId}]`).on("moveConversationToTop" , function(){
      let dataMove = $(this).parent();
      $(this).closest("ul").prepend(dataMove);
      $(`.right .chat[data-chat = ${divId}]`).getNiceScroll().onResize();
      $(this).off("moveConversationToTop");
    })

    $(`.person[data-chat = ${divId}]`).trigger("moveConversationToTop");
    
    //05 : append to all-file-attachment modal
    if( response.currentUserId !==  $("#dropdown-navbar-user").data("uid")){
    $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(`<li>${fileMessage}</li>`);
    }

  })
});
