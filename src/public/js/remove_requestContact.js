function decreaseNotificationContact(className){
  let currentValue = +$(`.${className}`).find("em").text();
  currentValue--;
  if(currentValue===0){
    $(`.${className}`).html("");
  }else{
    $(`.${className}`).html(`(<em>${currentValue}</em>)`)
  }
}


function removeRequestContact(){
  $(".user-remove-request-contact").bind("click" , function(){
    let targetId = $(this).data("uid");
    console.log(targetId);
    $.ajax({
      type: "delete",
      url: `/contact/remove-request-contact`,
      data: {uid: targetId},
      success: function (data) {
        if(data.success){
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).show();
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css("display" , "none");
          decreaseNotificationContact("count-request-contact-sent");
        }
      }
    });
  })
}