import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorMiddleware.js";


// Route imports
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js"

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express()

// CORS - allow frontend origin
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
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
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);

//Health Check

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "YouTube Clone API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


// Global Error Handler 

app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Server is runningin ${PORT}` )
})

export default app;