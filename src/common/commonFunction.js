// require table alias
const { tables } = require('./tableAlias');

async function checkExistingUser(databaseConnection,email)
{
    try{
        return(
            databaseConnection(tables.userBasicDetails)
            .select('User_Id')
            .where('Eamil',email)
            .then(data=>{
                if(data.length>0)
                {
                    return "User exist.";
                }
                else{
                    return "User don't exist.";
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
        return "Something went wrong please try again."
    }
}

module.exports={
    checkExistingUser
}