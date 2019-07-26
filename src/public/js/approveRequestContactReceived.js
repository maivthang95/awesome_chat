
function approveRequestContactReceived(){
  $(".user-approve-request-contact-received").unbind("click").on("click" , function(){
    let targetId = $(this).data("uid");
   
    $.ajax({
      type: "put",
      url: `/contact/approve-request-contact-received`,
      data: {uid: targetId},
      success: function (data) {
        console.log(data);
        if(data.success){
          let userInfor = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
          $(userInfor).find("div.user-approve-request-contact-received").remove();
          $(userInfor).find("div.user-remove-request-contact-received").remove();
          $(userInfor).find("div.contactPanel").append(`<div class="user-talk" data-uid="${targetId}">
                                                            Trò chuyện
                                                        </div>
                                                        <div class="user-remove-contact action-danger" data-uid="${targetId}">
                                                            Xóa liên hệ
                                                        </div>`);
          let userInfoHTML = $(userInfor).get(0).outerHTML ;
          $("#contacts").find("ul").prepend(userInfoHTML);
          $(userInfor).remove();
          decreaseNotificationContact("count-request-contact-received"); //js/calculateNotifyContact.js
          increaseNotificationContact("count-contacts");//js/calculateNotifyContact.js
          decreaseNotification("noti_contact_counter",1);//js/calculateNotificationt.js
          removeContact();
          //khi làm chức năng chat thì sẽ xóa tiếp user ở phần chat
          
          socket.emit("approve-request-contact-received" , {contactId : targetId}) 
        }
      }
    });
  })
}



socket.on("response-approve-request-contact-received" , (user) => {
  let noti = `<div class="notif-readed-false" data-uid="${user.id}">
  <img class="avatar-small" src="/images/users/${user.avatar}" alt=""> 
  <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn!
  </div>`
  $(".noti_content").prepend(noti);
  $("ul.list-notifications").prepend(`<li>${noti}</li>`);

  decreaseNotification("noti_contact_counter" , 1);
  increaseNotification("noti_counter" , 1);

  decreaseNotificationContact("count-request-contact-sent");
  increaseNotificationContact("count-contacts");
  $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();
  let userInfoHTML ; 
  if(user.avatar == "avatar-default.jpg"){
  userInfoHTML = ` 
  <li class="_contactList" data-uid="${user.id}">
    <div class="contactPanel">
        <div class="user-avatar">
            <img src="/images/users/default/${user.avatar}" alt="">
        </div>
        <div class="user-name">
            <p>
                ${user.username} 
            </p>
        </div>
        <br>
        <div class="user-address">
            <span>${user.address}</span>
        </div>
        <div class="user-talk" data-uid="${user.id}">
            Trò chuyện
        </div>
        <div class="user-remove-contact action-danger" data-uid="${user.id}">
            Xóa liên hệ
        </div>
    </div>
  </li>
  `
  }
  else  userInfoHTML = ` 
  <li class="_contactList" data-uid="${user.id}">
    <div class="contactPanel">
        <div class="user-avatar">
            <img src="/images/users/${user.avatar}" alt="">
        </div>
        <div class="user-name">
            <p>
                ${user.username} 
            </p>
        </div>
        <br>
        <div class="user-address">
            <span>${user.address}</span>
        </div>
        <div class="user-talk" data-uid="${user.id}">
            Trò chuyện
        </div>
        <div class="user-remove-contact action-danger" data-uid="${user.id}">
            Xóa liên hệ
        </div>
    </div>
  </li>`

  //khi làm chức năng chat thì sẽ xóa tiếp user ở phần chat
  $("#contacts").find("ul").prepend(userInfoHTML);
  removeContact();
})

$(document).ready(function(){
  approveRequestContactReceived();
});