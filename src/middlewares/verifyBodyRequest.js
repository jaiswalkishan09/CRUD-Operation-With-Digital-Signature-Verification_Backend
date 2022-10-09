const dbConnection=require("../common/connection")
const {getUserDetailsBasedOnUserId,verifySignature}=require("../common/commonFunction")
// require knex for database connection
var knex = require('knex');

const verifyBodyRequest=async(req,res,next)=>{
    let connectDb= await dbConnection.getDataBaseConnection();
    const databaseConnection  =knex(connectDb.connection);
    let signature=req.headers.signature;
    let jsonObject=req.body;
    let message=JSON.stringify(jsonObject);
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
            next();
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

module.exports=verifyBodyRequest;