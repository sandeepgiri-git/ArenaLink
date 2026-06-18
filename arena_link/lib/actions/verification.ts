"use server";

import connectDB from "@/lib/db";
import VerificationToken from "@/models/VerificationToken";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { checkRateLimit, RateLimitError } from "@/lib/rateLimit";

// Generate a random 6-digit string
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function generateAndSendOTP(email: string, name: string) {
  try {
    await connectDB();

    try {
      // Cooldown: Max 1 resend per 60 seconds
      await checkRateLimit(`otp_cooldown_${email}`, 3, 60);
      // Hourly limit: Max 3 resends per hour (3600 seconds)
      await checkRateLimit(`otp_resend_${email}`, 5, 3600);
    } catch (e) {
      if (e instanceof RateLimitError) {
        return { success: false, message: e.message };
      }
      throw e;
    }

    // 1. Delete any existing tokens for this email to prevent spam/confusion
    await VerificationToken.deleteMany({ email });

    // 2. Generate a new 6-digit OTP
    const otp = generateOTP();

    // 3. Hash the OTP for secure database storage
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // 4. Save to DB with a 15-minute expiration
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await VerificationToken.create({
      email,
      token: hashedOtp,
      expiresAt,
    });

    // 5. Send the email with the plain OTP
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #2e90fa;">Welcome to ArenaLink, ${name}!</h2>
        <p>Thank you for signing up. Please use the following 6-digit code to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="margin: 0; letter-spacing: 5px; color: #111827;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "ArenaLink - Your Verification Code",
      html: htmlBody,
    });

    return { success: true, message: "Verification code sent to your email." };
  } catch (error) {
    console.error("Failed to generate and send OTP:", error);
    return { success: false, message: "Failed to send verification code." };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    await connectDB();

    const tokenDoc = await VerificationToken.findOne({ email });

    if (!tokenDoc) {
      return { success: false, message: "Invalid or expired verification code." };
    }

    const isValid = await bcrypt.compare(otp, tokenDoc.token);

    if (!isValid) {
      tokenDoc.attempts += 1;
      
      if (tokenDoc.attempts >= 3) {
        await VerificationToken.deleteOne({ _id: tokenDoc._id });
        return { success: false, message: "Too many incorrect attempts. Please request a new code." };
      } else {
        await tokenDoc.save();
        return { success: false, message: `Incorrect verification code. ${3 - tokenDoc.attempts} attempts remaining.` };
      }
    }

    // Mark user as verified
    await User.findOneAndUpdate({ email }, { $set: { emailVerified: new Date() } });

    // Delete the token
    await VerificationToken.deleteOne({ _id: tokenDoc._id });

    return { success: true, message: "Email verified successfully!" };
  } catch (error) {
    console.error("Verification failed:", error);
    return { success: false, message: "An error occurred during verification." };
  }
}
