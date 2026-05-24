require('dotenv').config();
const express        = require('express');
const connectDB      = require('./db');
const thoughtRoutes  = require('./routes/thoughtRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use('/thoughts', thoughtRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    service:   'thought-service',
    database:  'MongoDB',
    status:    'running 🌑',
    port:      process.env.PORT,
    timestamp: new Date()
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Thought Service running on port ${process.env.PORT} 🌑`);
});