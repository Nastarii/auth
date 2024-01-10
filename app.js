const express = require('express');
const app = express();

const { Sequelize } = require('sequelize');

const HOST = process.env.HOST || '127.0.0.1';

const PORT = process.env.PORT || 5000;

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE, 
  process.env.MYSQL_USER, 
  process.env.MYSQL_PASSWORD, {
  host: HOST,
  dialect: 'mysql'
});

const checkConnection = async () => {
  await sequelize.authenticate().then(() => {
    console.log('✔ Connection has been established successfully.');
  }).catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });
}

checkConnection()

app.get('/', (req, res) => {
  res.send('🚀 Well Done your app is working!')
})

app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT}`)
})