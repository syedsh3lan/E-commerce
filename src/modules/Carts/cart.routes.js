import { Router } from "express";
import * as controller from "./cart.controller.js"
import { auth ,errorHandle  } from "../../Middlewares/index.js";

const cartRouter = Router()

cartRouter.post("/addToCart/:productId" ,auth(),errorHandle(controller.addToCart) )
cartRouter.put("/removeFromCart/:productId" , auth(), errorHandle(controller.removeFromCart))
cartRouter.post("/updateCart/:productId" , auth(), errorHandle(controller.updateCart))






export {cartRouter}