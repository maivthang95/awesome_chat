
function approveRequestContactReceived(){
  $(".user-approve-request-contact-received").unbind("click").on("click" , function(){
    let targetId = $(this).data("uid");
    let targetUserName = $(this).closest("li").find("div.user-name > p").text();
    targetUserName = targetUserName.trim() ;
    let targetUserAvatar = $(this).closest("li").find("div.user-avatar img").attr("src");

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
          
          socket.emit("approve-request-contact-received" , {contactId : targetId}) ;

          //All step handle chat after approve'

          //Step01 : hide modal 
          // $("#contactsModal").modal("hide");

          //Step02 : handle leftSide.ejs

          let subTargetUsername = targetUserName;
          if(subTargetUsername.length > 18){
            subTargetUsername = subTargetUsername.substr(0,15) + "..." ;
          }
          let leftSideData = `
          <a href="#uid_${targetId}" class="room-chat" data-target="#to_${targetId}">
                    
          <li class="person" data-chat="${targetId}"  title="${targetUserName}">
              <div class="left-avatar">
                  <div class="dot"></div>
                  <img src="${targetUserAvatar}" title="${targetUserName}" >
              </div>
              <span class="name">
                 ${subTargetUsername}
              </span>
              <span class="time"> 
                    
              </span>
              <span class="preview convert-emoji">
                 
              </span>
            </li>
          </a>
          `;

          $("#all-chat").find("ul.people").prepend(leftSideData);
          $("#user-chat").find("ul.people").prepend(leftSideData);

          //Step03 : handle RightSide.ejs
          let rightSideData = `
          <div class="right tab-pane" data-chat="${targetId}" id="to_${targetId}">
          <div class="top">
                  <span>To: <span class="name">${targetUserName}</span></span>
                  <span class="chat-menu-right">
                      <a href="#attachmentsModal_${targetId}" class="show-attachments" data-toggle="modal">
                          Tệp đính kèm
                          <i class="fa fa-paperclip"></i>
                      </a>
                  </span>
                  <span class="chat-menu-right">
                      <a href="javascript:void(0)">&nbsp;</a>
                  </span>
                  <span class="chat-menu-right">
                      <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                          Hình ảnh
                          <i class="fa fa-photo"></i>
                      </a>
                  </span>
          </div>
          <div class="content-chat">
                  <div class="chat convert-emoji"  data-chat="${targetId}">
                      
                  </div>
              </div>
              <div class="write" data-chat="${targetId}">
                  <input type="text" class="write-chat" id="write-chat-${targetId}" data-chat="${targetId}">
                  <div class="icons">
                      <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                      <label for="image-chat-${targetId}" class="label-image-chat">
                          <input type="file" id="image-chat-${targetId}" name="my-image-chat" class="image-chat" data-chat="${targetId}">
                          <i class="fa fa-photo"></i>
                      </label>
                      <label for="attachment-chat-${targetId}" class="label-attachment-chat">
                          <input type="file" id="attachment-chat-${targetId}" name="my-attachment-chat" class="attachment-chat" data-chat="${targetId}">
                          <i class="fa fa-paperclip"></i>
                      </label>
                      <a href="javascript:void(0)" id="video-chat-${targetId}" class="video-chat" data-chat="${targetId}" >
                          <i class="fa fa-video-camera"></i>
                      </a>
                      
                  </div>
                </div>
         </div>
          `
          $("#screen-chat").prepend(rightSideData);
          //Step04 : call function change Screen chat
          changeScreenChat();

          //step05 : handle image modal
          let imageModalData = `
          <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Hình ảnh trong cuộc trò chuyện</h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;">
                       
                      </div>
                  </div>
              </div>
            </div>
          </div>
          `
          $("body").prepend(imageModalData);

          //Step06 : call function gridPhoto
          gridPhotos(5);

          //Step07 : handle file modal
          let attachmentModalData = `
          <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Tệp đính kèm trong cuộc trò chuyện</h4>
                  </div>
                  <div class="modal-body">
                      <ul class="list-attachments">
                        
                      </ul>
                  </div>
                </div>
              </div>
            </div>
          `

          $("body").prepend(attachmentModalData);


          //Step08 : check status
          socket.emit("check-status");

          
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

      //Step01 : hide modal : nothing to code

      //Step02 : handle leftSide.ejs

      let subUserName = user.username;
      if(subUserName.length > 18){
        subUserName = subUserName.substr(0,15) + "..." ;
      }
      let leftSideData = `
      <a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
                
      <li class="person" data-chat="${user.id}"  title="${user.username}">
          <div class="left-avatar">
              <div class="dot"></div>
              <img src="images/users/${user.avatar}" title="${user.username}" >
          </div>
          <span class="name">
            ${subUserName}
          </span>
          <span class="time"> 
                
          </span>
          <span class="preview convert-emoji">
            
          </span>
        </li>
      </a>
      `;

      $("#all-chat").find("ul.people").prepend(leftSideData);
      $("#user-chat").find("ul.people").prepend(leftSideData);

      //Step03 : handle RightSide.ejs
      let rightSideData = `
      <div class="right tab-pane" data-chat="${user.id}" id="to_${user.id}">
      <div class="top">
              <span>To: <span class="name">${user.username}</span></span>
              <span class="chat-menu-right">
                  <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
      </div>
      <div class="content-chat">
              <div class="chat convert-emoji"  data-chat="${user.id}">
                  
              </div>
          </div>
          <div class="write" data-chat="${user.id}">
              <input type="text" class="write-chat" id="write-chat-${user.id}" data-chat="${user.id}">
              <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${user.id}" class="label-image-chat">
                      <input type="file" id="image-chat-${user.id}" name="my-image-chat" class="image-chat" data-chat="${user.id}">
                      <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachment-chat-${user.id}" class="label-attachment-chat">
                      <input type="file" id="attachment-chat-${user.id}" name="my-attachment-chat" class="attachment-chat" data-chat="${user.id}">
                      <i class="fa fa-paperclip"></i>
                  </label>
                  <a href="javascript:void(0)" id="video-chat-${user.id}" class="video-chat" data-chat="${user.id}" >
                      <i class="fa fa-video-camera"></i>
                  </a>
                  
              </div>
            </div>
    </div>
      `
      $("#screen-chat").prepend(rightSideData);
      //Step04 : call function change Screen chat
      changeScreenChat();

      //step05 : handle image modal
      let imageModalData = `
      <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Hình ảnh trong cuộc trò chuyện</h4>
              </div>
              <div class="modal-body">
                  <div class="all-images" style="visibility: hidden;">
                  
                  </div>
              </div>
          </div>
        </div>
      </div>
      `
      $("body").prepend(imageModalData);

      //Step06 : call function gridPhoto
      gridPhotos(5);

      //Step07 : handle file modal
      let attachmentModalData = `
      <div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Tệp đính kèm trong cuộc trò chuyện</h4>
              </div>
              <div class="modal-body">
                  <ul class="list-attachments">
                    
                  </ul>
              </div>
            </div>
          </div>
        </div>
    `

    $("body").prepend(attachmentModalData);

    socket.emit("check-status");

    $("#contacts").find("ul").prepend(userInfoHTML);
    removeContact();
})

$(document).ready(function(){
  approveRequestContactReceived();
});