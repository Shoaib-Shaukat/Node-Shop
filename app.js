const express = require('express');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://Shaoib:' + process.env.MONGO_ATLAS_PW + '@nodejsapp.n4eir.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // this makes a folder publicly available
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH');
        return res.status(200).json({});
    }
    next();
})
//Routes
app.use('/products', productRoutes);

app.use('/orders', orderRoutes);

app.use('/user', userRoutes);

//In case of error (Error Handling)


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;