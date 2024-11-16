import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Product from '../models/product.js';
import dotenv from 'dotenv';
dotenv.config();

// Configure NodeMailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Run the job every day at midnight
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    
    try {
        const products = await Product.find();

        // Filter products that will expire in 5 days or less
        const expiringSoonProducts = products.filter(product => {
            const expiryDate = new Date(product.expiryDate);
            const timeDiff = expiryDate - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            return daysLeft > 0 && daysLeft <= 5;
        });

        if (expiringSoonProducts.length > 0) {
            const emailRecipients = [
                'igbinakearnold@gmail.com', // Admin email
                'current.staff@example.com' // Replace this with the logged-in staff's email
            ];

            // Send an email for each expiring product
            expiringSoonProducts.forEach(product => {
                const expiryDate = new Date(product.expiryDate).toDateString();

                const mailOptions = {
                    from: 'your-email@gmail.com',
                    to: emailRecipients,
                    subject: `Product Expiry Alert: ${product.productName}`,
                    text: `Alert! The product "${product.productName}" is expiring on ${expiryDate}. Please take necessary actions.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(`Error sending email for product ${product.productName}:`, error);
                    } else {
                        console.log(`Email sent for product ${product.productName}:`, info.response);
                    }
                });
            });
        }
        
        console.log("Product expiry statuses checked and alerts sent if needed.");
        
    } catch (error) {
        console.error("Error in expiry alert cron job:", error);
    }
});
