import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

import ErrorMiddleware from "@/middlewares/ErrorMiddleWare";
import authenticateUser from "./middlewares/authenticateUser";

import AuthRoutes from "@/routes/Auth";
import VideoRoutes from "@/routes/Video";

app.use("/api/auth", AuthRoutes);
app.use("/api/videos", authenticateUser, VideoRoutes);

app.use(ErrorMiddleware);

app.listen(process.env.PORT, () =>
  console.log(`http://localhost:${process.env.PORT}`)
);
