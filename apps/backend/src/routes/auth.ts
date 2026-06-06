import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/client";
import { users, pushTokens } from "../db/schema";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const router = Router();

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { email, password } = result.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

router.post("/push-token", requireAuth, async (req: AuthRequest, res) => {
  const { token, platform } = req.body;
  if (!token || !platform)
    return res.status(400).json({ error: "Missing token or platform" });

  await db
    .insert(pushTokens)
    .values({ userId: req.userId!, token, platform })
    .onConflictDoNothing();

  return res.sendStatus(200);
});

export default router;
