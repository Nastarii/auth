const db = require('../../bootstrap');

const Authorization = db.define('authorization', {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    clientId: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    role: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    expiresAt: {
        type: db.Sequelize.DATE,
        allowNull: true,
    },
});

module.exports = Authorization;