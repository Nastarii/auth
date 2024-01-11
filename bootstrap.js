const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, 
    process.env.MYSQL_USER, 
    process.env.MYSQL_PASSWORD, 
    {
        host: process.env.HOST,
        dialect: 'mysql'
    }
);

const checkConnection = async () => {
    await sequelize.authenticate().then(async () => {
      console.log('✔ Connection has been established successfully.');
      await sequelize.sync();
    }).catch(err => {
      console.error('❌ Unable to connect to the database:', err);
    });
}

checkConnection();

module.exports = sequelize;