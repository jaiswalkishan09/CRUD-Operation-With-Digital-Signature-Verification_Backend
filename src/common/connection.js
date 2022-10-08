// require knex package
const knex = require('knex');

const databaseConnection = knex({
    client: 'mysql',
    connection: {
      host : 'sql6.freesqldatabase.com',
      user : 'sql6525042',
      password : 'bkgcc7v1LK',
      database : 'sql6525042'
    }
  });

  module.exports={databaseConnection}