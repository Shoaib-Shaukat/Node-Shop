const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');



router.post('/signup', UsersController.user_signup);

router.post('/login', UsersController.user_login);

router.delete('/:userId', checkAuth, UsersController.delete_user);


module.exports = router;