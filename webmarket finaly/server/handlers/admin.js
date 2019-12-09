const connection = require('../db');

const allProductsAdmin = (req, res) => {
    const sql = 'SELECT * FROM products'
    connection.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
}

const admin = (req, res) => {
    const sql = 'SELECT categoryID, categoryName, picture FROM categories'
    connection.query(sql, (err, result) => {
        if (err) throw err;
        // categories = result
        // categoriesNameToID = categories.map(item => {
        //     const container = {};
        //     container[item.categoryName] = item.categoryID;
        //     return container;
        // })
        res.json(result)
    });
}

const addProducts = (req, res) => {
    console.log(req.body)
    // req.body.map(p => {
    //     id = categoriesNameToID.find(category => category[p.category])
    //     return (p.category = id[p.category])
    // })
    let sql = '';
    for (let i = 0; i < req.body.length; i++) {
        sql += `INSERT INTO products(productName, categoryID, description, picture, unitPrice, UnitsInStock)
        VALUES
        ('${req.body[i].productName}', ${req.body[i].category}, '${req.body[i].description}','${req.body[i].picture}',${req.body[i].unitPrice},${req.body[i].unitsInStock || 0});`
    }
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result)
    });


}

const updateProduct = (req, res) => {
    console.log(req.body)
    const product = req.body
    const sql = `
    UPDATE products
    SET productName = '${product.productName}', categoryID = ${product.category}, description = '${product.description}', picture = '${product.picture}', unitPrice = ${product.unitPrice}, UnitsInStock = ${product.unitsInStock}
    WHERE productID = ${product.productID}`
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result)
    })
}


module.exports = { admin, allProductsAdmin, addProducts, updateProduct }