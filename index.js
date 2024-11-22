// // index.js
// let server = require('./server'); // server.js ফাইল লোড করা
// // let loginServer =require('./loginServer');
// // আপনি যদি এখানে কোনও অতিরিক্ত কনফিগারেশন বা প্রক্রিয়া যোগ করতে চান, তা করতে পারবেন
// console.log("Server is up and running.");



const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 5501;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5501' // Your frontend URL (adjust if necessary)
}));
app.use(express.json()); // Built-in Express JSON parser

// MySQL connection setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecocycle"
});

// Test MySQL connection
db.connect(err => {
    if (err) {
        console.error("Connection Error:", err);
        process.exit(1); // Stop the app if connection fails
    } else {
        console.log("Connected to the MySQL database.");
    }
});



/// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM collector WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        if (user.password === password) {
            res.status(200).json({
                message: 'Login successful',

                status: 'success',
                    name: user.name,

                user: { id: user.id, name: user.name, email: user.email },
                
                
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});






// Handle register collector POST request
app.post("/registerCollector", (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received data:", { name, email, password });

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const query = "INSERT INTO collector (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Failed to register collector." });
        }
        res.status(201).json({ message: "Collector registered successfully!", id: result.insertId });
    });
});






// Serve static files (like HTML pages)
app.use(express.static("public"));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



