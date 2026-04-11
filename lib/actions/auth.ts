import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function registerUser(values: {
  email: string;
  password: string;
  name: string;
  role: string;
}) {
  const { email, password, name, role } = values;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
    },
  });

  return { success: "User created!" };
}
