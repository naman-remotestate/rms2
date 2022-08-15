import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import {getUserByEmail,insertUser,insertCreatedBy} from '../helpers/userdbqueries'

import {createSession,endSession} from '../helpers/sessiondbqueries'

import  {getRestaurants} from '../helpers/restaurantdbqueries';

import {getDishes} from '../helpers/dishesdbqueries'

import {insertRole} from '../helpers/rolesdbqueries'

import  {insertAddress,getAllAddress} from '../helpers/addressdbqueries'

import {Request,Response,NextFunction} from 'express'

interface userDetails { 

    username:string,
    email:string,
    password:string,
    mobile_no:string

}

interface CustomError extends Error{

    statusCode?:number,
    messageToClient?:string
}



export const register = async(req : Request,res : Response,next : NextFunction)=>{

    const{username,email,password,mobile_no} : userDetails = req.body;


    try{

        const data= await getUserByEmail(email);
    
        if(data){
    
            const error:CustomError = new Error("user already exists in database");

            error.statusCode = 409;

            error.messageToClient = "user already exists";

            return next(error);
        }
    
    
        const salt = await bcrypt.genSalt();
    
        const hashPassword = await bcrypt.hash(password,salt);
    
        const userId:string = await insertUser(username,hashPassword,email,mobile_no);

        await insertCreatedBy(userId,userId);

        await insertRole(userId,'user');
        
        const ssid:string =  await createSession(userId);
    
        const user = {ssid,userId,username,email};
    
        const accessToken = jwt.sign(user,(process.env.ACCESS_TOKEN_SECRET) as string ,{expiresIn:'20min'});
    
        res.json({accessToken:accessToken});
    
        }
    
        catch(e){
        
            next(e);
        }
    
        
}


export const login = async(req : Request,res : Response,next : NextFunction)=>{

    const{username,password,email}: userDetails = req.body;

    const userInfo = await getUserByEmail(email);

    const userPassword : string  =  userInfo.password;

    const userId : string  = userInfo.user_id;

    const dbUsername : string  = userInfo.rows[0].username;

   try{


        if(username===dbUsername && await bcrypt.compare(password,userPassword)){

            

           const ssid : string = await createSession(userId);


           const user = {ssid,userId,username,email};

           const accessToken = jwt.sign(user,(process.env.ACCESS_TOKEN_SECRET) as string ,{expiresIn:'20min'});

           res.json({accessToken});
       }

       else{

        const error : CustomError= new Error("invalid credentials");

        error.statusCode = 400;

        error.messageToClient = "invalid credentials";

        return next(error);
       }
   }

   catch(e){

      next(e);
   }
}


export const getAllRestaurants = async(req : Request,res : Response,next : NextFunction)=>{

    try{

        const resData= await getRestaurants();

        res.send(resData);

        
   }

   catch(e){

            const error : CustomError = new Error("not able fetch restaurants");

            error.messageToClient = "unable to fetch restaurants";

            return next(error);
   }
};

export const getAllDishes = async(req : Request,res : Response,next : NextFunction)=>{

    
    const {res_id} = req.params;

     try{

         const dishesData = await getDishes(res_id);

         res.send(dishesData);
     }

     catch(e){

        const error: CustomError = new Error("not able to fetch dishes");

        error.messageToClient = "unable to fetch dishes";

        return next(error);
     }
};

export const addAddress = async(req : Request,res : Response,next : NextFunction)=>{

    const{address,user_location}:{address:string,user_location:string} = req.body;

    const userId = req.user.userId;

   try{
       
       await insertAddress(userId,address,user_location);

       res.send("address added successfully")
       
   }

   catch(e){

    const error: CustomError = new Error("not able to add address");

    error.messageToClient = "something went wrong";

    return next(error);
   }
};

export const logout = async(req : Request,res : Response,next : NextFunction)=>{

    const ssid = req.user.ssid;

     try{

         await endSession(ssid);

         res.send("you are successfully logged out")
     }

     catch(e){

        const error: CustomError = new Error("not able to fetch restaurants");

        error.messageToClient = "unable to fetch restaurants";

        return next(error);
     }
 }

