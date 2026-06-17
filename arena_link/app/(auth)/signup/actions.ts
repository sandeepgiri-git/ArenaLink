"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateAndSendOTP } from "@/lib/actions/verification";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .trim(),
    email: z.string().email("Please enter a valid email").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
  requiresVerification?: boolean;
  email?: string;
};

export async function registerUser(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  // 1. Validate input
  const validatedFields = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 2. Connect to database
    await connectDB();

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    
    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingUser) {
      if (existingUser.emailVerified) {
        return {
          errors: { email: ["An account with this email already exists"] },
          message: "Email already in use.",
        };
      } else {
        // User exists but hasn't verified email. Update their details and resend OTP.
        existingUser.name = name;
        existingUser.password = hashedPassword;
        await existingUser.save();
      }
    } else {
      // 5. Create user (emailVerified will be null by default based on schema)
      await User.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    // 6. Generate and send OTP
    const otpResult = await generateAndSendOTP(email, name);

    if (!otpResult.success) {
      return {
        message: "Account created but failed to send verification email.",
        success: true, // It did create the account, so technically a success, they can request another OTP
        requiresVerification: true,
        email,
      };
    }

    return { 
      success: true, 
      requiresVerification: true,
      email,
      message: "Please check your email to verify your account." 
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      message: "Something went wrong. Please try again.",
    };
  }
}
