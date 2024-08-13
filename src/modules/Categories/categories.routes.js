import {Router} from "express"
import { multerHost,errorHandle,checkDocumentByName } from "../../Middlewares/index.js"
import { extensions } from "../../Utils/file-extenstions.utils.js"
import { Category } from "../../../DB/models/index.js"
import * as controller from "./categories.controller.js"


const categoryRouter = Router()

categoryRouter.post("/create", multerHost({allowedExtensions:extensions.Images}).single('image'), checkDocumentByName(Category),errorHandle(controller.createCategory))
categoryRouter.get("/getCategory",errorHandle(controller.getCategory))
categoryRouter.put("/updateCategory/:_id", multerHost({allowedExtensions:extensions.Images}).single('image'), checkDocumentByName(Category),errorHandle(controller.updateCategory))
categoryRouter.delete("/deleteCategory/:_id",errorHandle(controller.deleteCategory))



export {categoryRouter}