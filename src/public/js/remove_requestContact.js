
function removeRequestContact(){
  $(".user-remove-request-contact").bind("click" , function(){
    let targetId = $(this).data("uid");
    console.log(targetId);
    $.ajax({
      type: "delete",
      url: `/contact/remove-request-contact`,
      data: {uid: targetId},
      success: function (data) {
        if(data.success){
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).show();
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css("display" , "none");
          decreaseNotificationContact("count-request-contact-sent");
          socket.emit("remove-request-contact" , {contactId : targetId}) 
        }
      }
    });
  })
}

socket.on("response-remove-request-contact" , (user) => {
  $('.noti_content').find(`span[data-uid=${user.id}]`).remove();
  decreaseNotificationContact("count-request-contact-received")
  decreaseNotification("noti_contact_counter");
  decreaseNotification("noti_counter");
})