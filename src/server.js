import express from "express";
let app = express() ;

let host = "localhost"; 
let port = "3000"
app.get("/", (req , res) => {
  res.send("<h2>Hello World !!</h2>");
})

app.listen(port , host , () => console.log(`Server is running on port ${port} , host : ${host}`));

