import { Router } from "express";
import { CreateUserSchema } from "#/utils/validationSchema";
import { validateRequest } from "#/middlewares/validator";
import { create } from "#/controllers/user";
const authRoutes = Router();
authRoutes.post("/create", validateRequest(CreateUserSchema),create);
export default authRoutes;  