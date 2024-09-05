import express from "express"
import {config} from "dotenv"


import connection_db from "./DB/connection.js"
import { globalResponse } from "./src/Middlewares/error-handle.middleware.js"
import * as router from "./src/modules/index.js"


config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use("/categories",router.categoryRouter)
app.use("/products",router.productRouter)
app.use("/sub-categories",router.subCategoryRouter)
app.use("/brands",router.brandRouter)
app.use("/users", router.userRouter)
app.use("/address",router.addressRouter)
app.use("/carts",router.cartRouter)
app.use("/coupons",router.couponRouter)




app.use(globalResponse)

connection_db()

app.listen(port,console.log(`connected is done on : ${port}`))
