import axios from "axios";

interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification(
  tokens: string[],
  message: PushMessage,
) {
  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title: message.title,
    body: message.body,
    data: message.data ?? {},
    priority: "high",
  }));

  try {
    const response = await axios.post(process.env.EXPO_PUSH_URL!, messages, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Push sent: ", response.data);
  } catch (err) {
    console.error("Push notification failed: ", err);
  }
}
