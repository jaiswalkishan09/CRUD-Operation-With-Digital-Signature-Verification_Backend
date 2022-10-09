const { tables } = require('../common/tableAlias');
const {updateIntoTable,getUserDetailsBasedOnUserId} =require('../common/commonFunction');
const {  firstLastNameValidation, numberValidation } = require('../common/commonValidator');

const getUserDetails=async (req,res)=>{
    const { databaseConnection } = require('../common/connection')
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
    const{userId,firstName,lastName,mobileNo}=req.body;
    const { databaseConnection } = require('../common/connection')
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
    const { databaseConnection } = require('../common/connection')
    const {userId}=req.body;
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
    const { databaseConnection } = require('../common/connection')
    let signature=req.headers.signature;
    let {message,userId}=req.body;
    try{
        let userDetails=await getUserDetailsBasedOnUserId(databaseConnection,userId);
        let publicKey=userDetails['Public_Key'];
        let signResult=await verifySignature(signature,message,publicKey);
        databaseConnection?databaseConnection.destroy():null;
        if(signResult)
        {
            return res.status(200).json({message:"Orignal Message"})
        }
        return res.status(400).json({message:"Message was changed"});
    }
    catch(e)
    {
        databaseConnection?databaseConnection.destroy():null;
        console.log("Error in verifyMessage main catch block",e);
        return res.status(500).json({message:"Something went wrong please try again."});
    }
}

module.exports={getUserDetails,updateUserDetails,deleteUser,verifyMessage}
