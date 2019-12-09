const router = require('express').Router();
const connection = require('../db');

//create database
router.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE webmarket';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    });
});

//create categories table
router.get('/createtablecategories', (req, res) => {
    let sql = `CREATE TABLE categories
        (categoryID INT AUTO_INCREMENT NOT NULL,
        categoryName VARCHAR(255) NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
        picture VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (categoryID))`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Categories table created...');
    });
});

//create products table
router.get('/createtableproducts', (req, res) => {
    let sql = `CREATE TABLE products
        (productID INT AUTO_INCREMENT NOT NULL,
        productName VARCHAR(255) NOT NULL,
        categoryID INT NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
        picture VARCHAR(255) DEFAULT NULL,
        unitPrice decimal(19,2) DEFAULT 0.00,
        UnitsInStock INT DEFAULT 0,
        PRIMARY KEY (productID),
        FOREIGN KEY (categoryID) REFERENCES categories (categoryID))`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Products table created...');
    });
});

//crtate customers table
router.get('/createtablecustomers', (req, res) => {
    let sql = `CREATE TABLE customers (
        customerID INT NOT NULL,
        firstName varchar(60) DEFAULT NULL,
        lastName varchar(60) DEFAULT NULL,
        email varchar(60) DEFAULT NULL,
        address varchar(60) DEFAULT NULL,
        city varchar(60) DEFAULT NULL,
        password varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
        admin BOOLEAN DEFAULT false,
        PRIMARY KEY (customerID)
        )`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Customers table created...');
    });
});

//crtate carts table
router.get('/createtablecarts', (req, res) => {
    let sql = `CREATE TABLE carts(
        cartID INT AUTO_INCREMENT NOT NULL,
        customerID INT NOT NULL,
        createCartDate date DEFAULT NULL,
        dateTime BIGINT(30) DEFAULT NULL,
        isOpen BOOLEAN DEFAULT true,
        PRIMARY KEY (cartID),
        FOREIGN KEY (customerID) REFERENCES customers (customerID)
        )`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Carts table created...')
    });
});

//crtate cart-details table
router.get('/createtablecartdetails', (req, res) => {
    let sql = `CREATE TABLE cartsDetails(
        cartDetailID INT AUTO_INCREMENT NOT NULL,
        productID INT NOT NULL,
        quantity INT NOT NULL,
        finalPrice decimal(10,2) DEFAULT 0.00, 
        cartID INT NOT NULL,
        PRIMARY KEY (cartDetailID),
        FOREIGN KEY (productID) REFERENCES products (productID),
        FOREIGN KEY (cartID) REFERENCES carts (cartID)
        )`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Cart-details table created...');
    });
});

//crtate orders table
router.get('/createtableorders', (req, res) => {
    let sql = `CREATE TABLE orders(
        orderID INT AUTO_INCREMENT NOT NULL,
        customerID INT NOT NULL,
        cartID INT NOT NULL,
        finalPrice decimal(10,2) DEFAULT 0.00,
        address varchar(60) DEFAULT NULL,
        city varchar(60) DEFAULT NULL,
        shippingDate datetime DEFAULT NULL,
        orderDate datetime DEFAULT NULL,
        endCreditCard INT(4) DEFAULT NULL,
        PRIMARY KEY (orderID),
        FOREIGN KEY (customerID) REFERENCES customers (customerID),
        FOREIGN KEY (cartID) REFERENCES carts (cartID)
        )`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Orders table created...');
    });
});

//create all tables
router.get('/createalltables', (req, res) => {
    let sql = `
    SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    SET time_zone = "+02:00";

    CREATE TABLE categories (
        categoryID INT AUTO_INCREMENT NOT NULL,
        categoryName VARCHAR(255) NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
        picture VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (categoryID)
        );

    CREATE TABLE products (
        productID INT AUTO_INCREMENT NOT NULL,
        productName VARCHAR(255) NOT NULL,
        categoryID INT NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
        picture VARCHAR(255) DEFAULT NULL,
        unitPrice decimal(19,2) DEFAULT 0.00,
        UnitsInStock INT DEFAULT 0,
        PRIMARY KEY (productID),
        FOREIGN KEY (categoryID) REFERENCES categories (categoryID) ON DELETE CASCADE ON UPDATE CASCADE
        );

    CREATE TABLE customers (
        customerID INT(9) NOT NULL,
        firstName varchar(60) DEFAULT NULL,
        lastName varchar(60) DEFAULT NULL,
        email varchar(60) DEFAULT NULL,
        address varchar(60) DEFAULT NULL,
        city varchar(60) DEFAULT NULL,
        password varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
        admin BOOLEAN DEFAULT false,
        PRIMARY KEY (customerID)
        );

    CREATE TABLE carts(
        cartID INT AUTO_INCREMENT NOT NULL,
        customerID INT NOT NULL,
        createCartDate date DEFAULT NULL,
        dateTime BIGINT(30) DEFAULT NULL,
        isOpen BOOLEAN DEFAULT true,
        PRIMARY KEY (cartID),
        FOREIGN KEY (customerID) REFERENCES customers (customerID) ON DELETE CASCADE ON UPDATE CASCADE
        );

    CREATE TABLE cartsDetails(
        cartDetailID INT AUTO_INCREMENT NOT NULL,
        productID INT NOT NULL,
        quantity INT NOT NULL,
        finalPrice decimal(10,2) DEFAULT 0.00, 
        cartID INT NOT NULL,
        PRIMARY KEY (cartDetailID),
        FOREIGN KEY (productID) REFERENCES products (productID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (cartID) REFERENCES carts (cartID) ON DELETE CASCADE ON UPDATE CASCADE
        );

    CREATE TABLE orders(
        orderID INT AUTO_INCREMENT NOT NULL,
        customerID INT NOT NULL,
        cartID INT NOT NULL,
        finalPrice decimal(10,2) DEFAULT 0.00,
        address varchar(60) DEFAULT NULL,
        city varchar(60) DEFAULT NULL,
        shippingDate date  DEFAULT NULL,
        orderDate date  DEFAULT NULL,
        endCreditCard INT(4) DEFAULT NULL,
        PRIMARY KEY (orderID),
        FOREIGN KEY (customerID) REFERENCES customers (customerID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (cartID) REFERENCES carts (cartID) ON DELETE CASCADE ON UPDATE CASCADE
        );`

    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('All table created...');
    });
});

module.exports = router;