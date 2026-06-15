import connectDB from "@/lib/db";
import RateLimit from "@/models/RateLimit";

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Checks if an action has exceeded its rate limit.
 * If not exceeded, increments the counter.
 * If exceeded, throws a RateLimitError.
 * 
 * @param key The unique identifier for the action (e.g., "login_email@example.com")
 * @param maxLimit Maximum number of allowed actions within the window
 * @param windowInSeconds How long until the limit resets (e.g., 60 for 1 minute)
 */
export async function checkRateLimit(key: string, maxLimit: number, windowInSeconds: number): Promise<void> {
  await connectDB();

  const now = new Date();
  
  // Find the current record
  const record = await RateLimit.findOne({ key });

  if (record) {
    if (record.count >= maxLimit) {
      throw new RateLimitError(`Rate limit exceeded. Please try again later.`);
    }

    // Increment count
    await RateLimit.updateOne({ key }, { $inc: { count: 1 } });
  } else {
    // Create new record
    const expiresAt = new Date(now.getTime() + windowInSeconds * 1000);
    await RateLimit.create({
      key,
      count: 1,
      expiresAt,
    });
  }
}

/**
 * Resets a rate limit counter (useful upon successful login)
 */
export async function resetRateLimit(key: string): Promise<void> {
  await connectDB();
  await RateLimit.deleteOne({ key });
}
