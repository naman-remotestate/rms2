import express from 'express';

const router = express.Router();

import {login,register,getAllDishes,getAllRestaurants,addAddress,logout} from '../controllers/user';

import {validateRegisterDetails,validateLoginDetails,validateAddress} from '../joivalidation'

const {authToken} = require('../middlewares/auth');

router.post('/register',validateRegisterDetails,register);

router.post('/login',validateLoginDetails,login);

router.get('/get-all-restaurants',authToken,getAllRestaurants);

router.get('/:res_id/get-all-dishes',authToken,getAllDishes);

router.post('/add-address',authToken,validateAddress,addAddress);


router.get('/logout',authToken,logout);

export default router;

