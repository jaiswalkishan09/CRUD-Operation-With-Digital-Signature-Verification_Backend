// function to get databse connection
async function getDataBaseConnection()
{
  return{
    connection:{
      client: 'mysql',
      connection: {
        host : process.env.MYSQL_HOST,
        user : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASSWORD,
        database : process.env.MYSQL_DATABASE
      },
      pool: { min: 0, max: 10 },
      acquireConnectionTimeout: 10000
    }
  }
}


module.exports={getDataBaseConnection}