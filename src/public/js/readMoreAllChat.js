function callReadMoreAllChats() {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;
    $("#link-read-more-all-chat").css("display", "none")
    $(".read-more-all-chat-loading").css("display", "inline-block");
    //get first element to remove when add more chat
    let exceptId = $(`ul.people`).find("a:eq(0) li").data("chat");
    console.log(exceptId);
    $.get(`/messages/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}&exceptId=${exceptId}`,
        function(data) {
            if (data.leftSideData.trim() == "") {
                alertify.notify("Không còn cuộc trò chuyện nào để xem", "error", 5);
                $("#link-read-more-all-chat").css("display", "inline-block")
                $(".read-more-all-chat-loading").css("display", "none");
                return false;
            }

            chatFromContactList();
            //Step01 : handle leftSide
            $("#all-chat").find("ul").append(data.leftSideData);

            //Step02 : call scroll 
            resizeNiceScrollLeft();
            nineScrollLeft();

            //Step03 :handle rightSide 
            $("#screen-chat").append(data.rightSideData);
            convertEmoji();
            findMembersInGroupChat();
            //Step04: call function screen chat 
            changeScreenChat();

            //Step05 : handle image Modal
            $("body").append(data.imageModalData);
            gridPhotos(5);
            //Step06 : handle attachment Modal
            $("body").append(data.attachmentModalData);

            //Step07 : check status
            socket.emit("check-status");

            $("#link-read-more-all-chat").css("display", "inline-block")
            $(".read-more-all-chat-loading").css("display", "none");
            //step 08 :Call function read more messages
            readMoreMessages();

        }
    );
}

function callReadMoreUserChat() {
    let skipPersonal = $("#user-chat ul.people").find("a").length;
    $("#link-read-more-user-chat").css("display", "none");
    $(".read-more-user-chat-loading").css("display", "inline-block");
    let exceptId = $(`ul.people`).find("a:eq(0) li").data("chat");
    $.get(`/message/read-more-personal-chat?skipPersonal=${skipPersonal}&exceptId=${exceptId}`, function(data) {
        if (data.leftSidePersonalData.trim() == "") {
            alertify.notify("Bạn không còn danh sách liên lạc nào để xem", "error", 5);
            $("#link-read-more-user-chat").css("display", "none");
            $(".read-more-user-chat-loading").css("display", "inline-block");
            return false;
        }
        //step01 : handle leftSide 
        $("#user-chat").find("ul").append(data.leftSidePersonalData);
        //step02 : resize getNiceScroll on leftSide ; 
        resizeNiceScrollLeft();
        //step03 : handle rightSide 
        $("#screen-chat").append(data.rightSidePersonalData);
        findMembersInGroupChat();
        //step04 : call function changeScreenChat();
        changeScreenChat();
        //step05 : convert Emoji Chat
        convertEmoji();
        //step06 : handle Image Modal 
        $("body").append(data.imagePersonalModalData);
        gridPhotos(5);
        //step07 : handle Attachment Modal 
        $("body").append(data.attachmentModalData);

        //step08 : check-status
        socket.emit("check-status");
        $("#link-read-more-user-chat").css("display", "inline-block");
        $(".read-more-user-chat-loading").css("display", "none");

        readMoreMessages();

    })

}

function callReadMoreGroupChat() {
    let skipGroup = $("#group-chat ul.people").find("a").length;
    $("#link-read-more-group-chat").css("display", "none");
    $(".read-more-group-chat-loading").css("display", "inline-block");
    $.get(`/message/read-more-group-chat?skipGroup=${skipGroup}`, function(data) {
        if (data.leftSideGroupData.trim() == "") {
            alertify.notify("Không còn nhóm nào để xem", "error", 5);
            $("#link-read-more-group-chat").css("display", "none");
            $(".read-more-group-chat-loading").css("display", "inline-block");
            return false;
        }

        //handle leftSide 
        $("#group-chat").find("ul").append(data.leftSideGroupData);
        //call function nice scroll for leftSide 
        resizeNiceScrollLeft();
        //handle rightSide  
        $("#screen-chat").append(data.rightSideGroupData);
        //call function ChangeScreen 
        changeScreenChat();
        //convert Emojitext
        convertEmoji();
        //hanle Image Modal
        $("body").append(data.imageGroupModalData);
        gridPhotos(5);
        //handle attachment Modal 
        $("body").append(data.attachmentGroupModalData);
        //check status
        socket.emit("check-status");
        $("#link-read-more-group-chat").css("display", "inline-block");
        $(".read-more-group-chat-loading").css("display", "none");

        readMoreMessages();
        findMembersInGroupChat();

    })
}

$(document).ready(function() {
    $("#link-read-more-all-chat").off("click").bind("click", function() {
        callReadMoreAllChats();
    })
    $("#link-read-more-user-chat").off("click").bind("click", function() {
        callReadMoreUserChat();
    })
    $("#link-read-more-group-chat").off("click").bind("click", function() {
        callReadMoreGroupChat();
    })
});