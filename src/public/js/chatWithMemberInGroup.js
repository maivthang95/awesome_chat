function chatWithMemberInGroup() {
    $(".member-talk").off("click").on("click", function() {
        let targetId = $(this).data("uid");
        let groupId = $(this).data("group-uid");

        $.get(`/message/chat-with-friend-from-contact-list?targetId=${targetId}`, function(data) {
            //Close modal members in group
            $(`a[href='#uid_${targetId}']`).remove();
            $(`#screen-chat`).find(`#to_${targetId}`).remove();
            $(`#imagesModal_${targetId}`).remove();
            $(`attachmentModal_${targetId}`).remove();
            
            $(`#groupChatModalAtRightSide_${groupId}`).modal("hide");
            //handle LeftSide 
            $("#all-chat").find("ul.people").prepend(data.leftSidePersonalData);
            $("#user-chat").find("ul.people").prepend(data.leftSidePersonalData);

            //call function change screen chat
            changeScreenChat();
            //handle rightSide.ejs
            $("#screen-chat").prepend(data.rightSidePersonalData);
            //niceScroll Right
            //convert Emoji text
            convertEmoji();
            //handle Image Modal 
            $("body").prepend(data.imagePersonalModalData);
            gridPhotos(5);
            //handle Attachment Modal
            $("body").prepend(data.attachmentModalData);

            socket.emit("check-status");
            
            readMoreMessages();
            $(".person").removeClass("active");

            $(`.person[data-chat = ${targetId}]`).addClass("active");
            $(`a[href='#uid_${targetId}']`).tab("show");

            //call function to resize nice scroll Left
            $("ul.people").find(`a[href='#uid_${targetId}']`).click();
            resizeNiceScrollLeft();

        })
    })
}

$(document).ready(function() {
    chatWithMemberInGroup();
});