const jwt = require('jsonwebtoken');

let SECRET_KEY="dahfa";
const auth=(req,res,next)=>{

    try{
        let token=req.headers.authorization;
        if(token){
           token= token.split(" ")[1];
           let user= jwt.verify(token,SECRET_KEY);
           req.userId = user.userId;
        }
        else{
           res.status(401).json({message:"Unauthorized User"})
        }
        next();
    }
    catch(e)
    {
        console.log("Error in auth main catch block",e);
        res.status(401).json({message:"Unauthorized User"})
    }
}

module.exports=auth;