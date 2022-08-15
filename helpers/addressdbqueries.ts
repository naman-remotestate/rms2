const pool = require('../db');

export const insertAddress = async(userId:string,address:string,userLocation:string)=>{

    try{

        await pool.query(`insert into addressdb(user_id,address,user_location)
                          values ('${userId}','${address}','${userLocation}') `);
    }

    catch(e){

         console.log(e);
    }
}

interface userInfo{

    user_id:string,
    address:string
}


export const getAllAddress = async(userIds:string[])=>{

    try{

         const data  = await pool.query('select user_id,address from addressdb where is_archived = false and user_id = ANY ($1)',[userIds]);


         const allAddress:object[] = data.rows;
         
         const map = new Map();

        allAddress.forEach((info)=>{
            
            const userInfo = info as userInfo
            
            if(map.has(userInfo.user_id)){
                
                const list = map.get(userInfo.user_id);

                list.push(userInfo.address);

            }


            else{

                const list:string[] = [];

                list.push(userInfo.address);

                map.set(userInfo.user_id,list);
            }

              
        })
        

        return map;
    }

    catch(e){

        console.log(e);
    }
}


