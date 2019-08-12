import {contact} from "./../services/index";
import {validationResult  } from "express-validator/check";
import { message } from ".";
import {promisify} from "util"
import ejs from "ejs" ; 
import {bufferToBase64 , lastItemOfArray , convertTimeStampToHumanTime} from "./../helpers/clientHelper"
const renderFile = promisify(ejs.renderFile).bind(ejs);
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
let approveRequestContactReceived = async (req ,res) => {
  try {
    let currentId = req.user._id  ;
    let contactId = req.body.uid ; 
  
    let approveContact = await contact.approveRequestContactReceived(currentId , contactId) ;
    
    return res.status(200).send({success : !!approveContact});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let removeContact = async (req ,res) => {
  try {
    let currentUserId = req.user._id  ;
    let contacId = req.body.uid ; 
    let resultRemoveContact = await contact.removeContact(currentUserId , contacId) ;
    return res.status(200).send({success : !!resultRemoveContact});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let searchFriends = async ( req , res ) => {
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
    let keyword = req.params.keyword ;
    let friends = await contact.seachFriends(req.user._id , keyword ); 
    return res.render("main/groupChat/sessions/_searchFriends" , {users : friends});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let findUserContactAtNavbar = async (req , res) => {
  try {
    let keyword = req.params.keyword ;
     let newMessages = await contact.findUserContactAtNavbar(req.user._id , keyword); 

    return res.status(200).send({newMessages : newMessages})
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
  removeRequestContactReceived : removeRequestContactReceived,
  approveRequestContactReceived : approveRequestContactReceived,
  removeContact : removeContact,
  searchFriends : searchFriends,
  findUserContactAtNavbar : findUserContactAtNavbar
}