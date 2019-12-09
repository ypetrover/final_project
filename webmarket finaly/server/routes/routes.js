const express = require('express');
const router = express.Router();
const handlers = require('../handlers/handlers')
const adminHandlers = require('../handlers/admin')
const webmarketHandlers = require('../handlers/webmarket')
const cartHandlers = require('../handlers/cart')

//home-page
router.get('/webmarket', handlers.verifyToken, (req, res) => {
    handlers.webmarket(req, res)
});

//Admin
router.get('/allproductsadmin', (req, res) => {
    adminHandlers.allProductsAdmin(req, res)
});

router.get('/admin', (req, res) => {
    adminHandlers.admin(req, res)
});

router.post('/addProducts', (req, res) => {
    adminHandlers.addProducts(req, res)
})

router.post('/updateproduct', (req, res) => {
    adminHandlers.updateProduct(req, res)
})

//register
router.post('/register', (req, res) => {
    handlers.register(req, res)
})

router.get('/checkID/:id/:email', (req, res) => {
    handlers.checkID(req, res)
})

//login
router.post('/login', (req, res) => {
    handlers.login(req, res)
});

//info
router.get('/info', (req, res) => {
    webmarketHandlers.info(req, res)
})

//webmarket
router.get('/allproducts', (req, res) => {
    webmarketHandlers.allProducts(req, res)
})

//cart
router.post('/cartisopen', (req, res) => {
    cartHandlers.cartIsOpen(req, res)
})

router.post('/createcart', (req, res) => {
    cartHandlers.createCart(req, res)
})

router.post('/addtocart', (req, res) => {
    cartHandlers.addToCart(req, res)
})

router.get('/cartsdetails/:id', (req, res) => {
    cartHandlers.cartDetails(req, res)
})

router.delete('/removeitem/:id/:cartID', (req, res) => {
    cartHandlers.removeItem(req, res)
})

router.delete('/dropcart/:id/:cartID', (req, res) => {
    cartHandlers.dropCart(req, res)
})

router.get('/getuser/:id', (req, res) => {
    webmarketHandlers.getuser(req, res)
})

router.get('/checkShipDate/:date', (req, res) => {
    webmarketHandlers.checkShipDate(req, res)
})

router.post('/check-out', (req, res) => {
    webmarketHandlers.checkOut(req, res)
})

router.get('/save/:id', (req, res) => {
    console.log(req.params)
    console.log(req.body)
    webmarketHandlers.save(req, res)
})

module.exports = router;