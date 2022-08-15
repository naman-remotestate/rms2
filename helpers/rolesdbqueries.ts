const pool = require('../db');

export const searchRole=async (user_id : string ,role : string )=>{

     try{

         const data = await pool.query(`select user_id,role_type from responsibilities where user_id='${user_id}' 
                                        and role_type='${role}'
                                         and is_archived = false`);

         return data.rows[0];
       }

     catch(e){

        console.log(e);
     }
};

export const insertRole = async(user_id : string ,role_type : string )=>{

    try{

        await pool.query(`insert into responsibilities (user_id,role_type) values ('${user_id}','${role_type}')`);
    }

    catch(e){

        console.log(e);
    }
}

export const setRoleOfUser=async (user_id : string ,role : string )=>{

       try{

          await pool.query(`insert into responsibilities (user_id,role_type) values('${user_id}','${role}'})`);
       }

       catch(e){

          console.log(e);
       }
};



