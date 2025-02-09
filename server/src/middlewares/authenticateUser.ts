import { Token } from "@/types/user";
import { primsaClient } from "@/utils/prismaClient";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Token;
    if (!decoded) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const user = await primsaClient.user.findUnique({
      where: { id: decoded.userId },
    });
    req.user = user;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default authenticateUser;
