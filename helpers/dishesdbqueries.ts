const pool = require('../db');

export const getDishes =async(resId:string)=>{


   try{

      const data = await pool.query(`with cte_temp as (select res_id,dish from dishesdb where is_archived=false and res_id='${resId}')
                                     select * from cte_temp as temp
                                     join (select count(*) from cte_temp) as total_count
                                     on true
                                     order by temp.dish
                                    `);

     return data.rows;
 }

 catch(e){

     console.log(e);
 }
      
};


export const insertDish = async(user_id:string,res_id:string,dish:string)=>{


       try{

          await pool.query(`insert into dishesdb (user_id,res_id,dish) values ('${user_id}','${res_id}','${dish}')`);
       }

       catch(e){

          console.log(e);
       }
}




export const getDishesCreatedBySubadmin = async(userId:string,resId:string)=>{

   try{

      const data = await pool.query(`with cte_temp as (select res_id ,user_id,dish from 
                                      dishesdb where is_archived = false and
                                      user_id = '${userId}' and res_id = '${resId}')
                                      select * from cte_temp as temp
                                      join (select count(*) from cte_temp) as cte
                                      on true
                                      order by temp.dish `);

       return data.rows;
   }

   catch(e){

       console.log(e);
   }
}