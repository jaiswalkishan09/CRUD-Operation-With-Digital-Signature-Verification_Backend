// require moment-timezone
const moment = require('moment');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const {checkExistingUser,insertIntoTable} =require('../common/commonFunction');
const { emailValidation, firstLastNameValidation, numberValidation } = require('../common/commonValidator');
const { databaseConnection } = require('../common/connection');
const { tables } = require('../common/tableAlias');


const signUp=async (req,res)=>{
    const{firstName,lastName,email,mobileNo,password}=req.body;
    try{
        console.log(moment.utc().format("YYYY-MM-DD"))
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
            let data={
                First_Name:firstName,
                Last_Name:lastName,
                Email:email,
                Mobile_No:mobileNo,
                Password:hashPassword,
                Public_Key:"12345",
                Created_On:moment.utc().format("YYYY-MM-DD")
            }
            let userId=await insertIntoTable(databaseConnection,data,tables.userBasicDetails);
            let token=jwt.sign({ userId:userId,email: email }, 'shhhhh');
            return res.status(201).json({userId:userId,token:token});

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

const signIn=(req,res)=>{

}

module.exports={signUp,signIn};