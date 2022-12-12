require('dotenv').config();
const {
    auth,
    claimCheck,
    InsufficientScopeError,
  } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    audience: process.env.AUDIENCE
  });

const checkRequiredPermissions = (requiredPermissions) => {
return (req, res, next) => {
    const permissionCheck = claimCheck((payload) => {
    const permissions = payload.permissions || [];

    const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission)
    );

    if (!hasPermissions) {
        throw new InsufficientScopeError();
    }

    return hasPermissions;
    });

    permissionCheck(req, res, next);
};
};

module.exports = { jwtCheck, checkRequiredPermissions };
