
function removeRequestContactSent(){
  $(".user-remove-request-contact-sent").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    
    $.ajax({
      type: "delete",
      url: `/contact/remove-request-contact-sent`,
      data: {uid: targetId},
      success: function (data) {
        if(data.success){
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).show();
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).css("display" , "none");
          decreaseNotificationContact("count-request-contact-sent"); // js/calculateNotifyContact.js
          decreaseNotification("noti_contact_counter", 1); //js.calculateNotification.js
          $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();
          socket.emit("remove-request-contact-sent" , {contactId : targetId}) 
          
        }
      }
    });
  })
}

$(document).ready(function () {
  removeRequestContactSent();
});

socket.on("response-remove-request-contact-sent" , (user) => {
  $('.noti_content').find(`div[data-uid=${user.id}]`).remove();
  $("ul.list-notifications").find(`li div[data-uid=${user.id}]`).parent().remove();
  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();
  decreaseNotificationContact("count-request-contact-received")
  decreaseNotification("noti_contact_counter", 1);
  decreaseNotification("noti_counter", 1);
 
})

