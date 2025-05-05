var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQlite database.');

        // Products table
        db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            productName text, 
            description text,
            category text,
            brand text,
            expiredDate text,
            manufacturedDate text,
            batchNumber INTEGER,
            unitPrice INTEGER,
            quantity INTEGER,
            createdDate text
        )`, (err) => {
            if (!err) {
                var insert = 'INSERT INTO products (productName, description, category, brand, expiredDate, manufacturedDate, batchNumber, unitPrice, quantity, createdDate) VALUES (?,?,?,?,?,?,?,?,?,?)';
                db.run(insert, [
                    "White Basmathi Rice",
                    "White Basmathi Rice imported from Pakistan. High-quality rice with extra fragrance. Organically grown.",
                    "Rice",
                    "CIC",
                    "2023.05.04",
                    "2022.02.20",
                    324567,
                    1020,
                    200,
                    "2022.02.24"
                ]);
            }
        });

        // Suppliers table
        db.run(`CREATE TABLE suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplierName text, 
            address text,
            joinedDate text,
            mobileNo text
        )`, (err) => {
            if (!err) {
                var insert = 'INSERT INTO suppliers (supplierName, address, joinedDate, mobileNo) VALUES (?,?,?,?)';
                db.run(insert, [
                    "D.J.Ishara",
                    "345A ,R.A De Mel Road, Colombo 3",
                    "16/3/2022",
                    "0776600933"
                ]);
            }
        });

        // Customers table
        db.run(`CREATE TABLE customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT,
            email TEXT NOT NULL UNIQUE,
            dateOfBirth TEXT,
            gender TEXT,
            age INTEGER,
            cardHolderName TEXT,
            cardNumber TEXT,
            expiryDate TEXT,
            cvv TEXT,
            timeStamp TEXT
        )`, (err) => {
            if (!err) {
                var insert = 'INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
                db.run(insert, [
                    "Dulneth Ransilu",
                    "354 Temple Road, Colombo",
                    "dulnethransilu@gmail.com",
                    "2000.02.24",
                    "male",
                    "23",
                    "D.Ransilu",
                    "123456789012",
                    "2025.02.24",
                    "123",
                    "2022.02.24 10:00:00"
                ]);
            }
        });
    }
});

module.exports = db;
