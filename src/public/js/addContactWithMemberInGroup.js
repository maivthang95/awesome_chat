function addContactWithMemberInGroup() {
    $(".member-request-contact-sent").off("click").on("click", function() {
        let targetId =$(this).data("uid");
        $.post("/contact/add-new-contact-from-group-chat", {targetId: targetId} , function(data){
            if(data.success){
            $("div.membersList").find(`div.member-request-contact-sent[data-uid=${targetId}]`).hide();
            $("div.membersList").find(`div.member-cancel-contact-sent[data-uid=${targetId}]`).css("display" , "inline-block");
            $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
            $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).css("display" , "inline-block")
            increaseNotificationContact("count-request-contact-sent" );// js/calculateNotifyContact.js
            increaseNotification("noti_contact_counter" , 1); //js.calculateNotification.js
            // let userInfoHTML = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML ; 
            let user = data.contactInfor ;
            let userInfoHTML = `
            <li class="_contactList" data-uid="${user._id}">
                <div class="contactPanel">
                    <div class="user-avatar">
                        <img  src="/images/users/${user.avatar}" alt="${user.username}">
                    </div>
                    <div class="user-name">
                        <p>
                            ${user.username}
                        </p>
                    </div>
                    <br>
                    <div class="user-address">
                        <span>${user.address ? user.address : ""}</span>
                    </div>
                    <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${user._id}">
                        Hủy yêu cầu
                    </div>
                </div>
            </li>
            `
            
            $("#request-contact-sent").find("ul").prepend(userInfoHTML);
            
            socket.emit("add-new-contact" , {contactId : targetId});
            removeRequestContactSent();
            removeMemberRequestContactSent();
            }
        })
    })
}


$(document).ready(function() {
    addContactWithMemberInGroup();
});