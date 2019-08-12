function makeContactWithMemberInGroup() {
    $(".member-request-contact-sent").off("click").on("click", function() {
        let targetId = $(this).data("uid");
        $(`.member-cancel-contact-sent[data-uid = ${targetId}]`).css("display", "inline-block");
        $(this).hide();
        // $.post(`/group-chat/make-contact-with-member-in-group-chat?targetId=${targetId}`, function(data) {
        //     console.log(data);
        // })
    })
}

$(document).ready(function() {
    makeContactWithMemberInGroup();
});