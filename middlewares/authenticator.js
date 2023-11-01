const jwt = require('jsonwebtoken');
const config = require('../config/keys');

function verifyTokenMiddleware(context) {
    const authorizationHeader = context?.headers?.authorization;
    // if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    //     throw new Error('Authentication failed. Token is missing or invalid.');
    // }

    const token = authorizationHeader;
    console.log(token)
    try {
        const decodedToken = jwt.verify(token, config.jwtSecret);
        context.user = { userId: decodedToken.userId, email: decodedToken.email };
        // console.log(context.email)
        return context.user;
    } catch (error) {
        throw new Error('Authentication failed. Token is missing.', error);
    }
}

module.exports = verifyTokenMiddleware;
