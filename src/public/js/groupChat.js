function addFriendsToGroup() {
  $("ul#group-chat-friends").find("div.add-user").bind("click", function() {
    let uid = $(this).data("uid");
    $(this).remove();
    let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

    let promise = new Promise(function(resolve, reject) {
      $("ul#friends-added").append(html);
      $("#groupChatModal .list-user-added").show();
      resolve(true);
    });
    promise.then(function(success) {
      $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
    });
  });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function() {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function(index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriends(element){
  if(element.which == 13 || element.type == "click"){
    let keyword = $("#input-search-friends-to-add-group-chat").val();
    console.log(keyword);
    if(!keyword.length){
      alertify.notify("Chưa nhập nội dung tìm kiếm" , "error" ,5);
      return false ;
    }

    let regExpKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regExpKeyword.test(keyword)){
      alertify.notify("Lỗi từ khóa tìm kiếm, chỉ cho phép chữ cái và số" , "error" , 5)
    }

    // $.get(`/contact/find-users/${keyword}` , function(data) {
    //   $("#find-user ul").html(data);
    //})
    $.ajax({
      type: "get",
      url: `/contact/search-friends/${keyword}`,
      success: function (data) {
        $("#group-chat-friends").html(data);
         // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
          addFriendsToGroup();

          // Action hủy việc tạo nhóm trò chuyện
          cancelCreateGroup();
      }
    });
  }
}

function callCreateGroupChat(){
  $("#btn-create-group-chat").off("click").on("click" , function(){
    let countUsers = $("#friends-added").find("li").length; 
    if(countUsers < 2) {
      alertify.notify("để tạo nhóm ít nhất cần có 3 thành viên" , "error" , 5) ; 
      return false ;
    }
    let groupChatName = $("#input-name-group-chat").val();
    let regexChatName = new RegExp (/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
    if(!regexChatName.test(groupChatName) || groupChatName.length < 5 || groupChatName.length > 30){
      alertify.notify("Tên group chat giới hạn 5 - 30 ký tự và không chứa ký tự đặc biệt" , "error" , 5 );
      return false ;
    }
    let usersIdList = [] ;
    $("ul#friends-added").find("li").each( function(index , item ){
     usersIdList.push( {"userId" : $(item).data("uid")});
    })

    Swal.fire({
      title : `Bạn có chắc chắn muốn tạo nhóm &nbsp; ${groupChatName}?` , 
      type : "info" , 
      showCancelButton : true , 
      showConfirButton : true ,
      confirmButtonColor : "#2ECC71" , 
      confirmButtonText : "Xác nhận" , 
      cancelButtonColor : "#ff7675" , 
      cancelButtonText : "Hủy" ,
    }).then ((result) => {
      if(!result.value){
        return false ;
      }
      $.post("/group-chat/add-new" ,
        {
          usersIdList : usersIdList,
          groupChatName :groupChatName 
        } ,function(data ){
          console.log(data.groupChat)
          //Step01 :hide modal group Chat
          $("#input-name-group-chat").val("");
          $("#btn-cancel-group-chat").click(); 
          $("#groupChatModal").modal("hide");

          //Step02: add leftSide template 
          let subGroupChatName = data.groupChat.name ; 
          if(subGroupChatName.length > 18 ){
            subGroupChatName = subGroupChatName.substr(0,15) + "...";
          }
          let leftSideData = `
          <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
              <li class="person group-chat" data-chat="${data.groupChat._id}" title="${data.groupChat.name}">
                  <div class="left-avatar">
                      <img src="/images/users/${data.groupChat.avatar}" alt="">
                  </div>
                  <span class="name" >
                      <span class="group-chat-name">
                         ${subGroupChatName}
                      </span> 
                  </span>
                  <span class="time"></span>
                  <span class="preview convert-emoji"></span>
              </li>
          </a>
        `
        $(`#all-chat`).find("ul.people").prepend(leftSideData);
      
        //Step03 : handle Rightside
          
          let rightSideData = `
          <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
          <div class="top">
              <span>To: <span class="name">${data.groupChat.name}</span></span>
              <span class="chat-menu-right">
                  <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                      <span class="show-number-members"><strong>${data.groupChat.userAmount}</strong></span>
                      <i class="fa fa-users"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                      <span class="show-number-messages"><strong>${data.groupChat.messageAmount}</strong></span>
                      <i class="fa fa-comments-o"></i>
                  </a>
              </span>
          </div>
          <div class="content-chat">
              <div class="chat convert-emoji" data-chat="${data.groupChat._id}">
              </div>
          </div>
          <div class="write" data-chat="${data.groupChat._id}">
              <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
              <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${data.groupChat._id}" class="label-image-chat">
                      <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachment-chat-${data.groupChat._id}" class="label-attachment-chat">
                      <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-paperclip"></i>
                  </label>
                  <a href="javascript:void(0)" id="video-chat-group">
                      <i class="fa fa-video-camera"></i>
                  </a>
                
              </div>
          </div>
      </div>
          `
          $("#screen-chat").prepend(rightSideData);

          //Step04: call function changeScreenChat
          changeScreenChat();

          //Step05 : handle Image Modal 

          let imageModalData = `
          <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
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
        
        //Step07 : handle attachment modal
        let attachmentModalData = `
        <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
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

        //step08 : emit new group created 
        socket.emit("create-new-group" , {groupChat : data.groupChat})

        //step 09 : nothing

        //step 10 : update online
        socket.emit("check-status");

        }).fail( response => {
          alertify.notify(response.responseText , "error" , 7);
      })
    })
  })
}

$(document).ready(function () {
  $("#input-search-friends-to-add-group-chat").bind("keypress" , callSearchFriends)
  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends );

  callCreateGroupChat();

  socket.on("response-create-new-group" , response => {
    //Step01 :hide modal group Chat : nothing to code
   

    //Step02: add leftSide template 
    let subGroupChatName = response.groupChat.name ; 
    if(subGroupChatName.length > 18 ){
      subGroupChatName = subGroupChatName.substr(0,15) + "...";
    }
    let leftSideData = `
    <a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
        <li class="person group-chat" data-chat="${response.groupChat._id}" title="${response.groupChat.name}">
            <div class="left-avatar">
                <img src="/images/users/${response.groupChat.avatar}" alt="">
            </div>
            <span class="name" >
                <span class="group-chat-name">
                   ${subGroupChatName}
                </span> 
            </span>
            <span class="time"></span>
            <span class="preview convert-emoji"></span>
        </li>
    </a>
  `
  $(`#all-chat`).find("ul.people").prepend(leftSideData);

  //Step03 : handle Rightside
    
    let rightSideData = `
    <div class="right tab-pane" data-chat="${response.groupChat._id}" id="to_${response.groupChat._id}">
    <div class="top">
        <span>To: <span class="name">${response.groupChat.name}</span></span>
        <span class="chat-menu-right">
            <a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
                Tệp đính kèm
                <i class="fa fa-paperclip"></i>
            </a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
                Hình ảnh
                <i class="fa fa-photo"></i>
            </a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                <span class="show-number-members"><strong>${response.groupChat.userAmount}</strong></span>
                <i class="fa fa-users"></i>
            </a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                <span class="show-number-messages"><strong>${response.groupChat.messageAmount}</strong></span>
                <i class="fa fa-comments-o"></i>
            </a>
        </span>
    </div>
    <div class="content-chat">
        <div class="chat convert-emoji" data-chat="${response.groupChat._id}">
        </div>
    </div>
    <div class="write" data-chat="${response.groupChat._id}">
        <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
        <div class="icons">
            <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
            <label for="image-chat-${response.groupChat._id}" class="label-image-chat">
                <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
                <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${response.groupChat._id}" class="label-attachment-chat">
                <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}">
                <i class="fa fa-paperclip"></i>
            </label>
            <a href="javascript:void(0)" id="video-chat-group">
                <i class="fa fa-video-camera"></i>
            </a>
          
        </div>
    </div>
</div>
    `
    $("#screen-chat").prepend(rightSideData);

    //Step04: call function changeScreenChat
    changeScreenChat();

    //Step05 : handle Image Modal 

    let imageModalData = `
    <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
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
  
  //Step07 : handle attachment modal
  let attachmentModalData = `
  <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
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

  //step09 : 
  socket.emit("member-received-group-chat" , {groupChatId : response.groupChat._id});

  //step10 : update-online
  socket.emit("check-status");
  })
});