import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import authRoute from "./routes/auth.routes.js";
import { connectToDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

//CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g., "http://localhost:5173"
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));
const uploadDir = path.join(__dirname, "uploads", "profile-photos");
mkdirSync(uploadDir, { recursive: true });

//Routes
app.use("/api/auth", authRoute);

//404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
  connectToDB();
});
