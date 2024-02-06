// passwordHash.js
const crypto = require('crypto');

const FIXED_SALT = process.env.PASSWORD_SALT;

function hashPassword(plainTextPassword) {
    const saltedPassword = plainTextPassword + FIXED_SALT;
    const fullHash = crypto.createHash('sha256').update(saltedPassword).digest('hex');
    return fullHash.slice(0, 32);
}

module.exports = { hashPassword };
