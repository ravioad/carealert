import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import alertRoutes from "./routes/alerts";
import { startAlertGenerator } from "./services/alertGenerator";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/alerts", alertRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startAlertGenerator();
});
