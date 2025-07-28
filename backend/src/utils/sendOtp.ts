import nodemailer from 'nodemailer';

// For development/testing - creates a test account
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// For production - use Gmail
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOtp = async (to: string, otp: string) => {
  try {
    const transporter = process.env.NODE_ENV === 'production' 
      ? createGmailTransporter() 
      : await createTestAccount();
    
    const info = await transporter.sendMail({
      from: process.env.NODE_ENV === 'production' ? process.env.EMAIL_USER : '"Test" <test@example.com>',
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your <b>OTP</b> code is: <strong>${otp}</strong></p>`,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Test email sent:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
};
