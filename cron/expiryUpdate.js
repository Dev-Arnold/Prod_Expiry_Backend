import cron from 'node-cron';
import Product from '../models/product.js'

// Run the job every day at midnight
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    await Product.updateMany(
        { expiryDate: { $lt: today } },
        { $set: { isExpired: true } }
    );
    console.log("Product expiry statuses updated");
});
