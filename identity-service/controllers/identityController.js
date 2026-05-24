require('dotenv').config();
const Identity = require('../models/Identity');
const { nanoid } = require('nanoid');

// CREATE — generate new secret key
const createIdentity = async (req, res) => {
  try {
    const secretKey = `ECHO-${nanoid(4)}-${nanoid(4)}-${nanoid(4)}`;

    const identity = await Identity.create({ secretKey });

    res.status(201).json({
      message:   'Your echo identity is created 🌑',
      secretKey: identity.secretKey,
      warning:   'Save this key. We cannot recover it. Ever.'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// RESTORE — enter key to get back in
const restoreIdentity = async (req, res) => {
  try {
    const { secretKey } = req.body;

    if (!secretKey) {
      return res.status(400).json({ error: 'Secret key is required' });
    }

    const identity = await Identity.findOne({ where: { secretKey } });

    if (!identity) {
      return res.status(404).json({
        error: 'Key not found. Lost keys cannot be recovered.'
      });
    }

    await identity.update({ lastSeen: new Date() });

    res.status(200).json({
      message:    'Welcome back 🌑',
      secretKey:  identity.secretKey,
      identityId: identity.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// VERIFY — used by other services to verify key
const verifyIdentity = async (req, res) => {
  try {
    const secretKey = req.headers['x-echo-key'];

    if (!secretKey) {
      return res.status(401).json({ valid: false, error: 'No key provided' });
    }

    const identity = await Identity.findOne({ where: { secretKey } });

    if (!identity) {
      return res.status(401).json({ valid: false, error: 'Invalid key' });
    }

    res.status(200).json({
      valid:      true,
      identityId: identity.id,
      secretKey:  identity.secretKey
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// MIDDLEWARE — protect routes in OTHER services
const protect = async (req, res, next) => {
  try {
    const secretKey = req.headers['x-echo-key'];

    if (!secretKey) {
      return res.status(401).json({ error: 'No echo key provided' });
    }

    const identity = await Identity.findOne({ where: { secretKey } });

    if (!identity) {
      return res.status(401).json({ error: 'Invalid echo key' });
    }

    req.identityId = identity.id;
    req.secretKey  = secretKey;
    next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createIdentity, restoreIdentity, verifyIdentity, protect };