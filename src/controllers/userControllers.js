// require moment-timezone
const moment = require('moment');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
// require knex for database connection
var knex = require('knex');

const {checkExistingUser,insertIntoTable,getUserDetailsBasedOnEmail,generatePublicAndPrivateKeyUsingLibSodium,updateIntoTable} =require('../common/commonFunction');
const { emailValidation, firstLastNameValidation, numberValidation } = require('../common/commonValidator');
const { tables } = require('../common/tableAlias');
const dbConnection=require("../common/connection")

let SECRET_KEY="dahfa";
const signUp=async (req,res)=>{
    const{firstName,lastName,email,mobileNo,password}=req.body;
    let connectDb= await dbConnection.getDataBaseConnection();
    const databaseConnection  =knex(connectDb.connection);
    try{
        if(!email || !emailValidation(email))
        {
            databaseConnection?databaseConnection.destroy():null;
            return res.status(400).json({message:"Please provide valid email address."})
        }
        if(!password || password.length<8)
        {
            databaseConnection?databaseConnection.destroy():null;
            return res.status(400).json({message:"Please provide valid password containing at least 8 characters."})
        }
        if(!firstName || !firstLastNameValidation(firstName))
        {
            databaseConnection?databaseConnection.destroy():null;
            return res.status(400).json({message:"Please provide valid first name."})
        }
        if(!lastName || !firstLastNameValidation(lastName))
        {
            databaseConnection?databaseConnection.destroy():null;
            return res.status(400).json({message:"Please provide valid last name."})
        }
        if(!mobileNo || !numberValidation(mobileNo))
        {
            databaseConnection?databaseConnection.destroy():null;
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
            databaseConnection?databaseConnection.destroy():null;
            return res.status(201).json({userId:userId,token:token,publicKey:publicKey,privateKey:privateKey});

        }
        else if(userExist=="User exist"){
            databaseConnection?databaseConnection.destroy():null;
            return res.status(400).json({message:"User already exist."})
        }
        else{
            databaseConnection?databaseConnection.destroy():null;
            return res.status(500).json({message:"Something went wrong please try again."});
        }
    }
    catch(e)
    {
        databaseConnection?databaseConnection.destroy():null;
        console.log("Error in signUp main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

const signIn=async(req,res)=>{
    let connectDb= await dbConnection.getDataBaseConnection();
    const databaseConnection  =knex(connectDb.connection);
    const {email,password}=req.body;
    try{
        let userDetails=await getUserDetailsBasedOnEmail(databaseConnection,email);
        if(userDetails)
        {
            if(userDetails.length==0)
            {
                databaseConnection?databaseConnection.destroy():null;
                return res.status(404).json({message:"User not found"});
            }
            else{
                userDetails=userDetails[0];
                const matchPassword=await bcrypt.compare(password,userDetails.Password);
                if(!matchPassword)
                {
                    databaseConnection?databaseConnection.destroy():null;
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
                databaseConnection?databaseConnection.destroy():null;
                return res.status(200).json({userId:userDetails.User_Id,token:token,publicKey:publicKey,privateKey:privateKey});
            }
        }
        else{
            databaseConnection?databaseConnection.destroy():null;
            return res.status(500).json({message:"Something went wrong please try again."});
        }
    }
    catch(e)
    {
        databaseConnection?databaseConnection.destroy():null;
        console.log("Error in signin main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

module.exports={signUp,signIn};