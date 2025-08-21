
import nodemailer from 'nodemailer';
import { FROM_EMAIL } from '../config/constants.js';

export async function sendResetPasswordEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const resetUrl = `https://your-frontend-url.com/reset-password?token=${token}`;
    const mailOptions = {
        from: `TalentHub <${FROM_EMAIL}>`,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };

    await transporter.sendMail(mailOptions);
}
