const express = require('express')
const router = express.Router();

const {getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct } = require('../controllers/productController') // getproduct function import gareko lekheko path bata.


const {isAuthenticatedUser,authorizeRoles} = require ('../middlewares/auth');


router.route('/products').get(isAuthenticatedUser,authorizeRoles('admin'),getProducts);
router.route('/product/:id').get(getSingleProduct);
 


router.route ('/admin/product/new').post(isAuthenticatedUser,newProduct) //admin le new product halna milne
router.route('/admin/product/:id')
.put(updateProduct)  //admin le product updte garna milne role
.delete(isAuthenticatedUser,deleteProduct); // since delete ra product ko dui tei ko route same xa .. update ra delete lai yesari haleko

module.exports = router; 