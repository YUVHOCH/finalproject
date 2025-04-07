// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// ✅ טעינת ראוטים
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

// ✅ Middlewares
app.use(express.json());
app.use(cors());

// ✅ שימוש בנתיבים
app.use('/users', userRoutes);       // הרשמה, התחברות
app.use('/products', productRoutes); // מוצרים
app.use('/admin', adminRoutes);      // ניהול - טוקן + אדמין

// ✅ דף ראשי (לבדיקה שהשרת רץ)
app.get('/', (req, res) => {
  res.send('🎉 Welcome to the API root route!');
});

// C:\finalproject\server\server.js
app.use((req, res) => {
  res.status(404).send("🔍 Route not found: " + req.originalUrl);
});

// ✅ חיבור ל־MongoDB
mongoose.connect(
  'mongodb+srv://rBKlDpmDH1KaKS9q:rBKlDpmDH1KaKS9q@cluster0.8qnzj.mongodb.net/final-products?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ הרצת השרת
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});