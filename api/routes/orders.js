const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/order');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.get_Single_Order);

router.delete('/:orderId', checkAuth, OrdersController.delete_Order);

module.exports = router;