const express = require("express");
const webpush = require("web-push");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

app.get("/", (req, res) => res.send("Daily Wellness Push Server is running"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Daily Wellness Push Server" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Daily Wellness Push Server" });
});

app.get("/api/vapid-public-key", (req, res) => {
  if (!VAPID_PUBLIC_KEY) {
    return res.status(503).json({ error: "VAPID_PUBLIC_KEY is not configured" });
  }
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: "Invalid push subscription" });
  }
  res.status(201).json({ success: true, message: "Push subscription received" });
});

app.post("/api/test-push", async (req, res) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(503).json({ error: "VAPID keys are not configured" });
  }
  const subscription = req.body?.subscription;
  if (!subscription?.endpoint) {
    return res.status(400).json({ error: "subscription is required" });
  }
  const payload = JSON.stringify({
    title: "Daily Wellness 🔔",
    body: "This is a background push test notification.",
    url: "/"
  });
  try {
    await webpush.sendNotification(subscription, payload);
    res.json({ success: true });
  } catch (error) {
    console.error("Push error:", error);
    res.status(500).json({ error: "Push delivery failed" });
  }
});

app.listen(PORT, () => console.log(`Daily Wellness Push Server running on port ${PORT}`));
