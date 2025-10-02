const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DATABASE_NAME, 
    process.env.DATABASE_USERNAME, 
    process.env.DATABASE_PASSWORD, 
    {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect:'mysql',
        dialectOptions: {
            connectTimeout: (process.env.DATABASE_TIMEOUT ?? 60000),
        }
    });

try 
{
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} 
catch (error) 
{
    console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;
