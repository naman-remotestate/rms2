/* Replace with your SQL commands */

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create type roles as enum ('admin','subadmin','user');

create table responsibilities
(
    role_id          uuid    default uuid_generate_v4() primary key,
    user_id     uuid references userdb (user_id) not null,
    role_type   roles                  not null,
    is_archived boolean default false
)