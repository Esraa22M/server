import { Router } from "express";
import User from "#/models/users";
const authRoutes = Router();
authRoutes.post("/create", async(req, res) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    const user =await User.create({name, email, password });
    res.json({user})
});
export default authRoutes;  