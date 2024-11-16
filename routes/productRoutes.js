import express from 'express'
import { addProduct, allProducts, deleteProduct, expiredProducts, getProductsWithExpiry, non_expired, updateProduct } from '../controllers/productController.js'
import authorize from '../middlewares/aurhorize.js'

const router = express.Router()


router.post('/',addProduct) // add new product

router.get('/',authorize(['Admin']),allProducts) // get list of all products

router.put('/:id',authorize(['Admin','Staff']),updateProduct)

router.delete('/:id',deleteProduct)

router.get('/non-expired', non_expired);

router.get('/expired', expiredProducts);

router.get('/expiresoon', getProductsWithExpiry);


export default router
// {
//     "productName":"Paracetamol",
//     "expiryDate":"2025-08-10",
//     "quantity":23,
//     "price":1200,
//     "category":"Pharmacy",
//     "isExpired":false,
//     "isAvailable":true,
//    