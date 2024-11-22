// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors');



// const app = express();

// // JSON রিকোয়েস্ট হ্যান্ডলিং
// app.use(cors({
//     origin: 'http://127.0.0.1:5501' // আপনার ফ্রন্টএন্ড URL
// }));
// app.use(express.json());

// // MySQL ডাটাবেজ কানেকশন সেটআপ
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'ecocycle'
// });

// // ডাটাবেজ কানেকশন পরীক্ষা
// connection.connect((err) => {
//     if (err) {
//         console.error('Connection Error:', err);
//         process.exit(1); // অ্যাপ্লিকেশন বন্ধ করে দিন
//     } else {
//         console.log('Connected to the MySQL database.');
//     }
// });

// // POST রিকোয়েস্ট হ্যান্ডল করা
// app.post('/registerCollector', (req, res) => {
//     const { name, email, password } = req.body;
//     console.log('Received data:', { name, email, password });

//     if (!name || !email || !password) {
//         return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const query = 'INSERT INTO collector (name, email, password) VALUES (?, ?, ?)';
//     connection.query(query, [name, email, password], (err, result) => {
//         if (err) {
//             console.error('Database Error:', err);
//             return res.status(500).json({ message: 'Failed to register collector.' });
//         }
//         res.status(201).json({ message: 'Collector registered successfully!', id: result.insertId });
//     });
// });

// // সার্ভার চালু
// const PORT = 5501;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
