const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('quantity product _id')
        .populate('product', '_id name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        quantity: doc.quantity,
                        product: doc.product,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()

        })
        .then(result => {
            res.status(201).json({
                message: 'Order placed successfully!',
                createdOrder: {
                    quantity: result.quantity,
                    product: result.product,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
}

exports.get_Single_Order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                message: 'Order Detail',
                order: order,
                request: {
                    type: 'GET',
                    url: 'http:localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Order not found',
                error: err
            });
        });

}

exports.delete_Order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted',
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/orders/',
                    body: { quantity: 'Number', productId: 'ID' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Order not found',
                error: err
            });
        });
}