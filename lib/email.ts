import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail/SMTP user
        pass: process.env.EMAIL_PASS, // Your App Password (not your Gmail password)
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return { success: false, error };
    }
};
