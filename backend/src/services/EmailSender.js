const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yami.sp173@gmail.com',
        pass: 'fhtr nzop dptz wudv'
    }
});


const emailStyles = `
    <style>
        .container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
        }
        .header {
            color: #4F46E5;
            margin-bottom: 20px;
            text-align: center;
        }
        .content {
            margin: 20px 0;
            line-height: 1.5;
        }
        .otp-code {
            color: #4F46E5;
            letter-spacing: 5px;
            text-align: center;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
    </style>
`;
const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Password Reset OTP',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password. Your OTP is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px; text-align: center; padding: 20px;">
                    ${otp}
                </h1>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error('Send email error', error);
        return false;
    }
}

const sendAuthenticate = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Two-Factor Authenticate OTP',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Two-Factor Authenticate OTP</h2>
                <p>Your OTP is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px; text-align: center; padding: 20px;">
                    ${otp}
                </h1>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error('Send email error', error);
        return false;
    }
}

const sendTicketNotification = async (to, subject, message_content, description) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: `
        ${emailStyles}
        <div class="container">
            <h2 class="header">${subject}</h2>
            <div class="content">
            <br/>
                <p><strong>Description:</strong><br>${description}</p>
                <p><strong>Message:</strong><br>${message_content}</p>
            </div>
            <div class="footer">
                <p>This is an automated notification from the support system.</p>
                <p>If you need help, please reply to this ticket in the support portal.</p>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error('Send email error:', error);
        return false;
    }
}

const changePasswordNotification = async (to, newPassword) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Password Change Notification',
        html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
            <h2 style="color:#4F46E5; text-align:center;">Password Change Notification</h2>
            <p>Your password has been changed by our system.</p>
            <p style="text-align:center; margin-bottom:0;">Your new password is:</p>
            <h1 style="color:#4F46E5; letter-spacing:5px; text-align:center; padding:20px 0;">
                ${newPassword}
            </h1>
            <p>If you didn't request this, please contact support immediately.</p>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error('Send email error', error);
        return false;
    }
}

module.exports = {
    sendOTPEmail,
    sendAuthenticate,
    sendTicketNotification,
    changePasswordNotification
};
