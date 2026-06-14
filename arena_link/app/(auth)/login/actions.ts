"use server";

import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
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
  } catch (error) {
    if (error instanceof AuthError) {
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
