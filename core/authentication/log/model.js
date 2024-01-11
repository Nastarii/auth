const db = require('../../../bootstrap');

const Logs = db.define('logs', {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    clientId: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        unique: true,
    },
    type: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
    },
}, { updatedAt: false});

module.exports = Logs;