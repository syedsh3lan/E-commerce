import { Router } from "express";
import * as controller from "./address.controller.js"
import { auth, errorHandle } from "../../Middlewares/index.js";



const addressRouter = Router()


addressRouter.post("/addAddress" ,auth() ,errorHandle(controller.addAddress))
addressRouter.put("/updateAddress/:addressId" ,auth() ,errorHandle(controller.updateAddress))





export {addressRouter}