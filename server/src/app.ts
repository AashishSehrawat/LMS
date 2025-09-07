import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/dbConnect.js";
import session from "express-session";
import cookieParser from "cookie-parser";
dotenv.config();


// routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import lectureRoutes from "./routes/lecture.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";

connectDB();

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
}));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/lecture', lectureRoutes);
app.use('/api/order', paymentRoutes)
app.use('/api/review', reviewRoutes)


export default app;