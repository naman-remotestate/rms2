

import jwt from 'jsonwebtoken'

const pool = require('../db');

import {Request,Response,NextFunction} from 'express'

interface payload{

    userId:string,
    ssid : string,
    username:string,
    email:string
};

declare global {
  namespace Express {
    interface Request {
      
       user:{
        
        userId:string,
        ssid:string,
        username:string,
        email:string
      }
    }
  }
}

export const authToken=(req : Request,res:Response,next:NextFunction)=>{

    const token = req.headers['authorization'];

    if(token==null)return res.send("invalid user")

    jwt.verify(token,(process.env.ACCESS_TOKEN_SECRET) as string ,async(err,user)=>{

        if(err)return res.sendStatus(403);

        req.user = user as payload

        const ssid  = req.user.ssid;

      try{

        const sessInfo  = await pool.query('select end_time from sessiondb where ssid = $1',[ssid]);


        if(sessInfo.rows[0].end_time){

            res.send("You are logged out , please login again");

            return;
        }
      }

      catch(e){

         console.log(e);
      }

        next();
    })
};