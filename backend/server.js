const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Set mongoose strictQuery to suppress deprecation warning
mongoose.set('strictQuery', false);

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 to match frontend config

// Middleware
app.use(cors());
app.use(express.json());

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

console.log("added to git");// Use Routes
// Use Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => console.log(`Backend server started on port ${PORT}`));
