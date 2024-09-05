import Joi from "joi"

export const createCouponSchema = {
    body:Joi.object({
        couponCode:Joi.string().required(),
        from:Joi.date().greater(Date.now()).required(),
        till : Joi.date().greater(Joi.ref("from")).required(),
        Users: Joi.array().items(Joi.object({
            userId:Joi.string().required(),
            maxCount:Joi.number().min(1).required(),
            
        })).required(),
        couponType:Joi.string().valid("Fixed","Percentage").required(),
        couponAmount:Joi.number().when('couponType' , {
            is :Joi.string().valid("Percentage"),
            then:Joi.number().max(100).required()
        }).min(1).required(),

    })

}