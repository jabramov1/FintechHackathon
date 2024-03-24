const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const app = express();
app.use(session({
    secret: 'your secret key', // Replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS, otherwise false
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
const authRoutes = require('./routes/authRoutes');

const loanRoutes = require('./routes/loanRoutes'); // Adjust the path as necessary


app.use(express.json());
app.use('/api/loan', loanRoutes);





// Middleware to parse JSON bodies


// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // or the correct origin of your front-end
    credentials: true // if you're using credentials
}));


// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Use routes for authentication
app.use('/api/auth', authRoutes);

// A simple root route to verify the server is running
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the eDeFICB Backend API!" });
});

// Catch-all for 404 errors
app.use((req, res, next) => {
    res.status(404).send({ message: "Resource not found" });
});

// Central error handling
app.use((err, req, res, next) => {
    console.error(err); // Log error information for debugging
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: {}
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

