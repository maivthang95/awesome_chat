

/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */

const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}
function resizeNiceScrollLeft(){
  $(".left").getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).attr("tabindex", "0").scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}
function flashMasterNotify(){
  let notify = $(".master-success-message").text();
  if(notify.length){
    alertify.notify(notify , "success" , 7)
  }
}
function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function(){
        textAndEmojiChat(divId); 
        typingOn(divId);
        
      },
      blur: function(){
        typingOff(divId);
      },
      keypress : function(){
        typingOn(divId);
      },
      focus:  function(){
        textAndEmojiChat(divId); 
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
  $(`.emojionearea-editor`).focus();
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find(".noti_contact_counter").fadeOut("slow");
  });
}

function configNotification() {
  $("#noti_Button").click(function() {
    $("#notifications").fadeToggle("fast", "linear");
    $(".noti_counter").fadeOut("slow");
    return false;
  });
  $(".searchBox").click(function() {
    $("#search-results").fadeIn("slow" , "linear");
  })
  $(".main-content").click(function() {
    $("#notifications").fadeOut("fast", "linear");
    $("#search-results").fadeOut("slow" , "linear");
  });
}

function gridPhotos(layoutNumber) {
  $(`.show-images`).unbind("click").on("click" , function(event){
    event.preventDefault();
    let href = $(this).attr("href");
    let modalImagesId = href.replace("#" , "");

    let originDataImage = $(`#${modalImagesId}`).find(".modal-body").html();

    let countRows = Math.ceil($(`#${modalImagesId}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`#${modalImagesId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImagesId}`).find(".all-images").css({
          "visibility": "visible",
          "max-width" : "100%" ,
          "height" : "auto"
        });
        $(`#${modalImagesId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
        $(`#${modalImagesId}`).find(".all-images img").colorbox({
          "width" : "100%"
        });
      }
    });
    $(`#${modalImagesId}`).on('hidden.bs.modal', function () {
      $(this).find("div.modal-body").html(originDataImage)
  })
  })
  
}

function changeTypeChat(){
  $("#select-type-chat").change("change" , function(){
    let optionSelected = $("option:selected" , this);
    optionSelected.tab("show");
    
    if( $(this).val() == "user-chat"){
      $(".create-group-chat").hide();
    }else 
    $(".create-group-chat").show();
  })
}



function changeScreenChat(){
  $(".room-chat").off("click").on("click" , function(){
    let divId = $(this).find("li").data("chat");
    $(".person").removeClass("active");
  
    $(`.person[data-chat = ${divId}]`).addClass("active");
    $(this).tab("show");
    
    $(".myImg").off("click").on("click" ,function(){
      let dataImgId = $(this).data("img-id");
      let getImageId = dataImgId.split("-")[1];
      $(`#myModal-${getImageId}`).css("display" , "block");
      $(`#myModal-${getImageId}`).find("img").attr("src" , $(this).attr("src"));
      $(`#caption-${getImageId}`).text($(this).attr(alt));
      
    })
    $(`.modal`).not($("img")).on("click" , function(){
     $(this).css("display" , "none");
    })
    
    //cấu hình thanh cuộn bên box chat rightSide.ejs mỗi khi click chuột vào 1 cuộc trỏ chuyện cụ thể
    nineScrollRight(divId);
    enableEmojioneArea(divId);
    
    //bật lắng nghe DOM cho việc chat tin nhắn gởi đi
    imageChat(divId);
    attachmentChat(divId);
    videoChat(divId);
  })
}

function convertEmoji(){
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    // use .shortnameToImage if only converting shortnames (for slightly better performance)
    var converted = emojione.toImage(original);
    $(this).html(converted);
});
}

function screenUserNotContact(){
  if(!$(`ul.people`).find("a").length){
    Swal.fire({
      type : "info" ,
      title : `Hiện tại bạn vẫn chưa có danh sách liên lạc, tìm kiếm cho mình bạn bè`, 
      confirmButtonColor : "#2ecc71" , 
      confirmButtonText : "Đi dến",
      showCancelButton : true,
      cancelButtonColor : "#ff7675" , 
      cancelButtonText : "Để sau" 
    }).then( (result) => {
      if(result.value){
        $("#contactsModal").modal("show");
      }
    })
  }
}
$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();
  

  // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
 

  // Icon loading khi chạy ajax
  ajaxLoading();


  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);


  //Flash message o man hinh master
  flashMasterNotify();

  //Đổi kiểu chat
  changeTypeChat();

  //Thay đổi màn hình chat
  changeScreenChat();


  //Chuyển các unicode thành icon cảm xúc
  convertEmoji();

  //Tự động click vào phần tử đầu tiên của cuộc trò chuyện khi load lại web
  if( $("ul.people").find("a").length){
    $("ul.people").find("a")[0].click();
    
  }

  
  screenUserNotContact();
  $("#video-chat-group").bind("click" , function(){
    alertify.notify("Tính năng chưa cập nhật với nhóm trò chuyện , vui lòng thử lại với trò chuyện cá nhân" , "error" , 7) 
  })
})

