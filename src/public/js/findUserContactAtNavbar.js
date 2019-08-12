let listUserOnline = "";
socket.on("server-send-list-users-online" , listUserId =>{
  listUserOnline = listUserId;
})
function findUserContactAtNavbar(){
  $(".searchBox").on("keyup" , function(element){  
    // if(element.which == 13){     
      let searchValue = $(this).val();
   
      socket.emit("check-status");
      $.get(`/contact/find-user-contact-at-navbar/${searchValue}` , function(data){
        $(`div.search_content`).find("ul").html("");
        if(!data.newMessages.length){
          alertify.notify("Không tìm thấy kết quả tìm kiếm" , "error" , 5) ;
          return false ;
        }
        
        data.newMessages.forEach ( user => {
          let checkStatus = false;
          listUserOnline.forEach( userId => {
            if(userId == user._id){
              checkStatus = true ;
            }
          })
          
          let userListInfo = `
              <li data-uid="${user._id}">
                <div class="left-search-content "> 
                  <div class="dot-search-content ${ (checkStatus==true) ? "online" : ""}"></div>
                  <img src="images/users/${user.avatar}" class="${(checkStatus == true ) ? "avatar-online" : ""}">
                </div>
                <span class="user-name">${user.username}</span>
              </li>    
          `;
        
          $(`div.search_content`).find("ul").append(userListInfo);

        })

        $("div.search_content").find(`li`).on("click" , function(){
          let targetId=  $(this).data("uid");
          $("#search-results").fadeOut("slow" , "linear");

          $.get(`/message/chat-with-friend-from-contact-list?targetId=${targetId}` , function(data){
            $(`a[href = '#uid_${targetId}']`).remove() ; 
            $("#screen-chat").find(`#to_${targetId}`).remove() ; 
            $(`#imagesModal_${targetId}`).remove();
            $(`#attachmentModal_${targetId}`).remove();
            
            //prepend in first item at leftSide of all chat and user chat
            $("#all-chat").find("ul.people").prepend(data.leftSidePersonalData);
            $("#user-chat").find("ul.people").prepend(data.leftSidePersonalData);
            //resize nice sroll left
            resizeNiceScrollLeft();
            //call function changeScreen chat
            changeScreenChat();
            //handle rightSide 
            $("#screen-chat").prepend(data.rightSidePersonalData) ; 
            //convert emoji text
            convertEmoji();
            //handle Image Modal
            $("body").prepend(data.imagePersonalModalData);
            gridPhotos(5);
            //handle Attachment Modal
            $("body").prepend(data.attachmentModalData);

            socket.emit("check-status");

            $("ul.people").find("a")[0].click();
            readMoreMessages();
            
          })
        })

      })
    //}
  })
}



$(document).ready(function () {
  findUserContactAtNavbar();
  $("#search-results").hide();
});