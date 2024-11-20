const http = require('http');
const mysql = require('mysql');

 const express = require('express');
// const bcrypt = require('bcrypt');

const cors = require('cors');
const app = express();
app.use(express.json()); // JSON রিকোয়েস্ট হ্যান্ডলিং
app.use(cors()); // CORS সেটআপ


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








// // CORS সক্রিয় করা
app.use(cors({
    origin: 'http://127.0.0.1:5501/registerCollector',  // আপনার ফ্রন্টএন্ডের URL
}));

// JSON পাস করার জন্য
app.use(express.json());

// POST রিকোয়েস্ট হ্যান্ডল করা
app.post('/registerCollector', (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received data:', { name, email, password });



    // const writeToDatabase = (data) => {
    //     const { name, email, password } = data;
        const query = 'INSERT INTO collector (name, email, password) VALUES (?, ?, ?)';
        connection.query(query, [name, email, password], (err,result) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ message: 'Failed to register collector.' });
            } else {
                console.log('User added to database' ,results);
            }
        });
    });
      
  

    