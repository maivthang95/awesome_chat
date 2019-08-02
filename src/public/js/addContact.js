

function addContact(){
  $(".user-add-new-contact").bind("click" , function(){
    let targetId =$(this).data("uid");
    $.post("/contact/add-new", {uid: targetId} , function(data){
      if(data.success){
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).css("display" , "inline-block")

        increaseNotificationContact("count-request-contact-sent" );// js/calculateNotifyContact.js
        increaseNotification("noti_contact_counter" , 1); //js.calculateNotification.js
        let userInfoHTML = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML ; 

        $("#request-contact-sent").find("ul").prepend(userInfoHTML);
        removeRequestContactSent();

        socket.emit("add-new-contact" , {contactId : targetId});
        
      }
    })

  })
}

socket.on("response-add-new-contact", (user) => {
  let noti = `<div class="notif-readed-false" data-uid="${user.id}">
  <img class="avatar-small" src="/images/users/${user.avatar}" alt=""> 
  <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
  </div>`
  $(".noti_content").prepend(noti);
  $("ul.list-notifications").prepend(`<li>${noti}</li>`);
  increaseNotificationContact("count-request-contact-received")
  increaseNotification("noti_contact_counter" , 1);
  increaseNotification("noti_counter" , 1);
  let userInfoHTML ;
  if(user.avatar == "avatar-default.jpg"){
      //Thêm modal yêu cấu kết bạn
  userInfoHTML = ` <li class="_contactList" data-uid="${user.id}">
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
                            <div class="user-approve-request-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                      </li>`
  }
  else userInfoHTML = ` <li class="_contactList" data-uid="${user.id}">
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
                            <div class="user-approve-request-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                      </li>`
  $("#request-contact-received ul").prepend(userInfoHTML);
  removeRequestContactReceived(); //js.removeRequestContactReceived.js
  approveRequestContactReceived();
})
