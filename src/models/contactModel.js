import mongoose from "mongoose" ; 

let Schema = mongoose.Schema ;

let contactSchema = new Schema({
  userId : String , 
  contactId : String ,
  status : {type : Boolean , default : false },
  createdAt : {type : Number , default : Date.now() } , 
  updatedAt : {type : Number , default : null } ,
  deletedAt : {type : Number , default : null}
})

contactSchema.statics = {
  createNew(item){
    return this.create(item);
  },/**
   * Find all item that related with user
   * @param {string} userId 
   */
  findAllByUsers(userId){
    return this.find({
      $or : [
        {"userId" : userId }, 
        {"contactId" : userId}
      ]
    })
  },/**
   * Check exists of 2 users
   * @param {String} userId 
   * @param {String} contactId 
   */
  checkExists(userId , contactId){
    return this.findOne({
      $or : [
        { $and : [
          {"userId" : userId } ,
          {"contactId" : contactId}
        ]},
        {$and : [
          {"userId" : contactId } ,
          {"contactId" : userId}
        ]}
      ]
    }).exec()
  },/**
   * Remove request contact
   * @param {String} userId 
   * @param {String} contactId 
   */
  removeRequestContact(userId , contactId ){
    return this.remove({
      $and :[
        {"userId" : userId} ,
        {"contactId" : contactId}
      ]
    }).exec() ;
  }
}

module.exports = mongoose.model("contact" , contactSchema)
