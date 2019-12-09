const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// let userSchema = new mongoose.Schema({
//     id: { type: Number, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
//     confirmPassword: { type: String, required: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     street: { type: String, required: true },
//     city: { type: String, required: true }
// });

const userModel = mongoose.model('User', userSchema);

getUserById = (id, callback) => {
    userModel.findById(id, callback);
};

getUserByUsername = (username, callback) => {
    const query = { username: username };
    userModel.findOne(query, callback);
};

addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports = { userModel, getUserById, getUserByUsername, addUser, comparePassword }