import { createClerkClient } from "@clerk/backend";
import logger from "../utils/logger.js";


export async function getUserById(userId) {
 console.log("Using Clerk key:", process.env.CLERK_SECRET_KEY);
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
  try {
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      const error = new Error(`User with ID '${userId}' not found`);
      error.status = 404;
      throw error;
    }
    return user;
  } catch (err) {
    logger.error(`Error fetching user ${userId}: ${err.message}`);
    throw err;
  }
}
