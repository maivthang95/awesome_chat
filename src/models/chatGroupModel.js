import mongoose from "mongoose" 
let Schema = mongoose.Schema; 

let chatGroupSchema = new Schema({
  name : String , 
  userAmount : Number , 
  messagesAmount : {type : Number , min : 3 , max : 199} ,
  userId : String , 
  members : [
    {userId : String }
  ],
  createdAt : {type : Number , default : Date.now } , 
  updatedAt : {type : Number , default : Date.now } ,
  deletedAt : {type : Number , default : null}
})

chatGroupSchema.statics = {
  /**
   * get chat group items by userId and Limit
   * @param {string} userId current userId
   * @param {number} limit 
   */
  getChatGroups(userId , limit){
    return this.find({
      "members" : {$elemMatch : {"userId" : userId}}
    }).sort({"updatedAt" : -1}).limit(limit).exec();
  }
}
module.exports = mongoose.model("chat-group" , chatGroupSchema)

