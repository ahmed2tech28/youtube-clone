import { Router } from "express";
import { register, login, getLoggedInUser } from "@/controllers/Auth";
import authenticateUser from "@/middlewares/authenticateUser";

const AuthRouter = Router();

AuthRouter.post("/signup", register);
AuthRouter.post("/signin", login);
AuthRouter.get("/me", authenticateUser, getLoggedInUser);

export default AuthRouter;
