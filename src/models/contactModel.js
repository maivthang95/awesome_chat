import mongoose from "mongoose" ; 
import { user } from "../services";

let Schema = mongoose.Schema ;

let contactSchema = new Schema({
  userId : String , 
  contactId : String ,
  status : {type : Boolean , default : false },
  createdAt : {type : Number , default : Date.now } , 
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
  removeRequestContactSent(userId , contactId ){
    return this.remove({
      $and :[
        {"userId" : userId} ,
        {"contactId" : contactId} ,
        { "status" : false}
      ]
    }).exec() ;
  },/**
   * Get contact by userId and Limit
   * @param {String} userId 
   * @param {number} limit 
   */
  getContacts(userId , limit){
    return this.find({
      $and : [
         {$or : [
           {"userId" : userId} , 
           {"contactId" : userId}
         ]} , 
         {"status" : true}
      ]}
    ).sort({"updatedAt" : -1}).limit(limit).exec();
  },
  getContactsSent(userId , limit){
    return this.find({
      $and : [
         {"userId" : userId} , 
         {"status" : false}
      ]}
    ).sort({"createdAt" : -1}).limit(limit).exec();
  },
  getContactsReceived(userId ,limit){
    return this.find({
      $and : [
         {"contactId" : userId} , 
         {"status" : false}
      ]}
    ).sort({"createdAt" : -1}).limit(limit).exec();
  },/**
   * Count all contacts
   * @param {string} userId 
   */
  countAllContacts(userId){
    return this.count({
      $and : [
        { $or : [
          {"userId" : userId} ,
          {"contactId" : userId}
        ]},
        {"status" : true}
      ]
    }).exec();
  },/**
   * count all contact sent
   * @param {string} userId 
   */
  countAllContactsSent(userId){
    return this.count({
      $and : [
        {"userId" : userId} , 
        {"status" : false}
      ]
    }).exec();
  },/**
   * count all contact received
   * @param {string} userId 
   */
  countAllContactsReceived(userId){
    return this.count({
      $and : [
        {"contactId" : userId} , 
        {"status" : false}
      ]
    }).exec()
  },
  /**
   * get more contact users with limit 
   */
  readMoreContacts(userId , skipNumber , limit){
    return this.find({
      $and : [
        {$or : [
          {"userId" : userId } ,
          {"contactId" : userId}
        ]},
        {"status" : true }
      ]
    }).sort({"createdAt" : -1}).skip(skipNumber).limit(limit).exec();
  },
  readMoreContactsSent(userId , skipNumber , limit){
    return this.find({
      $and : [
        {"userId" : userId } , 
        {"status" : false} 
      ]
    }).sort({"createdAt" : -1}).skip(skipNumber).limit(limit).exec();
  },
  readMoreContactsReceived(userId , skipNumber , limit){
    return this.find({
      $and : [
        {"contactId" : userId} ,
        {"status" : false }
      ]
    }).sort({"updatedAt" : -1}).skip(skipNumber).limit(limit).exec();
  },
  removeRequestContactReceived(userId , contactId){
    return this.remove({
      $and : [
        {"userId" : contactId} , 
        {"contactId" : userId} ,
        {"status" : false }
      ]
    }).exec();
  },
  approveRequestContactReceived(userId , contactId){
    return this.update({
      $and : [
        {"userId" : contactId}  ,
        {"contactId" : userId} , 
        {"status" : false }
        ]
        },{
           "status" : true  ,
            "updatedAt" : Date.now()
       }).exec();
  },
  removeContact(userId , contactId){
    return this.remove({
      $or : [
        {$and : [
          {"userId" : userId} , 
          {"contactId" : contactId } ,
          {"status" : true }
        ]},
        {$and : [
          {"userId" : contactId} ,
          {"contactId": userId} ,
          {"status" : true}
        ]}
      ]
    }).exec();
  },
  updateWhenHasNewMessage(userId , contactId){
    return this.update({
      $or : [
        {$and : [
          {"userId" : userId} ,
          {"contactId" : contactId} 
        ]},
        {$and: [
          {"userId" : contactId} ,
          {"contactId" : userId} 
        ]}
      ]
    }, {"updatedAt" : Date.now()}).exec();
  },
  getContactsList(userId){
    return this.find({
     $or : [
       {$and : [
         {"userId" : userId} ,
         {"status" : true } 
       ]},
       {$and : [
         {"contactId" : userId} , 
         {"status" : true }
       ]}
     ]
    }).exec();
  }
}

module.exports = mongoose.model("contact" , contactSchema)
