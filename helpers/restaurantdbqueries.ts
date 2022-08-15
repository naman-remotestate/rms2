const pool = require('../db');


export const addRestaurant = async (userId : string,resName : string,address : string,location : string)=>{

     try{

         await pool.query(`insert into restaurantdb (user_id,address,res_location,res_name) values ('${userId}','${address}','${location}','${resName}')`);
     }

     catch(e){

         console.log(e);
     }
}

export const getRestaurants = async()=>{

     try{

          const data = await pool.query(`with cte_temp as (select res_name,address from restaurantdb where is_archived=false)
                                         select * from cte_temp as temp
                                         join (select count(*) from cte_temp ) as cte
                                         on true
                                         order by temp.res_name
                                        `);

         return data.rows;
     }

     catch(e){

         console.log(e);
     }
}


export const getRestaurantsCreatedBySubadmin = async(userId : string)=>{

     try{

         const data = await pool.query(`with cte_temp as (select user_id,res_name,address from 
                                        restaurantdb where is_archived = false and
                                        user_id ='${userId}')
                                        select * from cte_temp as temp
                                        join (select count(*) from cte_temp) as cte
                                        on true 
                                        order by temp.res_name`);

            return data.rows;
     }

     catch(e){

         console.log(e)
     }
};






