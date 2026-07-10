import { prisma } from "@/lib/prisma";
import { AuthProvider } from "@/lib/generated/prisma/enums";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export interface OAuthProfile {
  providerAccountId: string;
  email: string;
  name: string;
  avatar?: string;
}

/**
 * Register a new user with email and password.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  // Check if the email is already taken
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      provider: AuthProvider.EMAIL,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      provider: true,
    },
  });

  return user;
}

/**
 * Authenticate a user with email and password.
 */
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password.");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
  };
}

/**
 * Find an existing user by OAuth provider or create a new one.
 * If the user signed up with email but tries OAuth with the same email,
 * we link the account.
 */
export async function findOrCreateOAuthUser(
  provider: AuthProvider,
  profile: OAuthProfile
) {
  // First check if we already have a linked account for this provider+id
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId: profile.providerAccountId,
      },
    },
    include: { user: true },
  });

  if (existingAccount) {
    // Update user info from provider (name/avatar may have changed)
    const updatedUser = await prisma.user.update({
      where: { id: existingAccount.userId },
      data: {
        name: profile.name || existingAccount.user.name,
        avatar: profile.avatar || existingAccount.user.avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        provider: true,
      },
    });
    return updatedUser;
  }

  // Check if a user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (existingUser) {
    // Link the OAuth account to the existing user
    await prisma.account.create({
      data: {
        userId: existingUser.id,
        provider,
        providerAccountId: profile.providerAccountId,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        avatar: profile.avatar || existingUser.avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        provider: true,
      },
    });
    return updatedUser;
  }

  // Create a new user + account in a transaction
  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        provider,
        emailVerified: true, // OAuth emails are verified by provider
      },
    });

    await tx.account.create({
      data: {
        userId: user.id,
        provider,
        providerAccountId: profile.providerAccountId,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
    };
  });

  return newUser;
}

/**
 * Get a user by their ID (for session verification).
 */
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      provider: true,
    },
  });
}
