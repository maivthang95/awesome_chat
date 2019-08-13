
function removeMemberRequestContactSent(){
  $(".member-cancel-contact-sent").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
   
    $.ajax({
      type: "delete",
      url: "/contact/remove-request-contact-sent",
      data: {uid : targetId },
      success: function (data) {
        if(data.success){
          $("div.membersList").find(`div.member-request-contact-sent[data-uid=${targetId}]`).show();
          $("div.membersList").find(`div.member-cancel-contact-sent[data-uid=${targetId}]`).css("display" , "none");
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
  removeMemberRequestContactSent();
});

