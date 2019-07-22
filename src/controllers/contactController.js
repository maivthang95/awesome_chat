import {contact} from "./../services/index";
import {validationResult  } from "express-validator/check"
let findUserContact =  async(req , res) => {
  let errorArr = [] ; 


  let validationError = validationResult(req);
  if(!validationError.isEmpty()){
    let errors = Object.values(validationError.mapped()) ;
    errors.forEach( item => {
      errorArr.push(item.msg);
    })
    // console.log(errorArr);
    return res.status(500).send(errorArr)
  }
  try {
    let currenUserId = req.user._id ; 
    let keyword = req.params.keyword ; 
    let users = await contact.findUserContact(currenUserId , keyword);
    return res.render("main/contact/sessions/_findUserAddContact" , {users})
  } catch (error) {
    return res.status(500).send(error);
  }
}

let addNew = async (req , res) => {
  try {
    let currentUserId = req.user._id;  ;
    let contactId = req.body.uid ; 
    let newContact = await contact.addNew(currentUserId , contactId) ;
    return res.status(200).send({success : !!newContact})
  } catch (error) {
    return res.status(500).send(error);
  }
}
let removeRequestContact = async(req ,res) => {
  try {
    let currentId = req.user._id  ;
    let contactId = req.body.uid ; 
    console.log(contactId);
    let removeContact = await contact.removeRequestContact(currentId , contactId) ;
    return res.status(200).send({success : !!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
}
module.exports = {
  findUserContact : findUserContact,
  addNew : addNew,
  removeRequestContact : removeRequestContact
}