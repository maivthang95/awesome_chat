function callReadMoreContacts(){
  let skipNumber = $("#contacts").find("li").length;
  $("#link-read-more-contacts").css("display" , "none")
  $(".read-more-contacts-loading").css("display" , "inline-block");

  $.get(`/contacts/read-more-contacts?skipNumber=${skipNumber}`,
  function (newContactUsers) {
    
    if(!newContactUsers.length){
      alertify.notify("Không còn bạn bè nào để xem" , "error" , 5);
      $("#link-read-more-contacts").css("display" , "none")
      $(".read-more-contacts-loading").css("display" , "inline-block");
      return false ;
    }
    newContactUsers.forEach( function(user) {
     let userContactInfor ; 
     if(user.avatar == "avatar-default.jpg"){
       userContactInfor = `<li class="_contactList" data-uid="${user._id}">
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
                                    <span> ${user.address ? user.address : ""}</span>
                                </div>
                                <div class="user-talk" data-uid="user._id">
                                    Trò chuyện
                                </div>
                                <div class="user-remove-contact action-danger" data-uid="user._id">
                                    Xóa liên hệ
                                </div>
                            </div>
                        </li>`;
     }else {
     userContactInfor = `<li class="_contactList" data-uid="${user._id}">
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
                                <span> ${user.address ? user.address : ""}</span>
                            </div>
                            <div class="user-talk" data-uid="user._id">
                                Trò chuyện
                            </div>
                            <div class="user-remove-contact action-danger" data-uid="user._id">
                                Xóa liên hệ
                            </div>
                        </div>
                      </li>`;
     }
     $("#contacts ul").append(userContactInfor);
    })
    $("#link-read-more-contacts").css("display" , "inline-block")
    $(".read-more-contacts-loading").css("display" , "none");
  }
);
}

function callReadMoreContactsSent(){
  let skipNumber = $("#request-contact-sent").find("li").length;
  $("#link-read-more-contactsSent").css("display" , "none") ; 
  $(".read-more-contactsSent-loading").css("display" , "inline-block");

  $.get(`/contacts/read-more-contacts-sent?skipNumber=${skipNumber}` , function( contactsSent ){
    if(!contactsSent.length){
      alertify.notify("Hiện tại không còn người đang chờ xác nhận" , "error" , 5) ; 
      $("#link-read-more-contactsSent").css("display" , "none") ; 
      $(".read-more-contactsSent-loading").css("display" , "inline-block");
      return false ; 
    }
    contactsSent.forEach( function(user){
      let userContactInfor ; 
     if(user.avatar == "avatar-default.jpg"){
       userContactInfor = `<li class="_contactList" data-uid="${user._id}">
                            <div class="contactPanel">
                                <div class="user-avatar">
                                    <img src="/images/users/default/${user.avatar}" alt="">
                                </div>
                                <div class="user-name">
                                    <p>
                                        ${ user.username}
                                    </p>
                                </div>
                                <br>
                                <div class="user-address">
                                    <span>${user.address ? user.address : ""} </span>
                                </div>
                                <div class="user-remove-request-sent action-danger" data-uid="user._id">
                                    Hủy yêu cầu
                                </div>
                            </div>
                        </li>`;
     }else {
     userContactInfor = `<li class="_contactList" data-uid="<%= user._id %>">
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
                                <span>${user.address ? user.address : ""}</span>
                            </div>
                            <div class="user-remove-request-sent action-danger" data-uid="user._id">
                                Hủy yêu cầu
                            </div>
                        </div>
                    </li>`;
     }
     $("#request-contact-sent ul").append(userContactInfor);
    })
    $("#link-read-more-contactsSent").css("display" , "inline-block") ; 
    $(".read-more-contactsSent-loading").css("display" , "none");
  })
}

function callReadMoreContactsReceived(){
  let skipNumber = $("#request-contact-received").find("li").length ; 
  $("#link-read-more-contactsReceived").css("display" , "inline-block");
  $(".read-more-contactsReceived-loading").css("display" , "none") ;

  $.get(`/contacts/read-more-contacts-received?skipNumber=${skipNumber}` , function( contactsReceived ){
    if(!contactsReceived.length){
      alertify.notify("Không còn yêu cầu kết bạn nào" , "error" , 5);
      $("#link-read-more-contactsReceived").css("display" , "none");
      $(".read-more-contactsReceived-loading").css("display" , "inline-block") ;
      return false ;
    }
    let userReceivedInfo ; 
    contactsReceived.forEach( function(user) {
      if(user.avatar == "avatar-default.jpg"){
        userReceivedInfo = `<li class="_contactList" data-uid="${user._id}">
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
                                      <span>${user.address ? user.address : ""}</span>
                                  </div>
                                  <div class="user-acccept-contact-received" data-uid="user._id">
                                      Chấp nhận
                                  </div>
                                  <div class="user-reject-request-contact-received action-danger" data-uid="user._id">
                                      Xóa yêu cầu
                                  </div>
                              </div>
                          </li>`;
      }
      else {
        userReceivedInfo = `<li class="_contactList" data-uid="${user._id}">
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
                                      <span>${user.address ? user.address : ""}</span>
                                  </div>
                                  <div class="user-acccept-contact-received" data-uid="user._id">
                                      Chấp nhận
                                  </div>
                                  <div class="user-reject-request-contact-received action-danger" data-uid="user._id">
                                      Xóa yêu cầu
                                  </div>
                              </div>
                          </li>`;
      }
      $("#request-contact-received ul").append(userReceivedInfo);
    })
    $("#link-read-more-contactsReceived").css("display" , "inline-block");
    $(".read-more-contactsReceived-loading").css("display" , "none") ;

  })
}

$(document).ready(function () {
  $("#link-read-more-contacts").bind("click" , function(){
   callReadMoreContacts();   
  })

  $("#link-read-more-contactsSent").bind("click" , function(){
    callReadMoreContactsSent(); 
  })
  
 $("#link-read-more-contactsReceived").bind("click" , function(){
   callReadMoreContactsReceived();
 })
});