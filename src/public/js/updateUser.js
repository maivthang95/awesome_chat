let userAvatar = null ;
let userInfo = {} ;
let originAvatarSrc = null ;
let originUserInfo = {} ;
function updateUserInfo(){
  $("#input-change-avatar").bind("change" , function(){
    let fileData = $(this).prop("files")[0];
   
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
    let username = $(this).val() ; 
    let regexUsername = new RegExp("[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$")
    if(!regexUsername.test(username) || username.length <3 || username.length > 20){
      alertify.notify("Username co do dai trong hoang 3 den 20 ky tu va khong chua ky tu dac biet" , "error" , 5);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false ;
    }
    userInfo.username = username ;
  })
  $("#input-change-gender-male").bind("click" , function(){
    let gender = $(this).val();
    if(gender !== "male"){
      alertify.notify("gioi tinh male da bi thay doi" , "error" , 5);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false ;
    }
    userInfo.gender = gender; 
  })
  $("#input-change-gender-female").bind("click" , function(){
    let gender = $(this).val();
    if(gender !== "female"){
      alertify.notify("gioi tinh female da bi thay doi" , "error" , 5);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false ;
    }
    userInfo.gender = gender; 
  })

  $("#input-change-address").bind("change" , function(){
    let address = $(this).val();
    if(address.length >= 50 ){
      alertify.notify("Dia chi qua dai vui long rut ngan lai" , "error" , 5) ;
      $(this).val(originUserInfo.address) ; 
      delete userInfo.address  ;
      return false ;
    }
    userInfo.address = address; 
  })

  $("#input-change-phone").bind("change" , function(){
    let phone = $(this).val() ; 
    let regExPhone = new RegExp("^(0)[0-9]{9,10}$");
    if(!regExPhone.test(phone)){
      alertify.notify("So dien thoai bat dau bang 0 va gioi han trong khoang 10 den 11 ky tu") ;
      $(this).val(originUserInfo.phone) ;
      delete userInfo.phone ;
      return false ;
    }
    userInfo.phone = phone ;
  })

}

function callUpdateUserAvatar(){
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
  });
}

function callUpdateUserInfo(){
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function (result) {
      console.log(result);
      $(".user-modal-alert-success").find("span").text(result.message)
      $(".user-modal-alert-success").css("display" , "block");
    
      //update Origin userinfo 
      originUserInfo = Object.assign(originUserInfo , userInfo )

    //update Username at navbar
    console.log(originUserInfo);
    $("#navbar-username").text(originUserInfo.username);
      $("#input-btn-cancel-update-user").click();

      $
    },
    error : function(error){
      //Display error
      console.log(error);
      $(".user-modal-alert-error").find("span").text(error.responseText)
      $(".user-modal-alert-error").css("display" , "block");
      //reset all
      $("#input-btn-cancel-update-user").click();
    }
  });
}

$(document).ready(function(){
  
  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username : $("#input-change-username").val(), 
    gender : ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address : $("#input-change-address").val() ,
    phone : $("#input-change-phone").val()
  }

  updateUserInfo() ;
  console.log(originUserInfo)

  $("#input-btn-update-user").bind("click" , function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Ban can thay doi thong tin truoc khi cap nhat du lieu" , "error" , 7);
      return false ;
    }
    // console.log(userAvatar);
    // console.log(userInfo);
    if(userAvatar){
      callUpdateUserAvatar();
    }
    if(!($.isEmptyObject(userInfo))){
      callUpdateUserInfo()
    }
  })

  $("#input-btn-cancel-update-user").bind("click" , function(){
    userAvatar = null  ;
    userInfo = {};
    $("#user-modal-avatar").attr("src" ,originAvatarSrc);
    $("#input-change-avatar").val(null);

    $("#input-change-username").val(originUserInfo.username) ; 
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone)

  })
})
