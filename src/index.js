import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? "https://job-tracker-zeta-sepia.vercel.app/login" 
    : "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/applications", applicationsRoutes);
app.use("/auth", authRoutes);
app.get("/health", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({ db: "ok", result });
  } catch (err) {
    res.status(500).json({ db: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));