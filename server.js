const express = require("express");
const app = express();
var db = require("./database.js")
var cron = require('node-cron');
var bodyParser = require("body-parser");
const { request, response } = require("express");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let HTTP_PORT = 8080
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/api/products", (req, res, next) => {
    try {
        var sql = "select * from products"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }

});

app.get("/api/products/:id", (req, res, next) => {
    try {
        var sql = "select * from products where id = ?"
        var params = [req.params.id]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/products/quantity/:quantity", (req, res, next) => {
    try {
        var row = "[]"
        var sql = "select * from products where quantity > ?"
        var params = [req.params.quantity]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/products/unitPrice/:unitPrice", (req, res, next) => {
    try {
        var row = "[]"
        var sql = "select * from products where unitPrice > ?"
        var params = [req.params.unitPrice]
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            } else {
                res.json({

                    "message": "success",
                    "data": row
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.post("/api/products/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        const { productName,
            description,
            category,
            brand,
            expiredDate,
            manufacturedDate,
            batchNumber,
            unitPrice,
            quantity,
            createdDate
        } = req.body;

        var sql = 'INSERT INTO products (productName, description, category, brand, expiredDate, manufacturedDate, batchNumber, unitPrice, quantity, createdDate) VALUES (?,?,?,?,?,?,?,?,?,?)'
        var params = [productName, description, category, brand, expiredDate, manufacturedDate, batchNumber, unitPrice, quantity, createdDate]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.json({
                    "message": "success",
                    "data": req.body,
                    "id": this.lastID
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});


app.put("/api/products/", (req, res, next) => {


    const {
        id,
        productName,
        description,
        category,
        brand,
        expiredDate,
        manufacturedDate,
        batchNumber,
        unitPrice,
        quantity,
        createdDate
    } = req.body;

    db.run(`UPDATE products set productName = ?, description = ?, category = ?, brand = ?,expiredDate=?,manufacturedDate=?,batchNumber=?,unitPrice=?,quantity=?,createdDate=? WHERE id = ?`,
        [productName, description, category, brand, expiredDate, manufacturedDate, batchNumber, unitPrice, quantity, createdDate, id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updated: this.changes });
        });
});


app.delete("/api/products/delete/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM products WHERE id = ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.delete("/api/products/deleteAll/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM products WHERE id > ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});


app.get("/api/suppliers/", (req, res, next) => {
    try {
        var sql = "select * from suppliers"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }

});


app.post("/api/suppliers/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        const { supplierName,
            address,
            joinedDate,
            mobileNo
        } = req.body;

        var sql = 'INSERT INTO suppliers (supplierName, address, joinedDate, mobileNo) VALUES (?,?,?,?)'
        var params = [supplierName, address, joinedDate, mobileNo]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.json({
                    "message": "success",
                    "data": req.body,
                    "id": this.lastID
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.delete("/api/suppliers/deleteAll/:id", (req, res, next) => {
    try {
        db.run(
            'DELETE FROM suppliers WHERE id > ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E);
    }
});


app.get("/api/customer/", (req, res, next) => {
    try {
        var sql = "select * from customer"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }

});

app.post("/api/customer/", (req, res, next) => {
    try {
        console.log("Request body:", req.body);


        const {
            name = "Dulneth Ransilu",
            address = "354 Temple Road, Colombo",
            email = `dulnethransilu@gmail.com`,
            dateOfBirth = "2000.02.24",
            gender = "male",
            age = 18,
            cardHolderName = "D.Ransilu",
            cardNumber = "343470789050",
            expiryDate = "2025.02.24",
            cvv = "675",
            timeStamp = new Date().toISOString()
        } = req.body;

        // SQL query to insert a new customer
        const sql = `
            INSERT INTO customer (
                name, 
                address, 
                email, 
                dateOfBirth, 
                gender, 
                age, 
                cardHolderName, 
                cardNumber, 
                expiryDate, 
                cvv, 
                timeStamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            name,
            address,
            email,
            dateOfBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            timeStamp
        ];

        // Insert the new customer
        db.run(sql, params, function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            res.status(201).json({
                message: `Customer ${name} has registered`,
                customerId: this.lastID
            });
        });
    } catch (E) {
        res.status(400).json({
            error: "An unexpected error occurred",
            details: E.message
        });
    }
});

// Root path
app.get("/", (req, res, next) => {
    res.json({ "message": "University of Moratuwa" })
});