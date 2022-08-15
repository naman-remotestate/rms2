
import {Request,Response,NextFunction} from 'express';

interface CustomError extends Error{

    statusCode?:number,
    clientMessage?:string
}

export const errorHandler = ((err:CustomError, req:Request, res:Response, next:NextFunction) => {
   const statusCode = err.statusCode || 500
   const defaultError = 'Something went wrong. Please try again later.'
   res.status(statusCode).json({
       messageToDev: err.message || defaultError,
       messageToClient: err.clientMessage || defaultError
   })
})

