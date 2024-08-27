import { Router } from "express";
import * as controller from "./user.controller.js"
import { errorHandle } from "../../Middlewares/index.js";




const userRouter = Router()

userRouter.post("/signUp" , errorHandle(controller.signUP))
userRouter.post("/login" , errorHandle(controller.login))




export {userRouter}