import {notification} from "./../services/index"
let getHome = async (req , res) => {
  //only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);
  //get amount notifications unread
  let accountNotifUnread = await notification.accountNotifUnread(req.user._id);
   res.render("main/home/home" , {
    errors : req.flash("errors"),
    success : req.flash("success"),
    user : req.user  ,
    notifications : notifications ,
    accountNotifUnread : accountNotifUnread
  }); 
}

module.exports = {
  getHome : getHome
}
