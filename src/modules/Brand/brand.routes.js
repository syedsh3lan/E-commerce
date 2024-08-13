import {Router} from "express"

import * as controller from "./brand.controller.js"
import { multerHost,errorHandle,checkDocumentByName } from "../../Middlewares/index.js"
import { extensions } from "../../Utils/file-extenstions.utils.js"
import { Brands } from "../../../DB/models/index.js"

const brandRouter = Router()


brandRouter.post("/create",multerHost({allowedExtensions:extensions.Images}).single('image'),checkDocumentByName(Brands),errorHandle(controller.createBrand))
brandRouter.get("/getBrand",errorHandle(controller.getBrand))
brandRouter.put("/updateBrand/:_id" , multerHost({allowedExtensions:extensions.Images}).single('image'),checkDocumentByName(Brands),errorHandle(controller.updateBrand))
brandRouter.delete("/deleteBrand/:_id",errorHandle(controller.deleteBrand))
export {brandRouter}
