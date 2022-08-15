import  express from 'express';

const router = express.Router();

import {login,getAllRestaurants,getAllDishes,getAllUsers,
        addDish,createUser,
        AddRestaurant,logout} from '../controllers/subadmin'

import  {isSubAdmin} from '../middlewares/checkSubadmin'

import {authToken} from '../middlewares/auth'

import {validateLoginDetails,validateAddMember,validateAddRestaurant,
       
        validateAddDish} from '../joivalidation'

router.post('/login',validateLoginDetails,login);

router.post('/create/user',authToken,isSubAdmin,validateAddMember,createUser);

router.post('/add-restaurant',authToken,isSubAdmin,validateAddRestaurant,AddRestaurant);

router.post('/:res_id/add-dish',authToken,isSubAdmin,validateAddDish,authToken,addDish);

router.get('/get-all-restaurants',authToken,isSubAdmin,getAllRestaurants);

router.get('/:res_id/get-all-dishes',authToken,isSubAdmin,getAllDishes);

router.get('/get-all-users',authToken,isSubAdmin,getAllUsers);

router.get('/logout',authToken,isSubAdmin,logout)

export default router;