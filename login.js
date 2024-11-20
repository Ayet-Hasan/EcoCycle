const express = require('express');
const mysql = require('mysql');
const router = express.Router(); // Use a router to define routes

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecocycle'
});

connection.connect((err) => {
    if (err) {
        console.error('Connection Error:', err);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM collector WHERE email = ?';
    connection.query(query, [email], (err, results) => {
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
                user: { id: user.id, name: user.name, email: user.email },
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});

module.exports = router; // Export the router
