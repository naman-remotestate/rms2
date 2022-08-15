import {searchRole} from '../helpers/rolesdbqueries'

import {Request,Response,NextFunction} from 'express'

export const isSubAdmin= async (req : Request,res : Response,next:NextFunction)=>{

     const userId = req.user.userId;

     try{

     const resFromDb = await searchRole(userId,'subadmin');

     if(!resFromDb)res.send("you can't perform this action");

     else next();

     }

     catch(e){

          console.log(e)
     }
     
}