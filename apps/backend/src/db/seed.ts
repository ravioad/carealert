import bcrypt from "bcryptjs";
import { db } from "./client";
import { users } from "./schema";

async function seed() {
  const password = await bcrypt.hash("demo1234", 10);
  await db
    .insert(users)
    .values({
      email: "staff@demo.com",
      password,
      name: "Demo Staff",
    })
    .onConflictDoNothing();

  console.log("✅ Seeded demo user: staff@demo.com / demo1234");
  process.exit(0);
}

seed();
