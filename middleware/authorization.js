const jwt = require("jsonwebtoken");
require('dotenv').config();
const {SECRET_KEY} = process.env;
const AsyncHandler = require ("express-async-handler");
const User = require("../models/user");

const auth = AsyncHandler(
    async(req,res,next)=>{
        console.log("In auth")
        let token 
        console.log("Bearer " + req.headers.authorization)

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
           
            try {
               token=req.headers.authorization.split(' ')[1]
               const userVerify = jwt.verify(token,SECRET_KEY)
               req.user = await User.findById(userVerify.id).select('-password')
               console.log("Going out from auth")
               next()
            } catch (error) {
                res.send("Token Failed")
            }

        }
        if(!token){
            res.status(401)
            throw new Error("Un authorized, No Token")
        }
    }
)

module.exports = auth