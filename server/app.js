const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const brandsRouter = require('./routes/brands');
const initBrands = require('./init/initBrands');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/brands', brandsRouter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  initBrands();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

module.exports = app; 