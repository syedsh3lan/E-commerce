import { Router } from "express";
import * as controller from "./coupon.controller.js"
import { auth , errorHandle , validationMiddleware  } from "../../Middlewares/index.js";
import { createCouponSchema } from "./coupon.schema.js";

const couponRouter = Router()


couponRouter.post("/createCoupon",auth(),validationMiddleware(createCouponSchema),errorHandle(controller.createCoupon))
couponRouter.get("/getCoupons" , errorHandle(controller.getCoupons))
couponRouter.get("/getCouponById/:couponId" , errorHandle(controller.getCouponById))



export {couponRouter}