import Product from '../models/product.js'

const addProduct = async (req,res,next)=>{
    try {
        console.log('Authorization Header:', req.headers.authorization);
        const {productName,expiryDate,quantity,price,category,isExpired,isAvailable,location} = req.body


        const isProductExpired = (expiryDate) => {
            const today = new Date();
            return new Date(expiryDate) < today;
        };
        
        const product = new Product({
            productName,
            expiryDate,
            quantity,
            price,
            category,
            isExpired:isProductExpired(expiryDate),
            isAvailable,
            location
        })
        

        console.log(product)

        if(!product) return res.status(400).json({message:"Error while adding product"})

        await product.save()

        res.status(201).json({message:"Product added successfully"})
    } catch (error) {
        console.log(`Error while adding prod : ${error}`)
        next(error)
    }
}

const allProducts = async (req,res,next)=>{
    try {
        console.log('Authorization Header:', req.headers.authorization);
        const allProd = await Product.find()

        if(!allProd) return res.status(404).json({message:"No product found"})

        res.status(201).json(allProd)

    } catch (error) {
        console.log(`Error while fetching products: ${error}`)
        next(error)
    }
}

const deleteProduct = async (req,res,next) =>{
    try {
        const {id} = req.params;

        const delProd = await Product.findByIdAndDelete(id)

        if(!delProd) return res.status(404).json({message:"product not found"})
        
        const currentProds = await Product.find();
        res.status(201).json({message:"Product deleted successfully", currentProds})

    } catch (error) {
        console.log(`Error while deleting Product ${error}`)
        next(error)
    }
}

const updateProduct = async (req,res,next)=>{
    try {
        const {id} = req.params;

        const updatedData = req.body;

        const updatedProd = await Product.findByIdAndUpdate(id,updatedData,{new:true})

        if(!updatedProd) return res.status(404).json({message:"Product not found"})
                
        const currentProds = await Product.find();

        res.status(201).json({message:"Product updated successfully", currentProds})
        
    } catch (error) {
        console.log(`Error while updating : ${error}`);
        next(error)
    }
}

const expiredProducts = async (req,res)=>{
    const expiredProducts = await Product.find({ isExpired: true });
    res.json(expiredProducts);
}

const non_expired = async (req,res)=>{
    const expiredProducts = await Product.find({ isExpired: true });
    res.json(expiredProducts);
}


// Endpoint to get products with days left till expiry
const getProductsWithExpiry = async (req, res, next) => {
    try {
        const products = await Product.find();
        
        // Today's date
        const today = new Date();

        // Map over products to add days left and warning flag
        const productsWithExpiry = products.map(product => {
            // Calculate the difference in days between today and the expiry date
            const expiryDate = new Date(product.expiryDate);
            const timeDiff = expiryDate - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

            // Attach daysLeft and a warning message if within 5 days
            return {
                ...product._doc, // Spread existing product data
                daysLeft,
                isAboutToExpire: daysLeft > 0 && daysLeft <= 5, // True if 1-5 days left
                warning: daysLeft > 0 && daysLeft <= 5 ? "Expiring soon" : null
            };
        });

        res.status(200).json(productsWithExpiry);

    } catch (error) {
        console.error(`Error fetching products: ${error}`);
        next(error);
    }
};

export { addProduct, allProducts , deleteProduct , updateProduct , expiredProducts, non_expired , getProductsWithExpiry }