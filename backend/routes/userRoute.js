import express from "express"
import { editProfile, login, logout, signup } from "../controllers/userController.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.post('/logout',logout)
userRouter.post('/profile/:id/edit',isAuthenticated,upload.single('profile'),editProfile)

export default userRouter