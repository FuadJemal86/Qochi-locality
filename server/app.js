const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adminRoute = require('./Router/adminRoute');
const userRoute = require('./Router/userRoute');
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3032;

// Set the correct path to the uploads directory (outside the server directory)
const membersDir = path.join(__dirname, "..", "uploads", "members");

// Ensure the uploads directory exists
if (!fs.existsSync(membersDir)) {
    fs.mkdirSync(membersDir, { recursive: true });
    console.log(`Created directory: ${membersDir}`);
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true
}));

// Serve static files from the correct external directory
app.use('/uploads', express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use('/admin', adminRoute);
app.use('/user', userRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
