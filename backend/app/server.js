
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();

const PORT = process.env.BACKEND_PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});