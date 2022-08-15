import  Joi from 'joi'

import {Request,Response,NextFunction} from 'express'

interface CustomError extends Error{

    statusCode?:number,
    clientMessage?:string
}

export const validateAddress = async (req : Request,res : Response,next : NextFunction) => {
    const addressSchema = Joi.object({
        address: Joi.string().required().min(4),
        user_location:Joi.required()
    })
    const { error } = addressSchema.validate(req.body)
    if (error) {
        const err:CustomError = new Error(error.message)
        err.statusCode = 400
        err.clientMessage = error.details[0].message
        return next(err)
    }
    next()
}
export const validateRegisterDetails = async (req : Request,res : Response,next : NextFunction) => {
    const registerSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.required(),
        username: Joi.string().min(3).max(30).required(),
        mobile_no:Joi.string().min(10).max(10)
    })
    const { error } = registerSchema.validate(req.body)
    if (error) {
        const err:CustomError = new Error(error.message)
        err.statusCode = 400
        err.clientMessage = error.details[0].message
        return next(err)
    }
    next()
}
export const validateLoginDetails = async (req : Request,res : Response,next : NextFunction) => {
    const loginSchema = Joi.object({
        email: Joi.string().email(),
        password: Joi.required(),
        username: Joi.string().min(3).max(30).required()
    })
    const { error }= loginSchema.validate(req.body)
    if (error) {
        const err:CustomError = new Error(error.message)
        err.statusCode = 400
        err.clientMessage = error.details[0].message
        return next(err)
    }
    next()
}
export const validateAddRestaurant = async (req : Request,res : Response,next : NextFunction) => {
    const addRestSchema = Joi.object({
        res_name: Joi.string().required(),
        res_location:Joi.string().required(),
        address:Joi.string().min(5).max(50).required()

    })
    const { error } = addRestSchema.validate(req.body)
    if (error) {
        const err:CustomError = new Error(error.message)
        err.statusCode = 400
        err.clientMessage = error.details[0].message
        return next(err)
    }
    next()
}
export const validateAddDish = async (req : Request,res : Response,next : NextFunction) => {
    const addDishSchema = Joi.object({
        dish: Joi.string().min(5).max(30).required()
    })
    const { error } = addDishSchema.validate(req.body)
    if (error) {
        const err:CustomError = new Error(error.message)
        err.statusCode = 400
        err.clientMessage = error.details[0].message
        return next(err)
    }
    next()
}
export const validateAddMember = async (req : Request,res : Response,next : NextFunction) => {
    const registerSchema = Joi.object({
        email: Joi.string().email(),
        password: Joi.required(),
        username: Joi.string().min(3).max(30).required(),
        mobile_no:Joi.string().min(10).max(10)
    })
    const { error } = registerSchema.validate(req.body)
    if (error) {
        const err:CustomError = new Error(error.message)
        err.statusCode = 400
        err.clientMessage = error.details[0].message
        return next(err)
    }
    next()
}