import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://texhunt-8m9k.vercel.app",
    "https://texhunt-zlly-fawn.vercel.app"
]

// Middleware
app.use(cors({
    origin: true, // Automatically reflects request origin (supports https://www.texhunt.shop, localhost, vercel previews, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token", "Origin", "Accept", "X-Requested-With"]
}))
app.use(express.json())

// Ensure MongoDB is connected before handling any requests (serverless requirement)
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (err) {
        console.error("DB connection error:", err)
        return res.status(500).json({
            success: false,
            message: `Database connection failed: ${err.message}. Make sure MongoDB Atlas Network Access allows 0.0.0.0/0 (all IPs) and environment variables are set in Vercel.`
        })
    }
})
// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
    res.send('TexHunt API is running successfully')
})

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => console.log('Server started on port : ' + port))
}

export default app

