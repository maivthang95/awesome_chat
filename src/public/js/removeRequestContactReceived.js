
function removeRequestContactReceived(){
  $(".user-remove-request-contact-received").unbind("click").on("click" , function(){
    let targetId = $(this).data("uid");
    
    $.ajax({
      type: "delete",
      url: `/contact/remove-request-contact-received`,
      data: {uid: targetId},
      success: function (data) {
        console.log(data);
        if(data.success){
          //chưa xử lý
          // $('.noti_content').find(`div[data-uid=${user.id}]`).remove();
          // $("ul.list-notifications").find(`li div[data-uid=${user.id}]`).parent().remove();
          // decreaseNotification("noti_counter", 1);
          decreaseNotificationContact("count-request-contact-received"); // js/calculateNotifyContact.js
          decreaseNotification("noti_contact_counter", 1); //js.calculateNotification.js
          $("#request-contact-received").find(`li[data-uid =${targetId}]`).remove();
          socket.emit("remove-request-contact-received" , {contactId : targetId}) 
        }
      }
    });
  })
}



socket.on("response-remove-request-contact-received" , (user) => {
  $("div.membersList").find(`div.member-request-contact-sent[data-uid=${user.id}]`).show();
  $("div.membersList").find(`div.member-cancel-contact-sent[data-uid=${user.id}]`).css("display" , "none");
  $("#find-user").find(`div.user-add-new-contact[data-uid=${user.id}]`).css("display","inline-block"); 
  $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${user.id}]`).hide();
  $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();
  decreaseNotificationContact("count-request-contact-sent")
  decreaseNotification("noti_contact_counter", 1);
})

$(document).ready(function(){
  removeRequestContactReceived();
});