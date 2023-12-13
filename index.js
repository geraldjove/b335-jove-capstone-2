const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
const port = 4000;
const passport = require("passport");
const session = require('express-session');
const cors = require("cors");
require("./passport");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// connect to mongoDB
mongoose.connect('mongodb+srv://admin:admin@capstone2.jqucj09.mongodb.net/capstone-2', {useNewUrlParser: true, useUnifiedTopology: true})

let db = mongoose.connection;

db.on('error', (error)=> {
    console.log('Error ' +  error);
})

db.once('open', ()=>{
    app.listen(port, ()=>{
        console.log('Listening to port', port)
    })
})

app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);
