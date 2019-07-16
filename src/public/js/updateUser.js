let userAvatar = null ;
let userInfo = {} ;
let originAvatarSrc = null ;

function updateUserInfo(){
  $("#input-change-avatar").bind("change" , function(){
    let fileData = $(this).prop("files")[0];
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    let match = ["image/png" , "image/jpg" , "image/jpeg"] ; 
    let limit = 1048576 ; //1 MG = .. bytes 

    // if($.inArray(fileData.type , math) === -1 ) {
    //   alertify.notify("Kieu file khong hop le, chi chap nhan jpg,jpeg,png" ,"error" , 7);
    //   $(this).val(null);
    //   return false ;
    // }

    // if(fileData.size > limit){
    //   alertify.notify("Anh upload toi da chi duoc 1MB " , "error" , 7);
    //   $(this).val(null) ;
    //   return false ;
    // }

    if(typeof (FileReader) != "undefined"){
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();
      let fileReader = new FileReader();
      fileReader.onload = function(element){
        $("<img>" , {
          "src" : element.target.result , 
          "class" : "avatar img-circle" ,
          "id" : "user-modal-avatar" ,
          "alt" : "avatar"
        }).appendTo(imagePreview);
      }
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

       let formData = new FormData();
       formData.append("avatar" , fileData);

      userAvatar = formData ; 
    }else{
      alertify.notify("Trinh duyet cua ban khong ho tro File Reader" , "error" , 7);
    }
  })

  $("#input-change-username").bind("change" , function(){
    userInfo.username = $(this).val() ;
  })
  $("#input-change-gender-male").bind("click" , function(){
    userInfo.gender = $(this).val();
  })
  $("#input-change-gender-female").bind("click" , function(){
    userInfo.gender = $(this).val();
  })

  $("#input-change-address").bind("change" , function(){
    userInfo.address = $(this).val();
  })

  $("#input-change-phone").bind("change" , function(){
    userInfo.phone = $(this).val();
  })

}

$(document).ready(function(){
  updateUserInfo() ;

  $("#input-btn-update-user").bind("click" , function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Ban can thay doi thong tin truoc khi cap nhat du lieu" , "error" , 7);
      return false ;
    }
    // console.log(userAvatar);
    // console.log(userInfo);
    $.ajax({
      url : "/user/update-avatar" , 
      type : "put" , 
      cache : false , 
      contentType : false , 
      processData : false , 
      data : userAvatar , 
      success : function(result){
        //Display success
        console.log(result);
        $(".user-modal-alert-success").find("span").text(result.message)
        $(".user-modal-alert-success").css("display" , "block");
        //update navbar avatar
        $("#navbar-avatar").attr("src" , result.imageSrc);
       
        //update origin avatar
        originAvatarSrc = result.imageSrc;

        $("#input-btn-cancel-update-user").click();
        
      },
      error : function(error){
        //Display error
        $(".user-modal-alert-error").find("span").text(error.responseText)
        $(".user-modal-alert-error").css("display" , "block");
        //reset all
        $("#input-btn-cancel-update-user").click();
      }
    })
  })

  $("#input-btn-cancel-update-user").bind("click" , function(){
    userAvatar = null  ;
    userInfo = null ;
    $("#user-modal-avatar").attr("src" ,originAvatarSrc);
    $("#input-change-avatar").val(null);
  })
  
})
