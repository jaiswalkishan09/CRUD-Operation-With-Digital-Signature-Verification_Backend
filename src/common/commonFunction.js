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

module.exports={
    checkExistingUser,
    insertIntoTable,
    getUserDetailsBasedOnEmail
}