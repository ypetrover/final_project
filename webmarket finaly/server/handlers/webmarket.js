const connection = require('../db')
const path = require('path')
const fs = require('fs')

const info = (req, res) => {
    const sql = `SELECT COUNT(orderID) AS Orders ,(SELECT COUNT(productID) FROM products) AS Products FROM orders`
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
}

const allProducts = (req, res) => {
    const sql = 'SELECT * FROM products WHERE UnitsInStock > 0'
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
}

const getuser = (req, res) => {
    const sql = `SELECT * FROM customers WHERE customerID = ${req.params.id}`
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
}

const checkShipDate = (req, res) => {
    const sql = `SELECT * FROM orders WHERE shippingDate = '${req.params.date}'`
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length >= 3) {
            res.json({ success: false, msg: 'this date is full' })
        } else {
            res.json({ success: true, msg: 'the date saved' })
        }
    })
}

let quantity;
const checkOut = (req, res) => {
    lastDigits = req.body.ccNumber.toString()
    last = lastDigits.slice(lastDigits.length - 4)
    console.log(last, lastDigits)
    const sql = `
            INSERT INTO orders
            (customerID, cartID, finalPrice, address, city, shippingDate, orderDate, endCreditCard)
            VALUES
            (${req.body.customerID},${req.body.cartID},${req.body.finalPrice},'${req.body.address}','${req.body.city}','${req.body.dateShipping}','${new Date().toLocaleDateString()}',${last});
            UPDATE carts SET isOpen = 0 WHERE cartID = ${req.body.cartID};
            `
    connection.query(sql, (err, result) => {
        if (err) throw err
        const sql = `SELECT productID, quantity FROM cartsdetails WHERE cartID = ${req.body.cartID}`
        connection.query(sql, (err, result) => {
            if (err) throw err
            quantity = result
            let sql = ''
            quantity.map(p => sql += `UPDATE products SET UnitsInStock = UnitsInStock - ${p.quantity} WHERE productID = ${p.productID};`)
            connection.query(sql, (err, result) => {
                if (err) throw err
                res.json({ success: true, msg: `you're order received` })
            })
        })
        // res.json(result)
    })
}

const save = (req, res) => {
    const sql = `SELECT p.productName, c.quantity, p.unitPrice, c.finalPrice
    FROM cartsdetails c
    INNER JOIN products p
    ON p.productID = c.productID
    WHERE c.cartID = ${req.params.id}
    ORDER BY p.productName    
    `
    // const sql = `SELECT p.productName, c.quantity, p.unitPrice, c.finalPrice
    // INTO OUTFILE '${t}\\orders.txt'
    // FROM cartsdetails c
    // INNER JOIN products p
    // ON p.productID = c.productID
    // WHERE c.cartID = ${req.params.id}
    // ORDER BY p.productName    
    // `
    connection.query(sql, (err, result) => {
        if (err) throw err
        let file = `
        Your order:\n
        product-name          quantity        unit-price         final-price`
        result.map(p => { file += `\n       ${p.productName}                    ${p.quantity}                 ${p.unitPrice}               ${p.finalPrice}` })
        console.log(file)
        fs.writeFile(process.cwd() + `\\public\\myorder.txt`, file, (err) => {
            if (err) throw err
            // console.log(process.cwd() + `\\public\\myorder.txt`)
            // window.location.href = process.cwd() + `\\public\\myorder.txt`
            // path.basename(process.cwd() + `\\public\\myorder.txt`)
            // fs.readFile(process.cwd() + `\\public\\myorder.txt`, (err) =>{
            //     if(err) throw err
            // })
            // res.sendFile(process.cwd() + `\\public\\myorder.txt`, (err)=>{
            // if(err)throw err
            // else console.log('object')
            // })
        })
        res.json(result)
    })
}

module.exports = { info, allProducts, getuser, checkShipDate, checkOut, save }