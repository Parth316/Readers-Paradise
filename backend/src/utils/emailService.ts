import nodemailer from "nodemailer";
// Generate a 4-digit reset code
export const generateResetCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send email using Nodemailer
export const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string }) => {
  // Create a transporter object using SMTP
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
    auth: {
      user:process.env.email,// Your email address
      pass: process.env.password // Your email password or app-specific password
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Recipient address
    subject, // Email subject
    text, // Email body (plain text)
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};