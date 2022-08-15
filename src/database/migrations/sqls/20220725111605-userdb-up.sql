/* Replace with your SQL commands */

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


create table userdb
(
    user_id   uuid default uuid_generate_v4() primary key ,
    username  varchar(30) not null,
    password  text        not null,
    email     varchar(30) not null,
    mobile_no varchar(20) not null
)