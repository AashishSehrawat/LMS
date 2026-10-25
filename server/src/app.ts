import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import ApiError from "./utils/ApiError.js";
dotenv.config();

import connectDB from "./db/dbConnect.js";

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
    origin: [process.env.CLIENT_URI as string, "http://localhost:5173"],
    credentials: true,
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
app.use('/api/order', paymentRoutes);
app.use('/api/review', reviewRoutes);

// Global error handler — catches all thrown ApiErrors from async controllers
// Must be registered AFTER all routes with exactly 4 arguments (err, req, res, next)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err?.message || "Internal Server Error";
  console.error("Global error handler caught:", message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err?.errors || [],
  });
});

export default app;