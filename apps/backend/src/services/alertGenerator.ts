import cron from "node-cron";
import { db } from "../db/client";
import { alerts, pushTokens } from "../db/schema";
import { sendPushNotification } from "./pushService";

const EVENT_TYPES = ["fall", "call_button", "unresponsive", "vitals"] as const;
const SEVERITIES = ["critical", "high", "medium"] as const;
const ROOMS = ["101", "102", "103", "104", "105", "201", "202", "203"];
const PATIENTS = [
  "John Smith",
  "Mary Johnson",
  "Robert Brown",
  "Patricia Davis",
  "James Wilson",
];

export async function generateAlert() {
  const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const roomNumber = ROOMS[Math.floor(Math.random() * ROOMS.length)];
  const patientName = PATIENTS[Math.floor(Math.random() * PATIENTS.length)];

  const [alert] = await db
    .insert(alerts)
    .values({
      eventType,
      severity,
      roomNumber,
      patientName,
    })
    .returning();

  console.log(
    `🚨 Alert generated: [${severity.toUpperCase()}] ${eventType} in room ${roomNumber}`,
  );

  // only push for critical and high
  if (severity === "critical" || severity === "high") {
    const tokens = await db.select().from(pushTokens);
    if (tokens.length > 0) {
      await sendPushNotification(
        tokens.map((t) => t.token),
        {
          title: `${severity === "critical" ? "🚨" : "⚠️"} ${eventType.replace("_", " ").toUpperCase()}`,
          body: `Room ${roomNumber} - ${patientName}`,
          data: { alertId: alert.id },
        },
      );
    }
  }
  return alert;
}

// Fire every 30 seconds
export function startAlertGenerator() {
  cron.schedule("*/30 * * * * *", async () => {
    await generateAlert();
  });
  console.log("⏱️  Alert generator started — firing every 30s");
}
