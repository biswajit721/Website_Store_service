import {  deleteUser, getAllUser, loginUser, logoutUser, registerUser, updateUser } from "../controllers/authController.js"
import express from "express"

const authRouter = express.Router()


authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/", getAllUser);
authRouter.delete("/:id",deleteUser)
authRouter.put("/:id",updateUser)

export default  authRouter

