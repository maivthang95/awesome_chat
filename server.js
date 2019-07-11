var express = require("express");

var app = express() ;

app.get("/", (req , res) => {
    res.send("<h2>Hello World !!</h2>");
})

app.listen(3000 , () => console.log(`Server is running on port 3000`));
