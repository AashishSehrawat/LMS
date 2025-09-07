import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Wrap in an async IIFE so we can use await.
const sendEmail = async ({ to, otp }: { to: string, otp: string }) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Reset your password",
        text: `Your OTP is ${otp}`,
        html: `<h1>Reset your password</h1>
        <p>Your OTP is ${otp}</p>
        <p>Thank you</p>`,
    });

    console.log("Message sent:", info.messageId);
};

export default sendEmail