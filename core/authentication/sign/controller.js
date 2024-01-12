const bcrypt = require('bcryptjs');
const sendEmail = require('../email/service');

/*
* Handle server response when unique constraint is violated
* @param {json} error - Error object
* @return {string} - Path of the unique constraint that was violated
*/
function handleViolations(error) {
    if(error.message === 'Password Policy Violation') {
        return [401, null];
    } else if (error.message === 'Email Policy Violation') {
        return [401, null]
    } else if (error.message === 'Validation error') {
        const fields = Object.keys(error.fields);
        const field = (fields.length > 0) ? fields[0] : null;
        return [403, field];
    } else {
        return [500, null];
    }
}

/*
* Handle password policies
* @param {string} errors - User Password
* @return {string} - hashed password
*/
function handlePasswordPolicy(password) {

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const match = passwordRegex.test(password);
    if (!match) {
        throw new Error('Password Policy Violation');
    }
    return hashPassword(password);
}

/*
* Encrypting clients passwords
* @param {string} password - User Password
* @return {string} - hashed password
*/
function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function handleEmailPolicy(id, email) {
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
    const match = emailRegex.test(email);
    if (!match) {
        throw new Error('Email Policy Violation');
    }

}

module.exports = {
    handleViolations,
    handlePasswordPolicy,
    handleEmailPolicy
};