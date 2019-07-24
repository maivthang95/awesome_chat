import NotificationModel from "./../models/notificationModel"
import userModel from "./../models/userModel"
const LIMIT_NUMBER_TAKEN = 2;
/**
 * Get notification when f5 page
 * @param {String} currentUserId 
 */



let getNotifications = (currentUserId ) =>{
  return new Promise( async (resolve , reject ) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId , LIMIT_NUMBER_TAKEN);
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
      let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error)
    }
  })
}
/**
 * 
 * @param {String} cuurentUserId 
 * @param {Number} skipNumberNotification 
 */
let readMore = ( currentUserId , skipNumberNotification) => {
  return new Promise (async (resolve , reject ) =>{
    try {
      let newNotifications = await NotificationModel.model.readMore(currentUserId , skipNumberNotification , LIMIT_NUMBER_TAKEN )
      let getNotifyContents = newNotifications.map( async (notification) => {
        let sender = await userModel.findUserById(notification.senderId);
        return NotificationModel.content.getContent(notification.type ,  notification.isRead , sender._id , sender.username , sender.avatar);
      })
      resolve(await Promise.all(getNotifyContents));
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {
  getNotifications : getNotifications ,
  accountNotifUnread : accountNotifUnread,
  readMore : readMore
}