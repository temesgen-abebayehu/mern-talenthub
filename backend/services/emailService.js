
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

    const resetUrl = `https://talenthub-ust6.onrender.com//reset-password?token=${token}`;
    const mailOptions = {
        from: `TalentHub <${FROM_EMAIL}>`,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };

    await transporter.sendMail(mailOptions);
}

// Send email verification link
export async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const verifyUrl = `https://talenthub-ust6.onrender.com//verify-email?email=${email}&token=${token}`;
    const mailOptions = {
        from: `TalentHub <${FROM_EMAIL}>`,
        to: email,
        subject: 'Verify your email address',
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`
    };
    await transporter.sendMail(mailOptions);
}

// Send company approval/rejection notification
export async function sendCompanyApprovalEmail(email, approved, reason = '') {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    let subject, html;
    if (approved) {
        subject = 'Your company has been approved!';
        html = `<p>Congratulations! Your company registration has been approved. You can now post jobs on TalentHub.</p>`;
    } else {
        subject = 'Your company registration was rejected';
        html = `<p>Unfortunately, your company registration was rejected. Reason: ${reason}</p>`;
    }
    const mailOptions = {
        from: `TalentHub <${FROM_EMAIL}>`,
        to: email,
        subject,
        html
    };
    await transporter.sendMail(mailOptions);
}
