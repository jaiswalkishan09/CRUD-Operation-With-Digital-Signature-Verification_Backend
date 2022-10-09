// function to get databse connection
async function getDataBaseConnection()
{
  return{
    connection:{
      client: 'mysql',
      connection: {
        host : 'sql6.freesqldatabase.com',
        user : 'sql6525042',
        password : 'bkgcc7v1LK',
        database : 'sql6525042'
      },
      pool: { min: 0, max: 10 },
      acquireConnectionTimeout: 10000
    }
  }
}


module.exports={getDataBaseConnection}