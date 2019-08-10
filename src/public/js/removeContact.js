
function removeContact(){
  $(".user-remove-contact").unbind("click").on("click" , function(){
    let targetId = $(this).data("uid");
    let username = $(this).parent().find("div.user-name p").text();


    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ`,
      text: "Bạn sẽ không thể hoàn tác quá trình này!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#dff7675",
      confirmButtonText: "Đồng ý",
      cancelButtonText : "Hủy bỏ"
    }).then((result) => {
     if(!result.value){
      return false ;
     }
     $.ajax({
      type: "delete",
      url: `/contact/remove-contact`,
      data: {uid: targetId},
      success: function (data) {
        if(data.success){
          $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
          decreaseNotificationContact("count-contacts"); //js/calculateNotifyContact.js
            //khi làm chức năng chat thì sẽ xóa tiếp user ở phần chat
          socket.emit("remove-contact" , {contactId : targetId}) 

          //step0 : check Active
          let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active"); 
          //step 01: remove item in leftSide.ejs

          $("#all-chat").find(`ul a[href='#uid_${targetId}']`).remove();
          $("#user-chat").find(`ul a[href='#uid_${targetId}']`).remove();

          //step02 : remove item in rightSide.ejs
          $("#screen-chat").find(`#to_${targetId}`).remove();
          //step03 : remove image Modal
          
          $("body").find(`#imagesModal_${targetId}`).remove();

          $("body").find(`#attachmentsModal_${targetId}`).remove();

          if(checkActive){
            $("ul.people").find("a")[0].click();
          }
          }
       }
      })
    })
  })
}



socket.on("response-remove-contact" , (user) => {
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
   decreaseNotificationContact("count-contacts");
   $(`li.person[data-chat=${user.id}]`).parent().remove();
   //khi làm chức năng chat thì sẽ xóa tiếp user ở phần chat

  //Step00 : Check active 
  let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");

   //Step01
   $("#all-chat").find(`ul a[href='#uid_${user.id}']`).remove();
   $("#user-chat").find(`ul a[href='#uid_${user.id}']`).remove();

   //step02 : remove item in rightSide.ejs
   $("#screen-chat").find(`#to_${user.id}`).remove();
   //step03 : remove image Modal
   
   $("body").find(`#imagesModal_${user.id}`).remove();

   $("body").find(`#attachmentsModal_${user.id}`).remove();
   
   if(checkActive){
    $("ul.people").find("a")[0].click();
   }
 
})

$(document).ready(function(){
  removeContact();
});