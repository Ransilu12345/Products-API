var express = require("express");
var app = express();
var db = require("./database.js");
var cron = require('node-cron');
var bodyParser = require("body-parser");
const { request, response } = require("express");
const cors = require('cors');

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let HTTP_PORT = 8080;

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Register a Customer API
app.post("/api/customers", (req, res) => {
    const { name, email, creditCardNumber } = req.body;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const creditCardRegex = /^\d{12}$/;

    if (!name || !email || !creditCardNumber) {
        return res.status(400).json({ error: "All fields (name, email, creditCardNumber) are required." });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address." });
    }

    if (!creditCardRegex.test(creditCardNumber)) {
        return res.status(400).json({ error: "Invalid credit card number. Must be 12 digits." });
    }

    const sql = `INSERT INTO customer (name, email, creditCardNumber) VALUES (?, ?, ?)`;
    const params = [name, email, creditCardNumber];

    db.run(sql, params, function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: "Email already exists." });
            }
            return res.status(400).json({ error: err.message });
        }

        res.status(201).json({
            message: "Customer registered successfully.",
            customerId: this.lastID
        });
    });
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ message: "University of Moratuwa" });
});
