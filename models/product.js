import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min: 0,
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    isExpired:{
        type:Boolean,
        required:false,
        default: false,
    },
    isAvailable:{
        type:Boolean,
        required:false,
        default: true,
    },
    location: {
        type: String,
        required: false
    }, 
},{timestamps:true});

export default mongoose.model('Product', productSchema);