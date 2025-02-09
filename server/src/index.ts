import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

import AuthRoutes from "@/routes/Auth";
import ErrorMiddleware from "@/middlewares/ErrorMiddleWare";

app.use("/api/auth", AuthRoutes);

app.use(ErrorMiddleware);

app.listen(process.env.PORT, () =>
  console.log(`http://localhost:${process.env.PORT}`)
);
