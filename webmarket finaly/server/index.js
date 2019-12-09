const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
// const fs = require('fs')
const routes = require('./routes/routes');
const users = require('./routes/users');
const db = require('./routes/database');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())

//routes
// app.use('/', public)
app.use('/api', routes)
app.use('/users', users)
app.use('/database', db)

//mongoDB
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('connected to database: ' + config.database);
});    
mongoose.connection.on('error', (err) => {
    console.log('database error: ' + err);
});    

//login with passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => console.log('the server side runing on port', port));