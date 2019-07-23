import mongoose from "mongoose" 
let Schema = mongoose.Schema; 

let notificationSchema = new Schema({
  senderId : String ,
  receiverId : String , 
  type : String , 
  isRead : {type : Boolean , default : false } ,
  createdAt : {type : Number , default : Date.now() } 
})


notificationSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  removeRequestContactNotification(senderId , receiverId ,type){
    return this.remove({
      $and : [
        {"senderId" : senderId } ,
        {"receiverId" : receiverId}, 
        {"type" : type}
      ]
    }).exec();
  },/**
   * Get by userId and Limit
   * @param {String} userId 
   * @param {Number} limit 
   */
  getByUserIdAndLimit(userId , limit){
    return this.find({"receiverId" : userId}).sort({"createdAt" : -1}).limit(limit).exec();
  }
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT : "add_contact"
}

const NOTIFICATION_CONTENT = {
  getContent : (notificationType , isRead , userId , userName , userAvatar) => {
    if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT){
      if(!isRead){
        return  `<span class="notif-readed-false" data-uid="${userId}">
                <img class="avatar-small" src="/images/users/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </span><br><br><br>`
      }
      return  `<span data-uid="${userId}">
      <img class="avatar-small" src="/images/users/${userAvatar}" alt=""> 
      <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
      </span><br><br><br>`
    }
    return "No matching with any notification type";
  }
}
module.exports ={
  model : mongoose.model("notification" , notificationSchema) ,
  types : NOTIFICATION_TYPES ,
  content : NOTIFICATION_CONTENT
}
