const config = require("../config/database");
const jwt = require("jsonwebtoken");
const auth = require("../authentication/userAuth");
const connection = require('../db');

const webmarket = (req, res) => {
  jwt.verify(req.token, config.secret, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        msg: "Start shopping...",
        authData
      });
    }
  })
};

const login = (req, res) => {
  const userMail = req.body.email;
  const password = req.body.password;
  auth.getUserByEmail(userMail, (err, user) => {
    if (user === undefined) return res.json({ success: false, msg: "user not found" })
    user = user[0];
    if (err) throw err;
    if (!user) return res.json({ success: false, msg: "user not found" });
    auth.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 604800 //one week
        });
        res.json({
          success: true,
          token: token,
          user: {
            ID: user.customerID,
            password: user.password,
            fName: user.firstName,
            lName: user.lastName,
            email: user.email,
            address: user.address,
            city: user.city,
            admin: user.admin
          }
        });
      } else return res.json({ success: false, msg: "wrong password" });
    });
  });
};

const checkID = (req, res) => {
  let sql = `SELECT * FROM customers WHERE customerID = ${req.params.id}`
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length) {
      res.json({ success: false, msg: 'this ID is already exists' })
    } else {
      let sql = `SELECT * FROM customers WHERE email = '${req.params.email}'`
      connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length) {
          res.json({ success: false, msg: 'this email is already exists' })
        } else {
          res.json({ success: true, msg: 'the ID and email is OK' })
        }
      })
    }
  })
}

const register = (req, res) => {
  let newUser = ({
    ID,
    password,
    fName,
    lName,
    email,
    address,
    city
  } = req.body);
  auth.addUser(newUser, (err, result) => {
    if (err) {
      res.json({ success: false, msg: "failed to register user" + err });
    } else {
      res.json({ success: true, msg: "user registered", result });
    }
  })
};

//authentication
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    console.log('oops! wrong token');
    res.sendStatus(403);
  }
};

module.exports = { webmarket, login, verifyToken, checkID, register }