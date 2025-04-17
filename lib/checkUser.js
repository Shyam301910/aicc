import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

// This function checks if a user is logged in using Clerk and retrieves or creates a user in the database(if not logged in).
export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    // If the user already exists in the database, return the existing user.
    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    
    // If the user does not exist in the database, create a new user.
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
