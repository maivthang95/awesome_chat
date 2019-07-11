import mongoose from "mongoose" 
let Schema = mongoose.Schema; 

let chatGroupSchema = new Schema({
  name : String , 
  userAmount : Number , 
  messagesAmount : {type : Number , min : 3 , max : 99} ,
  userId : String , 
  members : [
    {userId : String }
  ],
  createdAt : {type : Number , default : Date.now() } , 
  updatedAt : {type : Number , default : null } ,
  deletedAt : {type : Number , default : null}
})

module.exports = mongoose.model("chat-group" , chatGroupSchema)
