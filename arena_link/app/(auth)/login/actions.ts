"use server";

import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { generateAndSendOTP } from "@/lib/actions/verification";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
  requiresVerification?: boolean;
  email?: string;
};

export async function loginUser(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // 1. Validate input
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, message: "Logged in successfully!" };
  } catch (error: any) {
    if (error instanceof AuthError) {
      const isVerificationError = 
        error.message?.includes("verification_required") || 
        error.cause?.err?.message === "verification_required";

      if (isVerificationError) {
        // Generate and send a new OTP
        await generateAndSendOTP(email, "Player");
        return {
          requiresVerification: true,
          email,
          success: true, // we don't want to show a red error, we just want to redirect
        };
      }

      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password.",
          };
        default:
          return {
            message: "Something went wrong. Please try again.",
          };
      }
    }

    // Re-throw non-auth errors (e.g. redirect errors from Next.js)
    throw error;
  }
}
