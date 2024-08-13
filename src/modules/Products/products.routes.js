import {Router} from "express"
//controllers
import * as controller from "./products.controller.js"
//middlewares
import { multerHost,errorHandle, checkIfIdsExist} from "../../Middlewares/index.js"
//utils
import { extensions } from "../../Utils/file-extenstions.utils.js"
import { Brands } from "../../../DB/models/index.js"

const productRouter = Router()


productRouter.post(
    "/create",
     multerHost({allowedExtensions:extensions.Images}).array('images',5),
     checkIfIdsExist(Brands),
     errorHandle(controller.createProduct));

productRouter.put(
    "/update/:_id",
    multerHost({allowedExtensions:extensions.Images}).array('images',5),
    errorHandle(controller.updateProduct)
)
productRouter.get("/getProduct",errorHandle(controller.getProduct))

productRouter.delete("/deleteProduct/:_id",errorHandle(controller.deleteProduct))



export {productRouter}