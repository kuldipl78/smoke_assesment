const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Kuldip@9764',
    database: 'userdata'
});

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL connection success !!");
    }
});

app.get('/', (req, res) => {
    res.send(`
        <form action="/register" method="POST">
            <h2>User Information</h2>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <h2>Address Information</h2>
            <label for="address">Address:</label>
            <input type="text" id="address" name="address" required>

            <button type="submit">Submit</button>
        </form>
    `);
});

app.post('/register', (req, res) => {
    const { name, address } = req.body;

    const insertUserQuery = 'INSERT INTO User (name) VALUES (?)';
    con.query(insertUserQuery, [name], (err, userResult) => {
        if (err) {
            console.error('Error inserting into User table:', err);
            return res.status(500).send('Error storing user data.');
        }

        const userId = userResult.insertId;

        const insertAddressQuery = 'INSERT INTO Address (address, userId) VALUES (?, ?)';
        con.query(insertAddressQuery, [address, userId], (err, addressResult) => {
            if (err) {
                console.error('Error inserting into Address table:', err);
                return res.status(500).send('Error storing address data.');
            }

            res.send('user and address stored successfully !!');
        });
    });
});

app.listen(5000, () => {
    console.log('server running at port 5000');
});
