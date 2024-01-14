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
    username: {
        type: db.Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    active: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = Credential;
