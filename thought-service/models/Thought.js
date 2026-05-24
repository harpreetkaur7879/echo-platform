const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({

  identityId: {
    type:     String,
    required: true
  },

  content: {
    type:      String,
    required:  true,
    maxlength: 500
  },

  type: {
    type:     String,
    enum:     ['feeling', 'question', 'realization'],
    required: true
  },

  tags: {
    type:    [String],
    default: []
  },

  echoCount: {
    type:    Number,
    default: 0
  },

  createdAt: {
    type:    Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Thought', thoughtSchema);