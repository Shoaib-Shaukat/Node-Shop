const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    //accept a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    //reject a file
    else {
        cb(null, false);
    }
}
const upload = multer({
    fileFilter: fileFilter,
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    }
});
router.get('/', ProductsController.get_All_Products);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.add_product);

router.get('/:productId', ProductsController.get_single_product);

router.patch('/:productId', checkAuth, ProductsController.patch_product);

router.delete('/:productId', checkAuth, ProductsController.delete_product);

module.exports = router;