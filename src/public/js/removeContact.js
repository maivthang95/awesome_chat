
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
          }
       }
      })
    })
  })
}



socket.on("response-remove-contact" , (user) => {
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
   decreaseNotificationContact("count-contacts");

   //khi làm chức năng chat thì sẽ xóa tiếp user ở phần chat
})

$(document).ready(function(){
  removeContact();
});