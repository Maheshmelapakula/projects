const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt  = require("jsonwebtoken");



// models
const {UserModel} = require("./models/User.model")

// database 
const {connection}= require("./config/db")


const app = express();
app.use(express.json()); // for parsing application/json

app.get("",(req,res)=>{
    res.send("Welcome to the User API")
} )

app.post("/register", (req,res)=>{
    const {username,email,password,gender,bio} = req.body;

    if( !username || !email || !password) return res.status(400).send({error:"You must provide username and password"})

    try {

        bcrypt.hash(password,5,async function(err,hash){
            await UserModel.create({username, email,password:hash, gender, bio})
            return res.send({msg:"Registration Done You can logIn"})
        })
        
    } catch (error) {
        console.log(error);
        console.log("Somthing went werong, Please provide the details");
        
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send("Email not found. Please register first and then login.");
        }

        const hash = user.password;
        bcrypt.compare(password, hash, function (err, result) {
            if (result) {
                const token = jwt.sign({ userID: user._id }, "macmedia");
                return res.send({ msg: "Login Done", token: token });
            } else {
                return res.status(401).send("Login Failed");
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});




const PORT = 8090;

app.listen(PORT, async()=>{


    try {

        await connection;
        console.log( "Database connected successfully" );
        
    } catch (error) {

        console.log(error);
        console.log("Error in connectin to the databse");
        
    }
    console.log(`server is running on http://localhost:${PORT}`);
})
