require('dotenv').config();

const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
    // Retrieves RSA public key from the specified endpoint
    secret: jwks.expressJwtSecret({
        cache: true.valueOf,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: `${process.env.AUTH0_AUDIENCE}`,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
});

module.exports = jwtCheck;
