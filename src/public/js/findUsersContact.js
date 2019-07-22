function callFindUsers(element){
  if(element.which == 13 || element.type == "click"){
    let keyword = $("#input-find-users-contact").val();
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
      url: `/contact/find-users/${keyword}`,
      success: function (data) {
        $("#find-user ul").html(data);
        addContact();
        removeRequestContact();
      }
    });
  }
}


$(document).ready(function () {
  $("#input-find-users-contact").bind("keypress" , callFindUsers)
  $("#btn-find-users-contact").bind("click", callFindUsers );
});