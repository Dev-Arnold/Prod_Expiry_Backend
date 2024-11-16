import express from 'express'
import { addProduct, allProducts, deleteProduct, expiredProducts, getProductsWithExpiry, non_expired, updateProduct } from '../controllers/productController.js'
import authorize from '../middlewares/aurhorize.js'

const router = express.Router()


router.post('/',authorize(['Admin','Staff']),addProduct) // add new product

router.get('/',authorize(['Admin','Staff']),allProducts) // get list of all products

router.put('/:id',authorize(['Admin','Staff']),updateProduct)

router.delete('/:id',authorize(['Admin']),deleteProduct)

router.get('/non-expired',authorize(['Admin','Staff']), non_expired);

router.get('/expired',authorize(['Admin','Staff']) , expiredProducts);

router.get('/expiresoon',authorize(['Admin','Staff']) ,getProductsWithExpiry);


export default router
// {
//     "productName":"Paracetamol",
//     "expiryDate":"2025-08-10",
//     "quantity":23,
//     "price":1200,
//     "category":"Pharmacy",
//     "isExpired":false,
//     "isAvailable":true,
//     "location":"Top shelf"
// }