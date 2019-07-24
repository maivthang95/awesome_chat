import NotificationModel from "./../models/notificationModel"
import userModel from "./../models/userModel"
import { user } from ".";
/**
 * Get notification when f5 page
 * @param {String} currentUserId 
 * @param {Number} limit 
 */
let getNotifications = (currentUserId , limit = 10) =>{
  return new Promise( async (resolve , reject ) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId , limit);
      let getNotifyContents = notifications.map( async (notification) => {
        let sender = await userModel.findUserById(notification.senderId);
        return NotificationModel.content.getContent(notification.type ,  notification.isRead , sender._id , sender.username , sender.avatar);
      }) ;
      //console.log(await Promise.all(getNotifyContents))
      resolve(await Promise.all(getNotifyContents));
    } catch (error) {
      reject(error)
    }
  })
}
/**
 * count notification 
 * @param {String} currentUserId 
 */
let accountNotifUnread = (currentUserId) => {
  return new Promise( async (resolve , reject ) => {
    try {
      let notificationsUnread = await NotificationModel.model.accountNotifUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  getNotifications : getNotifications ,
  accountNotifUnread : accountNotifUnread
}