const _sodium = require('libsodium-wrappers');

// require table alias
const { tables } = require('./tableAlias');

async function checkExistingUser(databaseConnection,email)
{
    try{
        return(
            databaseConnection(tables.userBasicDetails)
            .select('User_Id')
            .where('Email',email)
            .then(data=>{
                if(data.length>0)
                {
                    return "User exist";
                }
                else{
                    return "User don't exist";
                }
            })
            .catch(e=>{
                console.log("Error in checkExistingUser .catch block",e);
                throw(e);
            })
        )
    }
    catch(e)
    {
        console.log("Error in checkExistingUser main catch block",e);
        return "Error occurred"
    }
}


async function getUserDetailsBasedOnEmail(databaseConnection,email)
{
    try{
        return(
            databaseConnection(tables.userBasicDetails)
            .select('*')
            .where('Email',email)
            .then(data=>{
               return data;
            })
            .catch(e=>{
                console.log("Error in getUserDetailsBasedOnEmail .catch block",e);
                throw(e);
            })
        )
    }
    catch(e)
    {
        console.log("Error in getUserDetailsBasedOnEmail main catch block",e);
        return false;
    }
}

async function insertIntoTable(databaseConnection,data,tableName)
{
    try{
        return(
            databaseConnection(tableName)
            .insert(data)
            .then(userId=>{
                return userId[0];
            })
            .catch(e=>{
                throw e;
            })
        )
    }
    catch(e)
    {
        console.log("Error in insertIntoTable main catch block.",e);
        return false;
    }

}



async function generatePublicAndPrivateKeyUsingLibSodium()
{
    try{
        await _sodium.ready;
        const sodium = _sodium;
        let keyDetails=sodium.crypto_sign_keypair();
        let publicKey=keyDetails['publicKey'];
        let privateKey=keyDetails['privateKey'];

        publicKey=sodium.to_base64(publicKey);
        privateKey=sodium.to_base64(privateKey);

        return {publicKey:publicKey,privateKey:privateKey}

        //used for generating sign
        // let signature=sodium.crypto_sign_detached(m,privateKey,"uint8array",publicKey);
    }
    catch(e)
    {
        console.log("Error in generatePublicAndPrivateKeyUsingLibSodium main catch block",e);
        return false;
    }
}

async function verifySignature(signature,message,publicKey)
{
    try{
        await _sodium.ready;
        const sodium = _sodium;
        publicKey=sodium.from_base64(publicKey);
        signature=sodium.from_base64(signature);
        let signatureVerify=sodium.crypto_sign_verify_detached(signature,message,publicKey);
        if(signatureVerify)
        {
            return "Success";
        }
        return "Failed";
    }
    catch(e)
    {
        console.log("Error in verifySignature main catch block",e);
        return "Error";
    }
}

async function updateIntoTable(databaseConnection,data,tableName,userId)
{
    try{
        return(
            databaseConnection(tableName)
            .update(data)
            .where('User_Id',userId)
            .then(userId=>{
                return userId;
            })
            .catch(e=>{
                throw e;
            })
        )
    }
    catch(e)
    {
        console.log("Error in updateIntoTable main catch block.",e);
        return false;
    }

}


async function getUserDetailsBasedOnUserId(databaseConnection,userId)
{
    try{
        return(
            databaseConnection(tables.userBasicDetails)
            .select('*')
            .where('User_Id',userId)
            .then(data=>{
               return data[0];
            })
            .catch(e=>{
                console.log("Error in getUserDetailsBasedOnUserId .catch block",e);
                throw(e);
            })
        )
    }
    catch(e)
    {
        console.log("Error in getUserDetailsBasedOnUserId main catch block",e);
        return false;
    }
}

module.exports={
    checkExistingUser,
    insertIntoTable,
    getUserDetailsBasedOnEmail,
    generatePublicAndPrivateKeyUsingLibSodium,
    verifySignature,
    updateIntoTable,
    getUserDetailsBasedOnUserId
}