/* Replace with your SQL commands */

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


create table dishesdb
(
    dish_id     uuid    default uuid_generate_v4() primary key,
    user_id     uuid references userdb (user_id)      not null,
    res_id      uuid references restaurantdb (res_id) not null,
    dish        varchar(30),
    is_archived boolean default false
)