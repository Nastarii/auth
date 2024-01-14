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
    lastname: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Client;