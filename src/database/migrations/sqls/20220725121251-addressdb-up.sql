/* Replace with your SQL commands */

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table addressdb
(
    id   uuid default uuid_generate_v4() primary key,
    
    user_id uuid references userdb(user_id) not null,
    
    address varchar(80) not null,
   
    user_location point not null
)