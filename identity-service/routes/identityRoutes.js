const express    = require('express');
const router     = express.Router();
const {
  createIdentity,
  restoreIdentity,
  verifyIdentity
} = require('../controllers/identityController');

router.post('/create',  createIdentity);
router.post('/restore', restoreIdentity);
router.get('/verify',   verifyIdentity);

module.exports = router;