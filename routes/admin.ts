import express from 'express';

const router = express.Router();

import  {adminLogin,createAdmin,createSubadmin,AddRestaurant,
       addDish,getAllSubAdmins,getAllRestaurants,
       getAllDishes,getAllUsers,createUser,logout
       
      } from '../controllers/admin';

      import {validateLoginDetails,validateAddMember,validateAddRestaurant,
            validateAddDish} from '../joivalidation'

import {authToken} from '../middlewares/auth'

import {isAdmin} from '../middlewares/checkAdmin';

router.post('/login',validateLoginDetails,adminLogin);

router.post('/create/sub-admin',authToken,isAdmin,validateAddMember,createSubadmin);

router.post('/create/admin',authToken,isAdmin,validateAddMember,createAdmin);

router.post('/create/user',authToken,isAdmin,validateAddMember,createUser);

router.post('/add-restaurant',authToken,isAdmin,validateAddRestaurant,AddRestaurant);

router.post('/:res_id/add-dish',authToken,isAdmin,validateAddDish,addDish);

router.get('/get-all-subadmins',authToken,isAdmin,getAllSubAdmins);

router.get('/get-all-restaurants',authToken,isAdmin,getAllRestaurants);

router.get('/:res_id/get-all-dishes',authToken,isAdmin,getAllDishes);

router.get('/get-all-users',authToken,isAdmin,getAllUsers);

router.get('/logout',authToken,isAdmin,logout);

export default router;
