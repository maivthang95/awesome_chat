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

module.exports = {
  findUserContact : findUserContact
}