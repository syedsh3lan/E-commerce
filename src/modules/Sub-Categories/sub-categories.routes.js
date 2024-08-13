import {Router} from "express"
import { multerHost,errorHandle, checkDocumentByName} from "../../Middlewares/index.js"
import { extensions } from "../../Utils/file-extenstions.utils.js"
import { SubCategory } from "../../../DB/models/index.js"
import * as controller from "./sub-categories.controller.js"


const subCategoryRouter = Router()

subCategoryRouter.post("/create" , multerHost({allowedExtensions:extensions.Images}).single('image'),checkDocumentByName(SubCategory),errorHandle(controller.createSubCategory))
subCategoryRouter.get("/getSubCategory",errorHandle(controller.getSubCategory))
subCategoryRouter.put("/updateSubCategory/:_id" , multerHost({allowedExtensions:extensions.Images}).single('image'),checkDocumentByName(SubCategory),errorHandle(controller.updateSubCategory))
subCategoryRouter.delete("/deleteSubCategory/:_id",errorHandle(controller.deleteSubCategory))


export {subCategoryRouter}