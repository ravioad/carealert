import { Router } from "express";
import { z } from "zod";
import { db } from "../db/client";
import { alerts } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const patchSchema = z.object({
  status: z.enum(["acknowledged", "resolved"]),
});

const routeParam = (value: string | string[]): string | undefined =>
  Array.isArray(value) ? value[0] : value;

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const status = (req.query.status as string) || "active";
  const rows = await db
    .select()
    .from(alerts)
    .where(eq(alerts.status, status))
    .orderBy(desc(alerts.createdAt));
  return res.json(rows);
});

router.get("/:id", async (req, res) => {
  const id = routeParam(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  return res.json(alert);
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = routeParam(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  const result = patchSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: "Invalid status" });

  const [updated] = await db
    .update(alerts)
    .set({
      status: result.data.status,
      acknowledgedBy: req.userId,
      updatedAt: new Date(),
    })
    .where(eq(alerts.id, id))
    .returning();
});

export default router;
