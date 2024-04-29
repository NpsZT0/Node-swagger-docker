const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const dotenv = require('dotenv');
dotenv.config();

const productRoutes = require('./api/routes/products');
const authRoutes = require('./api/routes/auth');

try {
    const db_uri = process.env.MONGO_ATLAS_PW ? 
    'mongodb+srv://nodejs:' + process.env.MONGO_ATLAS_PW + '@node-restapi-shop.bbxnai7.mongodb.net/':
    process.env.MONGO_URI;
    mongoose.connect(
        db_uri
    );
} catch (err) {
    console.log('err');
}

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/auth', authRoutes);
app.use('/products', productRoutes)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;