require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const userOrderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://petzi-ecommerce-petfood.vercel.app' , 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
  credentials: true, // Allow credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser()); 

// Connect to Db
connectDB();

// User Routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api/users', cartRoutes);
app.use('/api/users', wishlistRoutes);
app.use('/api/users/', userOrderRoutes);

// Admin Routes
app.use('/api/admin', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/', userOrderRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));