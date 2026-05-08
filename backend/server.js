import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connectDB } from './config/db.js';
import path from 'path'
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js';
import itemRouter from './routes/itemRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    "http://localhost:4000",
    'https://foodie-fenzy-admin-dashboard.vercel.app',
    "https://foodie-fenzy-food-delivery-website.vercel.app",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
].filter(Boolean).map(origin => origin.trim());

//  MIDDLEWARE
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        }
        else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// DATABASE
connectDB()

// ROUTES
app.use('/api/user', userRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/items', itemRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
    res.send('API WORKING')
})

// app.listen(port, () => {
//     console.log(`Server Started on http://localhost:${port}`);
    
// })

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port}`);
    });
});
