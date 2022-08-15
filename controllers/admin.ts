
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken'

import {getUserByEmail,insertUser,getSubadmins, getAllUser,insertCreatedBy} from '../helpers/userdbqueries'

import  {searchRole,insertRole} from '../helpers/rolesdbqueries';

import {addRestaurant,getRestaurants} from '../helpers/restaurantdbqueries';

import  {insertDish,getDishes} from '../helpers/dishesdbqueries';

import  {createSession,endSession} from '../helpers/sessiondbqueries';

const  role_types = ['admin','subadmin','user']

import {Request,Response,NextFunction} from 'express'



interface adminDetails { 

    username:string,
    email:string,
    password:string
}

interface nonAdminDetails extends adminDetails {

    mobile_no:string
}

interface restaurantDetails { 

     res_name:string,
     res_location:string,
     address:string
}

interface dishDetails{

    dish:string
}

interface payload{

    userId : string,
    ssid : string,
    username : string,
    email : string
}

interface CustomError extends Error{

    statusCode?:number,
    messageToClient?:string
}

export const adminLogin = async (req : Request,res:Response,next:NextFunction)=>{

     const{username,email,password}:adminDetails = req.body;
     

     try{

        const data = await getUserByEmail(email);

        
        if(!data){

            const error : CustomError = new Error("email not found");

            error.statusCode = 400;

            error.messageToClient = "email not found";

            return next(error);
        }

        const fromDbUsername : string = data.username;
        
        const fromDbPassword : string = data.password;

        const userId : string = data.user_id;

        const fromDbData = await searchRole(userId,'admin');

        if(!fromDbData){

            const error : CustomError = new Error("not a subadmin");

            error.statusCode = 403;

            error.messageToClient = "you are not a subadmin";

            return next(error);
        }

        if(username!==fromDbUsername && ! await bcrypt.compare(password,fromDbPassword))res.send("invalid credentials");

        const ssid : string = await createSession(userId);

        const user : payload = {ssid,userId,username,email};

        const accessToken = jwt.sign(user,(process.env.ACCESS_TOKEN_SECRET) as string ,{expiresIn:'30min'});

        res.json({accessToken:accessToken});


    }

     catch(e){

        next(e);
    }
};

export const createUser = async (req : Request,res:Response,next:NextFunction)=>{

    const{username,email,password,mobile_no} : nonAdminDetails = req.body;

    const userId  = req.user.userId;

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

           const newUserId = data.rows[0].user_id;

           const data1 = await searchRole(newUserId,role_types[2]);

           if(!data1){

               await insertRole(newUserId,role_types[2]);

               res.send("user is successfully created");
           }

           else res.send("it is already a user");
       }

   }

   catch(e){

       res.send(e);
   }



};


export const createSubadmin = async (req : Request,res:Response,next:NextFunction)=>{

     const{username,email,password,mobile_no} : nonAdminDetails = req.body;

     const userId  = req.user.userId;

    try {

         const data = await getUserByEmail(email);

         if(!data){

            const salt = await bcrypt.genSalt();

            const hashedPassword = await bcrypt.hash(password,salt);

            const newUserId : string  = await insertUser(username,hashedPassword,email,mobile_no);

            await insertCreatedBy(newUserId,userId);

            await insertRole(newUserId,role_types[1]);


            res.send("subadmin succesfully created");

        }

        else{

            const usersId = data.user_id;

            const data1 = await searchRole(usersId,role_types[1]);

            if(!data1){

                await insertRole(usersId,role_types[1]);

                res.send("subadmin is successfully created");
            }

            else res.send("given user is already a subadmin");
        }

    }

    catch(e){

        res.send(e);
    }

}



export const createAdmin = async (req : Request,res:Response,next:NextFunction)=>{

    const{username,email,password,mobile_no} : nonAdminDetails= req.body;

    const userId  = req.user.userId;

   try {

        const data = await getUserByEmail(email);

        if(!data){

           const salt = await bcrypt.genSalt();

           const hashedPassword = await bcrypt.hash(password,salt);

           const newUserId = await insertUser(username,hashedPassword,email,mobile_no);

           await insertCreatedBy(newUserId,userId);

           await insertRole(newUserId,role_types[0]);


           res.send("admin succesfully created");

       }

       else{

           const usersId : string = data.rows[0].user_id;

           const data1 = await searchRole(usersId,role_types[0]);

           if(!data1){

               await insertRole(usersId,role_types[0]);

               res.send("admin is successfully created");
           }

           else res.send("given user is already a admin");
       }

   }

   catch(e){

       res.send(e);
   }



};
export const AddRestaurant = async (req : Request,res:Response,next:NextFunction)=>{
      
    const {res_name,address,res_location} : restaurantDetails  =req.body;

    const userId  = req.user.userId;

    console.log(userId);
      
    try{

         await addRestaurant(userId,res_name,address,res_location);

          res.send("restaurant is successfully added");
     }

     catch(e){

         console.log(e);
     }
};

export const addDish = async(req : Request,res:Response,next:NextFunction)=>{

     const{dish} : dishDetails =  req.body;
    
    const{res_id}  = req.params;

    const userId = req.user.userId;

    const dishName = dish.toLowerCase();

     try{
        
         await insertDish(userId,res_id,dishName);

         res.send("dish is successfully added");

      }

     catch(e){

        const error : CustomError = new Error("unable to add dish");

        error.messageToClient = "unable to add dish";

        return next(error);
     }
    
}

 export const getAllSubAdmins = async (req : Request,res:Response,next:NextFunction)=>{


      const limit:number = 5

      const offset : number = 0;

      try{

          const data = await getSubadmins(role_types[1],limit,offset);

          res.json(data);
      }

      catch(e){

        const error:CustomError = new Error("not able to fetch subadmins");

        error.messageToClient = "unable to fetch subadmins";

        return next(error);
      }
 }

 export const getAllRestaurants = async(req : Request,res:Response,next:NextFunction)=>{

      try{

           const resData = await getRestaurants();

           res.send(resData);

           
      }

      catch(e){

        const error:CustomError = new Error("not able to fetch restaurants");

        error.messageToClient = "unable to fetch restaurants";

        return next(error);
      }
 };

 export const getAllDishes = async(req : Request,res:Response,next:NextFunction)=>{
    

    const {res_id} = req.params;

     try{

         const dishesData = await getDishes(res_id);

         res.send(dishesData);
     }

     catch(e){

        const error : CustomError = new Error("unable to fetch dishes");

        error.messageToClient = "unable to fetch dishes";

        return next(error);
     }
 }


 export const getAllUsers =  async(req : Request,res:Response,next:NextFunction)=>{

       const offset = 0;
       const limit =10;

     try{

          const userData = await getAllUser(offset,limit);

          res.send(userData);
     }

     catch(e){

        const error:CustomError = new Error("unable to fetch users");

        error.messageToClient = "unable to fetch users";

        return next(error);
     }
 }


 export const logout = async(req : Request,res:Response,next:NextFunction)=>{

    const ssid = req.user.ssid;

     try{

         await endSession(ssid);

         res.send("you are successfully logged out");
     }

     catch(e){

        const error:CustomError = new Error("unable to logout");

        error.messageToClient = "something went wrong";

        return next(error);
     }
 }

