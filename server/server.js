// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const brandsRouter = require('./routes/brands');

// 🔌 Middlewares
app.use(express.json());
app.use(cors());

// 🔁 טעינת ראוטים
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

// 🧭 שימוש בנתיבים
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/brands', brandsRouter);

// ✅ דף ראשי לבדיקה
app.get('/', (req, res) => {
  res.send('🎉 Welcome to the API root route!');
});

// ❌ טיפול בנתיב שלא קיים
app.use((req, res) => {
  res.status(404).send("🔍 Route not found: " + req.originalUrl);
});

// 🔗 התחברות למסד MongoDB בענן
mongoose.connect(
  'mongodb+srv://rBKlDpmDH1KaKS9q:rBKlDpmDH1KaKS9q@cluster0.8qnzj.mongodb.net/final-products?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// 🟢 הרצת השרת
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
