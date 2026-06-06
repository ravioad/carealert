import { text, uuid, pgTable, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomNumber: text("room_number").notNull(),
  patientName: text("patient_name").notNull(),
  eventType: text("event_type").notNull(), // 'fall' | 'call_button' | 'unresponsive' | 'vitals'
  severity: text("severity").notNull(), // 'critical' | 'high' | 'medium'
  status: text("status").notNull().default("active"),
  acknowledgedBy: uuid("acknowledged_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const pushTokens = pgTable("push_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  token: text("token").unique().notNull(),
  platform: text("platform").notNull(), // 'ios' | 'android'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
