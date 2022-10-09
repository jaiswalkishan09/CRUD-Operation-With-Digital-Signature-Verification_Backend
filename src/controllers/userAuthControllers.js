const moment = require('moment');
// require knex for database connection
var knex = require('knex');

const { tables } = require('../common/tableAlias');
const {updateIntoTable,getUserDetailsBasedOnUserId,verifySignature} =require('../common/commonFunction');
const {  firstLastNameValidation, numberValidation } = require('../common/commonValidator');
const dbConnection=require("../common/connection")

const getUserDetails=async (req,res)=>{
    let connectDb= await dbConnection.getDataBaseConnection();
    const databaseConnection  =knex(connectDb.connection);
    try{
        let userId=req.userId;
        return(
            databaseConnection(tables.userBasicDetails)
            .select("First_Name as firstName","Last_Name as lastName","Email as email","Mobile_No as mobileNo")
            .where('User_Id',userId)
            .then(data=>{
                if(data.length>0)
                {
                    data=data[0];
                }
                console.log(data)
                databaseConnection?databaseConnection.destroy():null;
                return res.status(200).json({userId:userId,firstName:data.firstName,lastName:data.lastName,email:data.email,mobileNo:data.mobileNo});
            })
            .catch(e=>{
                throw(e);
            })
        )
    }
    catch(e)
    {
        databaseConnection?databaseConnection.destroy():null;
        console.log("Error in getUserDetails main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

const updateUserDetails = async(req,res)=>{
    const{firstName,lastName,mobileNo}=req.body;
    let userId=req.userId;
    let connectDb= await dbConnection.getDataBaseConnection();
    const databaseConnection  =knex(connectDb.connection);
    try{
        if(!firstName || !firstLastNameValidation(firstName))
        {
            return res.status(400).json({message:"Please provide valid first name."})
        }
        if(!lastName || !firstLastNameValidation(lastName))
        {
            return res.status(400).json({message:"Please provide valid last name."})
        }
        if(!mobileNo || !numberValidation(mobileNo))
        {
            return res.status(400).json({message:"Please provide valid mobile No."})
        }

        let data={
            First_Name:firstName,
            Last_Name:lastName,
            Mobile_No:mobileNo,
            Updated_On:moment.utc().format("YYYY-MM-DD"),
            Updated_By:userId
        }
        console.log(data)
        let updateResponse=await updateIntoTable(databaseConnection,data,tables.userBasicDetails,userId);
        if(updateResponse)
        {
            databaseConnection?databaseConnection.destroy():null;
            return res.status(200).json({userId:userId,firstName:firstName,lastName:lastName,mobileNo:mobileNo});
        }
        else{
            throw("Error while updating into the table");
        }

    }
    catch(e)
    {
        databaseConnection?databaseConnection.destroy():null;
        console.log("Error in updateUserDetails main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

const deleteUser=async(req,res)=>{
    let connectDb= await dbConnection.getDataBaseConnection();
    const databaseConnection  =knex(connectDb.connection);
    const userId=req.userId;
    try{
        return(
            databaseConnection(tables.userBasicDetails)
            .del()
            .where('User_Id',userId)
            .then(data=>{
                databaseConnection?databaseConnection.destroy():null;
                return res.status(200).json({message:"User deleted successfully."})
            })
            .catch(e=>{
                throw(e);
            })
        )
    }
    catch(e)
    {
        databaseConnection?databaseConnection.destroy():null;
        console.log("Error in deleteUser main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}


const verifyMessage=async(req,res)=>{
    let connectDb= await dbConnection.getDataBaseConnection();
    const databaseConnection  =knex(connectDb.connection);
    let signature=req.headers.signature;
    let {message}=req.body;
    let userId=req.userId;
    try{
        let userDetails=await getUserDetailsBasedOnUserId(databaseConnection,userId);
        if(!userDetails)
        {
            throw("Error while getting the user details")
        }
        let publicKey=userDetails['Public_Key'];
        let signResult=await verifySignature(signature,message,publicKey);
        databaseConnection?databaseConnection.destroy():null;
        if(signResult=="Success")
        {
            return res.status(200).json({message:"Orignal Message"})
        }
        else if(signResult=="Failed")
        {
            return res.status(400).json({message:"Message was changed"});
        }
        else{
            throw("Error Occurred while verifying signature")
        }
    }
    catch(e)
    {
        databaseConnection?databaseConnection.destroy():null;
        console.log("Error in verifyMessage main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

module.exports={getUserDetails,updateUserDetails,deleteUser,verifyMessage}
