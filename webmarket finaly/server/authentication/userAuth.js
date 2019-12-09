const bcrypt = require('bcryptjs');
const connection = require('../db');

getUserByEmail = (email, callback) => {
    const query = { email: email };
    const sql = `SELECT * FROM customers WHERE email = '${query.email}'`
    connection.query(sql, callback, (err, result) => {
        if (err) throw err;
    });
};

addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            let sql = `INSERT INTO customers(customerID, firstName, lastName, email, address, city, password)
            VALUES
            (${newUser.ID}, '${newUser.fName}', '${newUser.lName}', '${newUser.email}', '${newUser.address}', '${newUser.city}', '${newUser.password}')`;
            connection.query(sql, callback, (err, result) => {
                if (err) throw err;
            });
        });
    });
};

comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword.toString(), hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports = { getUserByEmail, addUser, comparePassword }