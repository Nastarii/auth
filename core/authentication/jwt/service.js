const jwt = require('jsonwebtoken');

function handleAccessTokenPolicy(req, tokenType= 2) {

    const header = req.headers.authorization;
    let tokenData = null;
    if(!header || !header.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header');
    }

    const token = header.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return null;
        }

        if (decoded.type !== tokenType) {
            return null;
        }

        tokenData = decoded;
    });
    return tokenData;
}

module.exports = {
    handleAccessTokenPolicy
};