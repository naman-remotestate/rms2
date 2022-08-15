import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import {getUsersCreatedBySubadmin,searchUserWithRole,insertUser,getUserByEmail,insertCreatedBy} from '../helpers/userdbqueries'

import {insertRole,searchRole} from '../helpers/rolesdbqueries'

import {getRestaurantsCreatedBySubadmin,addRestaurant} from '../helpers/restaurantdbqueries'

import {getDishesCreatedBySubadmin,insertDish} from '../helpers/dishesdbqueries'

import {createSession,endSession} from '../helpers/sessiondbqueries'

import {Request,Response,NextFunction} from 'express'

const role_types = ['admin','subadmin','user']

interface restaurantDetails { 

    res_name:string,
    res_location:string,
    address:string
}

interface dishDetails{

    dish:string
}

interface CustomError extends Error{

    statusCode?:number,
    messageToClient?:string
}

interface payload{

    userId : string,
    ssid : string,
    username : string,
    email : string
}

interface subAdminDetails { 

    username:string,
    email:string,
    password:string
}

interface nonSubAdminDetails extends subAdminDetails {

    mobile_no:string
}



export const login = async(req : Request,res : Response,next : NextFunction)=>{

    const{username,email,password}:subAdminDetails = req.body;

    try{

        const userInfo = await searchUserWithRole(email,role_types[1]);

        if(!userInfo){

            const error : CustomError = new Error("not a subadmin");

            error.statusCode = 403;

            error.messageToClient = "you are not a subadmin";

            return next(error);
        }

        const fromDbUsername = userInfo.username;
        
        const fromDbPassword = userInfo.password;

        const userId = userInfo.user_id;

        if(username!==fromDbUsername && ! await bcrypt.compare(password,fromDbPassword)){

            const error:CustomError = new Error("invalid credentials");

            error.statusCode = 401;

            error.messageToClient = "invalid credentials";

            return next(error);
        }

        const ssid:string  = await createSession(userId);

        const user:payload = {ssid,userId,username,email};

        const accessToken = jwt.sign(user,(process.env.ACCESS_TOKEN_SECRET) as string ,{expiresIn:'30min'});

        res.json({accessToken:accessToken});
    }

    catch(e){

         next(e);
    }
}





export const getAllUsers = async(req : Request,res : Response,next : NextFunction)=>{

       const userId = req.user.userId;

      try{

          const userInfo = await getUsersCreatedBySubadmin(userId);

          res.send(userInfo);

      }

      catch(e){
                
            const error:CustomError = new Error("couldn't fetch users");

            error.messageToClient = "unable to fetch users";

            return next(error);
      }
}

export const getAllRestaurants = async(req : Request,res : Response,next : NextFunction)=>{

    const userId = req.user.userId

    try{

        const resInfo = await getRestaurantsCreatedBySubadmin(userId);

        res.send(resInfo);
    }

    catch(e){

        
        const error:CustomError = new Error("couldn't fetch restaurants");

        error.messageToClient = "unable to fetch restaurants";

        return next(error);
    }
};

export const getAllDishes = async(req : Request,res : Response,next : NextFunction)=>{

    const userId = req.user.userId

    const {res_id} = req.params;

    try{

        const dishInfo = await getDishesCreatedBySubadmin(userId,res_id);

        res.send(dishInfo);
    }

    catch(e){

        const error:CustomError = new Error("couldn't fetch dishes");

        error.messageToClient = "unable to fetch dishes";

        return next(error);
    }
};

export const AddRestaurant = async (req : Request,res : Response,next : NextFunction)=>{
      
    const {res_name,address,res_location}:restaurantDetails=req.body;

    const userId = req.user.userId;
      
    try{

         await addRestaurant(userId,res_name,address,res_location);

          res.send("restaurant is successfully added");
     }

     catch(e){

         
        const error:CustomError = new Error("couldn't add restaurant");

        error.messageToClient = "unable to add restaurants";

        return next(error);
     }
};

export const addDish = async(req : Request,res : Response,next : NextFunction)=>{

    const{dish}:dishDetails =  req.body;
   
   const{res_id} = req.params;

   const userId = req.user.userId;

   const dishName = dish.toLowerCase();

    try{
       
        await insertDish(userId,res_id,dishName);

        res.send("dish is successfully added");

     }

    catch(e){

        
        const error:CustomError = new Error("dish already exists");

        error.statusCode = 409

        error.messageToClient = "dish already exists";

        return next(error);
    }
   
};

export const createUser = async (req : Request,res : Response,next : NextFunction)=>{

    const{username,email,password,mobile_no}:nonSubAdminDetails = req.body;

    const userId = req.user.userId;

   try {

        const data = await getUserByEmail(email);

        if(!data){

           const salt = await bcrypt.genSalt();

           const hashedPassword = await bcrypt.hash(password,salt);

           const newUserId = await insertUser(username,hashedPassword,email,mobile_no);

           await insertCreatedBy(newUserId,userId);

           await insertRole(newUserId,role_types[2]);


           res.send("user succesfully created");

       }

       else{

           const newUserId = data.user_id;

           const userInfo = await searchRole(newUserId,role_types[2]);

           if(!userInfo){

               await insertRole(newUserId,role_types[2]);

               res.send("user is successfully created");
           }

           else res.send("it is already a user");
       }

   }

   catch(e){

       
    const error:CustomError = new Error("error in creating user");

      error.messageToClient = "unable to create user";

       return next(error);
   }



};

export const logout = async(req : Request,res : Response,next : NextFunction)=>{

    const ssid = req.user.ssid;

     try{

         await endSession(ssid);
         res.send("you are successfully logout")
     }

     catch(e){

        const error:CustomError = new Error("not able to logout");

        error.messageToClient = "something went wrong";

        return next(error);
     }
 }

