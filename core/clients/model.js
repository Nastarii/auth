const db = require('../../bootstrap');

const Client = db.define('client', {
    id: {
        type: db.Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: db.Sequelize.STRING,
        defaultValue: null,
        allowNull: true
    },
    age: {
        type: db.Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
    },
    age: {
        type: db.Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
    },
    companyName: {
        type: db.Sequelize.STRING,
        defaultValue: null,
        allowNull: true
    }
});

module.exports = Client;