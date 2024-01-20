const bcrypt = require('bcryptjs');
const Logs = require('./model');

/*
* Handle logs
* @param id - Client id
* @param type - Login | Logout
* @param attempt - Success | Failure
*/
async function handleLogs(id, ip, type, attempt){
    await Logs.create({
        clientId: id,
        ip: ip,
        type: type,
        attempt: attempt
    }).catch(
        error => {
            res.status(500).json({ msg: error.message })
        }
    );
}

function handleViolations(error) {
    if (error.message === 'Wrong Password' || error.message === 'Client email not verified') {
        return 401;
    }
    else if(error.message === 'Email not found') {
        return 404;
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