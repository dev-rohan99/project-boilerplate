const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(require('cors')());

// Routes
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
