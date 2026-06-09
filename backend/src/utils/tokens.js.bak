const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
function hashToken(t) { return crypto.createHash('sha256').update(t).digest('hex'); }
function generateAccessToken(user) { return jwt.sign({ id:user.id, role:user.role }, config.jwt.secret, { expiresIn: config.jwt.accessExpiry || '15m' }); }
function generateRefreshToken(user) { return jwt.sign({ id:user.id }, config.jwt.refreshSecret || config.jwt.secret, { expiresIn: config.jwt.refreshExpiry || '7d' }); }
function verifyAccessToken(t) { return jwt.verify(t, config.jwt.secret); }
function verifyRefreshToken(t) { return jwt.verify(t, config.jwt.refreshSecret || config.jwt.secret); }
module.exports = { hashToken, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };

