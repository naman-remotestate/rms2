const pool = require('../db');

export const createSession = async(userId : string)=>{

     try{

         const ssInfo = await pool.query(`insert into sessiondb (user_id) values ('${userId}') returning ssid`);

         return ssInfo.rows[0].ssid;
     }

     catch(e){

         console.log(e);
     }
};

export const endSession = async(ssid : string)=>{

     const currDate = new Date();

     const endTime = currDate.toISOString();

       try{

           await pool.query(`update sessiondb set end_time = '${endTime}' , is_ended = true `);
       }

       catch(e){

           console.log(e);
       }
};




