import { RequestHandler } from "express";
import { primsaClient } from "@/utils/prismaClient";
import { comparePassword, generateHashPassword } from "@/utils/password";
import jwt from "jsonwebtoken";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).json({ success: false, message: "Invalid email format" });
      return;
    }

    const existingUser = await primsaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res
        .status(400)
        .json({ success: false, message: "Email is already in use" });
      return;
    }

    const handle = email.split("@")[0];
    const hashPassword = await generateHashPassword(password);

    await primsaClient.user.create({
      data: { email, handle, password: hashPassword, profileImage: "" },
    });

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error: unknown) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    const user = await primsaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error: unknown) {
    next(error);
  }
};

export const getLoggedInUser: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error: unknown) {
    next(error);
  }
};
