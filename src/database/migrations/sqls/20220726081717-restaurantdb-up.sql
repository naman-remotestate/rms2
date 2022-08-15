/* Replace with your SQL commands */

alter TABLE userdb add CONSTRAINT contraintname  unique (email);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table restaurantdb
(
    res_id       uuid    default uuid_generate_v4() primary key,
    user_id      uuid references userdb (user_id) not null,
    address      varchar(80)                      not null,
    res_location point                            not null,
    is_archived  boolean default false
)