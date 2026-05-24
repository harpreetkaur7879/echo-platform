const express          = require('express');
const router           = express.Router();
const {
  createThought,
  getMyThoughts,
  getThoughtById,
  deleteThought
} = require('../controllers/thoughtController');

router.post('/',     createThought);
router.get('/mine',  getMyThoughts);
router.get('/:id',   getThoughtById);
router.delete('/:id', deleteThought);

module.exports = router;