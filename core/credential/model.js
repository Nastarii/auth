const db = require('../../bootstrap');

const Credential = db.define('credential', {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    clientId: {
        type: db.Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        unique: true,
    },
    authorizationId: {
        type: db.Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        unique: true,
    },
    username: {
        type: db.Sequelize.STRING,
        allowNull: true,
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Credential;
