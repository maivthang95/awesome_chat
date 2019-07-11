import mongoose from "mongoose" ; 

let Schema = mongoose.Schema ;

let userSchema = new Schema({
  username : String , 
  gender : {type : String , default : "Male"} ,
  phone : {type : Number , default : null } ,
  address : {type : String ,  default : null } ,
  avatar : {type : String , defautl : "avatar-default.jpg"} ,
  role : {type : String , default : "user"} , 
  local : {
    email : {type : String ,  trim : true } ,
    password : String , 
    isActive : {type : Boolean , default : false } , 
    verifyToken : String 
  },
  facebook : {
    id : String , 
    token : String ,
    email : {type : String ,  trim : true }
  },
  google : {
    id : String , 
    token : String ,
    email : {type : String ,  trim : true }
  }, 
  createdAt : {type : Number , default : Date.now() } , 
  updatedAt : {type : Number , default : null } ,
  deletedAt : {type : Number , default : null}
})

module.exports = mongoose.model("user" , userSchema)
