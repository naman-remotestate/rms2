import  express from 'express';

const app = express();

import  adminRoutes from './routes/admin';

import  subAdminRoutes from './routes/subadmin';

import  userRoutes from './routes/user';

import {errorHandler} from './AppError';

app.use(express.json());

app.use('/admin',adminRoutes);

app.use('/subadmin',subAdminRoutes);

app.use('/user',userRoutes);

app.use(errorHandler);

app.listen(3000,()=>{

    console.log("listening on port no 3000!!")
    
    }
)