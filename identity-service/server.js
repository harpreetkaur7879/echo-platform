require('dotenv').config();
const express        = require('express');
const { connectDB }  = require('./db');
const identityRoutes = require('./routes/identityRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use('/identity', identityRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    service:   'identity-service',
    database:  'PostgreSQL',
    status:    'running 🌑',
    port:      process.env.PORT,
    timestamp: new Date()
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Identity Service running on port ${process.env.PORT} 🌑`);
});