function findMembersInGroupChat() {
    $(".number-members").off("click").on("click", function() {
        let href = $(this).attr("href");
        let targetGroupId = href.split("_")[1];
        $(`${href}`).modal("show");
        $.get(`/group-chat/get-members-in-group?targetGroupId=${targetGroupId}`, function(data) {
            $("body").prepend(data);
            $(`${href}`).modal("show");
            chatWithMemberInGroup(href);
            makeContactWithMemberInGroup();
        })

    })
}

$(document).ready(function() {
    findMembersInGroupChat();
});