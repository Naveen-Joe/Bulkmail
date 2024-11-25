const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const { promises } = require("nodemailer/lib/xoauth2")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://joe:1234567890@cluster0.dpj3q.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("Connected to DB")
}).catch(function(){
    console.log("Failed to connect")
})

const credential = mongoose.model("credential",{},"bulkmail")

credential.find().then(function(data){

    const transporter = nodemailer.createTransport({
        service:"gmail",
          auth: {
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
      });

      app.post("/sendmail",function(req,res){

        var msg = req.body.msg
        var emailList = req.body.emailList
    
       
        new Promise(async function(resolve,reject){
    
             
            try{
                for(var i=0;i<emailList.length;i++)
                 {
                  
                    await transporter.sendMail(
                         {   from:"naveenvjv007@gmail.com",
                             to:emailList[i],
                             subject:"Message from Bulkmail",
                             text:msg
                         },
                     )
                     console.log("Email sent to:"+emailList[i])
                 }            
                 resolve("Success")
             }      
             catch(error)
             {
                 reject("Failed")
             }
             
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })
    })

}).catch(function(error){
    console.log(error)
})




app.listen(5000,function(){
    console.log("Server Started.......")
})
