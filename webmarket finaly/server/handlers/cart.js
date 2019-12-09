const connection = require('../db');

let cartID;

const cartIsOpen = (req, res) => {
    const sql = `SELECT cartID FROM carts WHERE customerID = ${req.body.id} AND isOpen = 1`
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
}

const createCart = (req, res) => {
    // const dateTime = new Date().getTime()
    // console.log('111', dateTime)
    const sql = `INSERT INTO carts (customerID, createCartDate, dateTime)
    VALUES
    (${req.body.id} , '${new Date().toLocaleDateString()}', ${new Date().getTime()})`
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
}

const addToCart = (req, res) => {
    let unitPrice;
    const sql = `SELECT unitPrice FROM products WHERE productID = ${req.body.id};
                SELECT cartID FROM carts WHERE customerID = ${req.body.userID} AND isOpen = 1;
                SELECT productID FROM cartsdetails WHERE productID = ${req.body.id} AND cartID = ${req.body.cartID}`
    connection.query(sql, (err, result) => {
        if (err) throw err
        unitPrice = result[0][0].unitPrice
        cartID = result[1][0].cartID
        productID = 0
        !result[2].length ? productID = null : productID = result[2][0].productID
        const sql = `
                    UPDATE cartsdetails SET
                    quantity = CASE WHEN ${productID} = ${req.body.id} THEN ${req.body.value} ELSE quantity END,
                    finalPrice = CASE WHEN ${productID} = ${req.body.id} THEN ${unitPrice * req.body.value} ELSE finalPrice END
                    WHERE cartID = ${req.body.cartID} AND productID = ${productID}
                    `
        connection.query(sql, (err, result) => {
            if (err) throw err
            if (!result.changedRows) {
                const sql = `INSERT INTO cartsdetails(productID, quantity, finalPrice, cartID)
                            VALUES
                            (${req.body.id}, ${req.body.value}, ${unitPrice * req.body.value}, ${req.body.cartID})`
                connection.query(sql, (err, result) => {
                    if (err) throw err
                    res.json(result)
                })
            } else {
                res.json(result)
            }
        })
    })
}

const cartDetails = (req, res) => {
    const dateTime = new Date().getTime() - 604800000
    // console.log(dateTime)
    const sql = `SELECT * FROM carts WHERE customerID = ${req.params.id} AND isOpen = 1`
    connection.query(sql, (err, result) => {
        if (err) throw err
        console.log(result[0])
        console.log(result[0].createCartDate)
        if (result[0].dateTime < dateTime) {
            console.log('yapy................')
            const sql = `DELETE FROM carts WHERE dateTime < ${dateTime}`
            connection.query(sql, (err, result) => {
                if (err) throw err
                return
                // res.json({ msg: 'the old cart is dropped' })
            })
        }
        cartID = result[0].cartID;
        const sql = `
        SELECT p.productName, p.picture, cd.quantity, cd.finalPrice, cd.productID
        FROM products p
	        INNER JOIN cartsdetails cd ON p.productID = cd.productID
            INNER JOIN carts c ON cd.cartID = c.cartID
            WHERE c.cartID = ${cartID} AND p.UnitsInStock > 0
        ORDER BY p.productName
        `
        connection.query(sql, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}

const removeItem = (req, res) => {
    const sql = `DELETE FROM cartsdetails WHERE cartID = ${req.params.cartID} AND productID = ${req.params.id}`
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json({ msg: 'the product deleted', result })
    })
}

const dropCart = (req, res) => {
    const sql = `DELETE FROM carts WHERE customerID = ${req.params.id}`
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json({ msg: 'the cart deleted', result })
    })
}

module.exports = { cartIsOpen, createCart, addToCart, cartDetails, removeItem, dropCart }