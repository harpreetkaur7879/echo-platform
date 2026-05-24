require('dotenv').config();
const Thought = require('../models/Thought');
const axios   = require('axios');

// helper — extract tags from content
const extractTags = (content) => {
  const stopWords = ['i', 'me', 'my', 'the', 'a', 'an', 'and', 'or', 'but',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'am', 'are', 'was',
    'it', 'this', 'that', 'so', 'do', 'dont', 'cant', 'feel', 'like', 'just'];

  return content
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);
};

// helper — verify identity key with identity-service
const verifyKey = async (secretKey) => {
  try {
    const response = await axios.get(
      `${process.env.IDENTITY_SERVICE_URL}/identity/verify`,
      { headers: { 'x-echo-key': secretKey } }
    );
    return response.data;
  } catch (err) {
    return null;
  }
};


// CREATE — post a new thought
const createThought = async (req, res) => {
  try {
    const secretKey = req.headers['x-echo-key'];

    // verify identity
    const identity = await verifyKey(secretKey);
    if (!identity || !identity.valid) {
      return res.status(401).json({ error: 'Invalid echo key' });
    }

    const { content, type } = req.body;

    if (!content || !type) {
      return res.status(400).json({ error: 'content and type are required' });
    }

    // auto extract tags
    const tags = extractTags(content);

    const thought = await Thought.create({
      identityId: identity.identityId,
      content,
      type,
      tags
    });

    res.status(201).json({
      message: 'Thought released into the void 🌑',
      thought
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET MY THOUGHTS
const getMyThoughts = async (req, res) => {
  try {
    const secretKey = req.headers['x-echo-key'];

    const identity = await verifyKey(secretKey);
    if (!identity || !identity.valid) {
      return res.status(401).json({ error: 'Invalid echo key' });
    }

    const thoughts = await Thought.find({ identityId: identity.identityId })
      .sort({ createdAt: -1 });

    res.status(200).json({ thoughts });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ONE THOUGHT
const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    res.status(200).json({ thought });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE THOUGHT
const deleteThought = async (req, res) => {
  try {
    const secretKey = req.headers['x-echo-key'];

    const identity = await verifyKey(secretKey);
    if (!identity || !identity.valid) {
      return res.status(401).json({ error: 'Invalid echo key' });
    }

    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    // make sure this thought belongs to this identity
    if (thought.identityId !== String(identity.identityId)) {
      return res.status(403).json({ error: 'Not your thought' });
    }

    await Thought.findByIdAndDelete(req.params.id);

    res.status(204).send();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createThought, getMyThoughts, getThoughtById, deleteThought };