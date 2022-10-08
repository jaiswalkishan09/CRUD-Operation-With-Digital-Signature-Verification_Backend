// require moment-timezone
const moment = require('moment');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const {checkExistingUser,insertIntoTable,getUserDetailsBasedOnEmail,generatePublicAndPrivateKeyUsingLibSodium,updateIntoTable} =require('../common/commonFunction');
const { emailValidation, firstLastNameValidation, numberValidation } = require('../common/commonValidator');
const { databaseConnection } = require('../common/connection');
const { tables } = require('../common/tableAlias');

let SECRET_KEY="dahfa";
const signUp=async (req,res)=>{
    const{firstName,lastName,email,mobileNo,password}=req.body;
    try{
        if(!emailValidation(email))
        {
            return res.status(400).json({message:"Please provide valid email address."})
        }
        if(password.length<8)
        {
            return res.status(400).json({message:"Please provide valid password containing at least 8 characters."})
        }
        if(!firstLastNameValidation(firstName))
        {
            return res.status(400).json({message:"Please provide valid first name."})
        }
        if(!firstLastNameValidation(lastName))
        {
            return res.status(400).json({message:"Please provide valid last name."})
        }
        if(!numberValidation(mobileNo))
        {
            return res.status(400).json({message:"Please provide valid mobile No."})
        }
        let userExist=await checkExistingUser(databaseConnection,email);
    
        if(userExist=="User don't exist")
        {
            const hashPassword= await bcrypt.hash(password, 10);
            let keys=await generatePublicAndPrivateKeyUsingLibSodium();
            if(!keys)
            {
                throw("error");
            }
            const {publicKey,privateKey}=keys;
            let data={
                First_Name:firstName,
                Last_Name:lastName,
                Email:email,
                Mobile_No:mobileNo,
                Password:hashPassword,
                Public_Key:publicKey,
                Created_On:moment.utc().format("YYYY-MM-DD")
            }
            let userId=await insertIntoTable(databaseConnection,data,tables.userBasicDetails);
            let token=jwt.sign({ userId:userId,email: email }, SECRET_KEY);
            return res.status(201).json({userId:userId,token:token,publicKey:publicKey,privateKey:privateKey});

        }
        else if(userExist=="User exist"){
            return res.status(400).json({message:"User already exist."})
        }
        else{
            return res.status(500).json({message:"Something went wrong please try again."});
        }
    }
    catch(e)
    {
        console.log("Error in signUp main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

const signIn=async(req,res)=>{
    const {email,password}=req.body;
    try{
        let userDetails=await getUserDetailsBasedOnEmail(databaseConnection,email);
        if(userDetails)
        {
            if(userDetails.length==0)
            {
                return res.status(404).json({message:"User not found"});
            }
            else{
                userDetails=userDetails[0];
                const matchPassword=await bcrypt.compare(password,userDetails.Password);
                if(!matchPassword)
                {
                    return res.status(400).json({message:"Invalid Credentials"});
                }
                let keys=await generatePublicAndPrivateKeyUsingLibSodium();
                if(!keys)
                {
                    throw("error");
                }
                const {publicKey,privateKey}=keys;
                let data={"Public_Key":publicKey,Updated_On:moment.utc().format("YYYY-MM-DD"),Updated_By:userDetails.User_Id};
                let userId=await updateIntoTable(databaseConnection,data,tables.userBasicDetails,userDetails.User_Id);
                let token=jwt.sign({ userId:userDetails.User_Id,email: email }, SECRET_KEY);
                return res.status(201).json({userId:userDetails.User_Id,token:token,publicKey:publicKey,privateKey:privateKey});
            }
        }
        else{
            return res.status(500).json({message:"Something went wrong please try again."});
        }
    }
    catch(e)
    {
        console.log("Error in signin main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

module.exports={signUp,signIn};