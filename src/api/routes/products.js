const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const csvtojson = require('csvtojson');
const verifyToken = require('../middleware');

const Product = require('../models/product');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - Seed_RepDate
 *         - Seed_Year
 *         - Seeds_YearWeek
 *         - Seed_Varity
 *         - Seed_RDCSD
 *         - Seed_Stock2Sale
 *         - Seed_Season
 *         - Seed_Crop_Year
 *       properties:
 *         Seed_RepDate:
 *           type: string
 *         Seed_Year:
 *           type: string
 *         Seeds_YearWeek:
 *           type: string
 *         Seed_Varity:
 *           type: string
 *         Seed_RDCSD:
 *           type: string
 *         Seed_Stock2Sale:
 *           type: string
 *         Seed_Season:
 *           type: string
 *         Seed_Crop_Year:
 *           type: string
 *       example:
 *         Seed_RepDate: "2021-07-01"
 *         Seed_Year: "2021"
 *         Seeds_YearWeek: "2021-27"
 *         Seed_Varity: "Varity"
 *         Seed_RDCSD: "RDCSD"
 *         Seed_Stock2Sale: "Stock2Sale"
 *         Seed_Season: "Season"
 *         Seed_Crop_Year: "Crop_Year"
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products:
 *  get:
 *    tags: [Products]
 *    summary: Get a list of products
 *    description: Get a list of products from a database
 *    parameters:
 *      - in: header
 *        name: Auth
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: A list of products
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
*                 $ref: '#/components/schemas/Product'
 *      500:
 *        description: An error occurred
 *      401:
 *        description: Unauthorized
 */
router.get('/', verifyToken, (req, res, next) => {
    Product.find()
        .exec()
        .then((docs) => {
            console.log("Docs:", docs);
            res.status(200).json(docs);
        })
        .catch((err) => {
            console.log("Error:", err);
            res.status(500).json({
                error: err
            })
        });
});

/**
 * @swagger
 * /products/{_id}:
 *  get:
 *    tags: [Products]
 *    summary: Get a product by ID
 *    description: Get a specific product from a database
 *    parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID of product to return
 *      - in: header
 *        name: Auth
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: A details of products
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      500:
 *        description: An error occurred
 *      401:
 *        description: Unauthorized
 */
router.get('/:_id', verifyToken, (req, res, next) => {
    const { _id } = req.params;
    console.log(_id);
    Product.findById(_id)
        .exec()
        .then((doc) => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

/**
 * @swagger
 * /products:
 *  post:
 *    tags: [Products]
 *    summary: Insert a product
 *    description: Insert a product into database
 *    parameters:
 *      - in: header
 *        name: Auth
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: A details of products that inserted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      500:
 *        description: An error occurred
 *      401:
 *        description: Unauthorized
 */
router.post('/', verifyToken, (req, res, next) => {
    const { Seed_RepDate, Seed_Year, Seeds_YearWeek, Seed_Varity, Seed_RDCSD, Seed_Stock2Sale, Seed_Season, Seed_Crop_Year } = req.body;
    const product = new Product({
        _id: new mongoose.Types.UUID(),
        Seed_RepDate,
        Seed_Year,
        Seeds_YearWeek,
        Seed_Varity,
        Seed_RDCSD,
        Seed_Stock2Sale,
        Seed_Season,
        Seed_Crop_Year,
    })
    product.save()
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

/**
 * @swagger
 * /products/csv:
 *  post:
 *    tags: [Products]
 *    summary: Insert a product
 *    description: Insert a product into database
 *    parameters:
 *      - in: header
 *        name: Auth
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      request: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: A details of products that inserted
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *      500:
 *        description: An error occurred
 *      401:
 *        description: Unauthorized
 */
router.post('/csv', verifyToken, upload.single('file'), (req, res, next) => {
    csvtojson().fromFile(req.file.path).then(source => {
        console.log(source)
        Product.insertMany(source)
            .then((result) => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    });
});

/**
 * @swagger
 * /products/{_id}:
 *  put:
 *    tags: [Products]
 *    summary: Update a product by ID
 *    description: Update a specific product from a database
 *    parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID of product to update
 *      - in: header
 *        name: Auth
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: A details of products that updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      500:
 *        description: An error occurred
 *      401:
 *        description: Unauthorized
 */
router.put('/:_id', verifyToken, (req, res, next) => {
    const { _id } = req.params;
    const { Seed_RepDate, Seed_Year, Seeds_YearWeek, Seed_Varity, Seed_RDCSD, Seed_Stock2Sale, Seed_Season, Seed_Crop_Year } = req.body;
    Product.updateOne(
        { _id, },
        {
            $set: {
                Seed_RepDate,
                Seed_Year,
                Seeds_YearWeek,
                Seed_Varity, Seed_RDCSD,
                Seed_Stock2Sale,
                Seed_Season,
                Seed_Crop_Year
            }
        })
        .exec()
        .then((doc) => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

/**
 * @swagger
 * /products/{_id}:
 *  delete:
 *    tags: [Products]
 *    summary: Delete a product
 *    description: Delete a product into database
 *    parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID of product to return
 *      - in: header
 *        name: Auth
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: A message of products that deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      500:
 *        description: An error occurred
 *      401:
 *        description: Unauthorized
 */
router.delete('/:_id', verifyToken, (req, res, next) => {
    const { _id } = req.params;
    Product.deleteOne({ _id })
        .exec()
        .then((doc) => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;