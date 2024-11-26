



const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const session = require('express-session');

const app = express();
const port = 5501;

app.use(session({
    secret: 'my_super_secret_key_123!@#$%_random_text',
    resave: false,
    saveUninitialized: true,
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5501", 
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5501' //  frontend URL
}));
app.use(express.json()); 

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

// Login route
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
            req.session.user = { email: user.email, name: user.name };
            res.status(200).json({
                message: 'Login successful',
                status: 'success',
                name: user.name,
                user: req.session.user,
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});

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

// Plastic Submission Route
app.post("/submitPlastic", (req, res) => {
    const { collectorId, agentId, plasticAmount } = req.body;

    if (!collectorId || !agentId || !plasticAmount) {
        return res.status(400).json({ message: "Invalid Data" });
    }

    const query = "INSERT INTO submitplastic (collectorId, agentId, plasticAmount, status) VALUES (?, ?, ?, 'pending')";
    db.query(query, [collectorId, agentId, plasticAmount], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Submission failed" });
        }
        res.status(200).json({ message: "Submission successful!" });
    });
});



app.post('/acceptSubmission', (req, res) => {
    const { submissionId } = req.body;

    if (!submissionId) {
        return res.status(400).json({ message: "Submission ID is required." });
    }

    // Step 1: Update submission status to 'accepted'
    const updateQuery = `UPDATE submitplastic SET status = 'accepted' WHERE id = ?`;
    db.query(updateQuery, [submissionId], (err, updateResult) => {
        if (err) {
            console.error("Database Error (Accept):", err);
            return res.status(500).json({ message: "Failed to accept submission." });
        }

        // If no rows were updated, it means the submission ID wasn't found
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Submission not found." });
        }

        // Step 2: Update reward for the collector
        const rewardQuery = `UPDATE collector INNER JOIN submitplastic ON collector.name = submitplastic.collectorId 
                             SET collector.rewards = collector.rewards + (submitplastic.plasticAmount * 10) 
                             WHERE submitplastic.id = ?`;

        db.query(rewardQuery, [submissionId], (err, rewardResult) => {
            if (err) {
                console.error("Database Error (Reward):", err);
                return res.status(500).json({ message: "Failed to update rewards." });
            }

            // If no rows were updated, the collector might not exist
            if (rewardResult.affectedRows === 0) {
                return res.status(404).json({ message: "Collector not found for the submission." });
            }

            // Success response
            res.status(200).json({ message: "Submission accepted and rewards updated!" });
        });
    });
});


// Delete Submission Route
app.delete('/deleteSubmission', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Submission ID is required." });
    }

    const deleteQuery = `DELETE FROM submitplastic WHERE id = ?`;
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error("Database Error (Delete):", err);
            return res.status(500).json({ message: "Failed to delete submission." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No submission found with this ID." });
        }

        res.status(200).json({ message: "Submission deleted successfully!" });
    });
});

// Get Agent Submissions Route
app.get('/agentSubmissions', (req, res) => {
    const { agentId } = req.query;

    if (!agentId) {
        return res.status(400).json({ message: 'Agent ID is required.' });
    }

    const query = 'SELECT * FROM submitplastic WHERE agentId = ?';
    db.query(query, [agentId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No submissions found for this agent.' });
        }

        res.status(200).json({ submissions: results });
    });
});


////reward collector 

// Route to get collector's data including rewards
app.get('/collectorReward', (req, res) => {
    const collectorId = req.query.collectorId; // Getting the collectorId from the query parameter

    if (!collectorId) {
        return res.status(400).json({ message: "Collector ID is required." });
    }

    const query = 'SELECT  rewards FROM collector WHERE name = ?';

    db.query(query, [collectorId], (err, result) => {
        if (err) {
            console.error("Database Error (Fetch Collector):", err);
            return res.status(500).json({ message: "Failed to fetch collector data." });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Collector not found." });
        }

        res.status(200).json({
            name: result[0].name,
            rewards: result[0].rewards,
        });
    });
});




// Register Collector Route
app.post("/registerCollector", (req, res) => {
    const { name, email, password } = req.body;

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

// Register Agent Route
app.post("/registerAgent", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const query = "INSERT INTO agent (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Failed to register agent." });
        }
        res.status(201).json({ message: "Agent registered successfully!", id: result.insertId });
    });
});





// Agent Login Route
app.post('/agentLogin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM agent WHERE email = ?';
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
            req.session.user = { id: user.id, email: user.email, name: user.name };
            res.status(200).json({
                message: 'Login successful',
                status: 'success',
                name: user.name,
                email:user.email,
                id:user.id,
                user: req.session.user,
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});

// Serve static files (like HTML pages)
app.use(express.static("public"));

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


