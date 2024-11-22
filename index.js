


const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const session = require('express-session');


const app = express();
const port = 5501;

app.use(session({
    secret: 'my_super_secret_key_123!@#$%_random_text',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // HTTPS ছাড়া চলার জন্য
        httpOnly: true, // কুকি শুধুমাত্র সার্ভার থেকে অ্যাক্সেসযোগ্য হবে
    }
}));



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

               // Save user email and name in session
            //    req.session.user = { email: user.email, name: user.name };
               console.log('Session Set:', req.session.user);
               req.session.user = { email: user.email, name: user.name };

           res.status(200).json({
                message: 'Login successful',

                status: 'success',
                    name: user.name,
                    
                     // Store the complete user object in localStorage

                    user: req.session.user,
                // user: {  name: user.name, email: user.email },

                
                
                
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});


///// for colector profile get name ;;;

// Route to get logged-in user's data
// Route to get logged-in user's data

// app.get('/getLoggedInUser', (req, res) => {
//     // Assuming user info is stored in session
//     if (req.session && req.session.user) {
//         res.json({
//             email: req.session.user.email,
//             name: req.session.user.name
            
//         }); // Send email and name from session
//     } else {
//         res.status(401).json({ message: 'Not logged in' });
//     }
// });



// } );

//////



// Get Agent List Route
app.get('/agents', (req, res) => {
    const query = 'SELECT id, name FROM agent';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ agents: results });
    });
});

// Submit Plastic Route (to an agent)
app.post('/submitPlastic', (req, res) => {
    const { collectorId, agentId, plasticAmount } = req.body;

    if (!collectorId || !agentId || !plasticAmount) {
        return res.status(400).json({ message: 'Collector ID, Agent ID, and Plastic Amount are required.' });
    }

    // Store the plastic submission request (you can add more logic like checking agent's availability)
    const query = 'INSERT INTO submissions (collector_id, agent_id, amount) VALUES (?, ?, ?)';
    db.query(query, [collectorId, agentId, plasticAmount], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Failed to submit plastic.' });
        }

        // Calculate reward (for simplicity, let's assume 10 points per kg)
        const rewardPoints = parseFloat(plasticAmount) * 10;

        res.status(200).json({
            message: 'Plastic submitted successfully!',
            rewardPoints: rewardPoints
        });
    });
});




///////



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



