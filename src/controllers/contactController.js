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
};

let addNew = async (req , res) => {
  try {
    let currentUserId = req.user._id;  ;
    let contactId = req.body.uid ; 
    let newContact = await contact.addNew(currentUserId , contactId) ;
    return res.status(200).send({success : !!newContact})
  } catch (error) {
    return res.status(500).send(error);
  }
};


let readMoreContacts = async (req , res) => {
  try {
    let skipNumberContacts = +req.query.skipNumber; 
    let newContactUsers = await contact.readMoreContacts(req.user._id , skipNumberContacts );
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error) ; 
  }
}


let readMoreContactsSent = async (req , res) => {
  try {
    let skipNumberContactsSent = +req.query.skipNumber ; 
    let newContactsSent = await contact.readMoreContactsSent(req.user._id , skipNumberContactsSent) ;
    return res.status(200).send(newContactsSent);
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readMoreContactsReceived = async(req ,res ) =>{
  try {
    let skipNumber = +req.query.skipNumber;
    let newContactsReceived = await contact.readMoreContactsReceived(req.user._id , skipNumber) ;
    return res.status(200).send(newContactsReceived);
  } catch (error) {
    return res.status(200).send(error);
  }
}

let removeRequestContactSent = async(req ,res) => {
  try {
    let currentId = req.user._id  ;
    let contactId = req.body.uid ; 
  
    let removeContact = await contact.removeRequestContactSent(currentId , contactId) ;
    return res.status(200).send({success : !!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactReceived = async (req ,res) => {
  try {
    let currentId = req.user._id  ;
    let contactId = req.body.uid ; 
    let removeContact = await contact.removeRequestContactReceived(currentId , contactId) ;
    return res.status(200).send({success : !!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
}
module.exports = {
  findUserContact : findUserContact,
  addNew : addNew,
  removeRequestContactSent : removeRequestContactSent,
  readMoreContacts : readMoreContacts,
  readMoreContactsSent : readMoreContactsSent,
  readMoreContactsReceived : readMoreContactsReceived,
  removeRequestContactReceived : removeRequestContactReceived
}