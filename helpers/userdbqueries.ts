
const pool = require('../db');

import {getAllAddress} from './addressdbqueries'

interface info{

    user_id:string,
    username:string,
    email:string,
    mobile_no:string,
}

export const getAllUser = async(offset:number,limit:number)=>{


    try{

        const data =  await pool.query(`with cte_temp as (select user_id,username,email,mobile_no from userdb)
                                        select * from cte_temp as temp
                                        join (select count(*) from cte_temp ) as cte
                                        on true
                                        join responsibilities as res
                                        on temp.user_id = res.user_id
                                        where is_archived=false and
                                        role_type='user'
                                        order by username
                                        limit ${limit} offset ${offset}`);



        const userIds = data.rows.map(({user_id}:info)=>{

               return user_id;
        })



        const addressInfo = await getAllAddress(userIds) as Map<string,string>;

        const userInfo:object[] = [];

        data.rows.forEach(({user_id,username,email,mobile_no}:info)=>{

              const obj = {

                  username,
                  email,
                  mobile_no,
                  address:(addressInfo.get(user_id))? addressInfo.get(user_id) : []
              }

              userInfo.push(obj);
        })

        return userInfo;
     }

    catch(e){

        console.log(e);
    }
     
      
};

export const getUsersById = async(user_id:string)=>{

    try{

        const data = await pool.query(`select user_id,username,email,password,mobile_no from userdb where user_id = '${user_id}'
                                       and is_archived = false`);

        return data.rows[0];
    }

    catch(e){

         console.log(e);
    }
};

export const getUserByEmail = async(email:string)=>{

    try{

        const data = await pool.query(`select user_id,username,password,email from userdb where email='${email}' and is_archived=false`);

        return data.rows[0];

    }

    catch(e){

        console.log(e);
    }
};

export const insertUser = async(username:string,password:string,email:string,mobileNo:string)=>{

    try{


            const userInfo = await pool.query(`insert into userdb(username,password,email,mobile_no) 
                                            values('${username}','${password}','${email}',
                                            '${mobileNo}') returning user_id`);

            return userInfo.rows[0].user_id ;
        }


    catch(e){

        return e;
    }
}

export const insertCreatedBy = async(userId:string,createdBy:string) =>{

      try{

          await pool.query(`update userdb set created_by = '${createdBy}' where user_id = '${userId}' `);
      }

      catch(e){
          console.log(e);
      }
}

export const getSubadmins = async(roleType:string,limit:number,offset:number)=>{

    
      try{

          const data = await pool.query(` with cte_temp as(select username,email,user_id from userdb)  
                                            select *  from cte_temp as temp
                                            join (select count(*) from cte_temp) as total on TRUE
                                            join responsibilities as res on temp.user_id = res.user_id
                                            where role_type='${roleType}'
                                            order by temp.username
                                            limit ${limit} offset ${offset} `);

         return data.rows;
      }

      catch(e){

          console.log(e);
      }
}

export const getUsersCreatedBySubadmin = async(userId:string)=>{

     try{

         const data = await pool.query(`with cte_temp as (select user_id,username,email from userdb
                                        where created_by = '${userId}' and is_archived=false)
                                        select * from cte_temp as temp 
                                        inner join (select count(*) from cte_temp) as cte on true
                                        inner join responsibilities as res
                                        on temp.user_id = res.user_id
                                        where res.role_type='user'
                                        order by temp.username`);

         return data.rows;
     }

     catch(e){

         console.log(e);
     }
};

export const searchUserWithRole = async(email:string,roleType:string)=>{

     try{

         const data = await pool.query(`select user_id,username,email,password from userdb as users
                                        inner join responsibilities as res
                                        using(user_id)
                                        where email='${email}' and role_type= '${roleType}' 
                                        and users.is_archived=false
                                           `);



        return data.rows[0];
     }

    catch(e){

        console.log(e);
    }
};
