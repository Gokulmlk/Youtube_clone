import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorMiddleware.js";


// Route imports
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express()

// CORS - allow frontend origin
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


//API Routes
app.use("/api/auth", authRoutes);


// Global Error Handler 

app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Server is runningin ${PORT}` )
})