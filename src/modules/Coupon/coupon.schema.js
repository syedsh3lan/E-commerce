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


export const updateCouponSchema = {
    body:Joi.object({
        couponCode:Joi.string().optional(),
        from:Joi.date().greater(Date.now()).optional(),
        till : Joi.date().greater(Joi.ref("from")).optional(),
        Users: Joi.array().items(Joi.object({
            userId:Joi.string().optional(),
            maxCount:Joi.number().min(1).optional(),
            
        })).optional(),
        couponType:Joi.string().valid("Fixed","Percentage").optional(),
        couponAmount:Joi.number().when('couponType' , {
            is :Joi.string().valid("Percentage"),
            then:Joi.number().max(100).optional()
        }).min(1).optional(),

    }),
    params:Joi.object({
        couponId:Joi.string().required()
    }),
   
}