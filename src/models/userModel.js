import mongoose from "mongoose" ; 
import bcrypt from "bcrypt";
let Schema = mongoose.Schema ;

let userSchema = new Schema({
  username : String , 
  gender : {type : String , default : "Male"} ,
  phone : {type : String , default : null } ,
  address : {type : String ,  default : null } ,
  avatar : {type : String , default : "avatar-default.jpg"} ,
  role : {type : String , default : "user"} , 
  local : {
    email : {type : String ,  trim : true } ,
    password : String , 
    isActive : {type : Boolean , default : false } , 
    verifyToken : String 
  },
  facebook : {
    uid : String , 
    token : String ,
    email : {type : String ,  trim : true }
  },
  google : {
    uid : String , 
    token : String ,
    email : {type : String ,  trim : true }
  }, 
  createdAt : {type : Number , default : Date.now() } , 
  updatedAt : {type : Number , default : null } ,
  deletedAt : {type : Number , default : null}
})

userSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findEmail(email){
    return this.findOne({"local.email" : email}).exec()
  },

  removeById(id){
    return this.findByIdAndRemove(id).exec();
  },
  
  findByToken(token){
    return this.findOne({"local.verifyToken" : token}).exec()
  },

  verify(token){
    return this.findOneAndUpdate(
      {"local.verifyToken" : token },
      {"local.isActive" : true , "local.verifyToken"  : null }
    ).exec();
  },

  findUserById(id){
    return this.findById(id).exec();
  },
  findByFacebookUid(uid){
    return this.findOne({"facebook.uid" : uid}).exec();
  },
  findByGoogleUid(uid){
    return this.findOne({"google.uid" : uid}).exec();
  },
  updateUser(id , item){
    return this.findByIdAndUpdate(id ,item).exec(); //return old item after update
  }
};

userSchema.methods = {
  ComparePassword(password){
    return bcrypt.compare(password , this.local.password);
  }
}; 

module.exports = mongoose.model("user" , userSchema)

