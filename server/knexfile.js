// knexfile.js
module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: '23522766',
        database: 'triada'
      },
      migrations: {
        directory: './migrations'
      }
    }
  };
  