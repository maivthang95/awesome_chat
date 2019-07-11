import express from "express";
import connectDB from "./config/connectDB";
import contactModel from "./models/contact.model";
let app = express() ;

connectDB();

app.get("/contact", async (req , res) => {
  try {
    let item = {
      userId : "328193793", 
      contactId : "a23781291"
    }
    
  let contact = await contactModel.createNew(item) ;
  res.send(contact)
 
  } catch (error) {
    console.log(error);
  }
})

app.listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST }`));

