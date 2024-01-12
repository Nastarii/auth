const bcrypt = require('bcryptjs');
const Logs = require('./model');

/*
* Handle logs
* @param id - Client id
* @param type - Login | Logout
* @param attempt - Success | Failure
*/
async function handleLogs(id, type, attempt){
    await Logs.create({
        clientId: id,
        type: type,
        attempt: attempt
    }).catch(
        error => {
            res.status(500).json({ msg: error.message })
        }
    );
}

function handleViolations(error) {
    if (error.message === 'Wrong Password') {
        return 401;
    } else {
        return 500;
    }
}

function handlePasswordPolicy(password, hashedPassword) {
    const match = bcrypt.compareSync(password, hashedPassword);
    if(!match) {
        throw new Error('Wrong Password');
    }
}

module.exports = {
    handlePasswordPolicy,
    handleViolations,
    handleLogs
};