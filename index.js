import express from 'express'
const app = express()
import connect from './dbConfig/dbconfig.js'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import './cron/expiryAlertJob.js'
import './cron/expiryUpdate.js'
const port = process.env.PORT || 3000
import dotenv from 'dotenv';
dotenv.config();
app.use(express.json());  

connect()

app.use(cors({
    // origin: '*',
    origin: 'http://localhost:5173' // Allow only this origin
}));

app.use('/api/product', productRoutes);

app.use('/api/user',userRoutes)

app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Mongodb running on port ${port}`)
})
