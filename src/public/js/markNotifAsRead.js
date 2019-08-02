function markNotificationsAsRead(targetUsers){
  $.ajax({
    type: "put",
    url: "/notification/mark-all-as-read",
    data: {targetUsers : targetUsers},
    success: function (result) {
      if(result){
        targetUsers.forEach( function( uid ){
          $(".noti_content").find(`div[data-uid = ${uid}]`).removeClass("notif-readed-false");
          $("ul.list-notifications").find(`li> div[data-uid = ${uid}]`).removeClass("notif-readed-false");
          
        })
        decreaseNotification("noti_counter" ,targetUsers.length )
      }
    }
  });
}

$(document).ready(function () {
  //Link at popup notification
  $("#popup-mark-notif-as-read").bind("click" , function(){
    let targetUsers = [] ; 
   $(".noti_content").find(".notif-readed-false").each( function( index , notification) {
     targetUsers.push($(notification).data("uid"));
   })
    if(!targetUsers.length){
      alertify.notify("Bạn không có thông báo nào chưa đọc." , "error" , 5)
    }
    markNotificationsAsRead(targetUsers);

  })
  //Link at modal notification
  $("#modal-mark-notif-as-read").bind("click" , function(){
    let targetUsers = [] ; 
    $("ul.list-notifications").find("li> div.notif-readed-false").each( function(index , notification){
      targetUsers.push($(notification).data("uid")) ; 
    })
    if(!targetUsers){
      alertify.notify("Bạn không có thông báo nào chưa đọc." , "error" , 5)
    }
    markNotificationsAsRead(targetUsers);
  })
});
