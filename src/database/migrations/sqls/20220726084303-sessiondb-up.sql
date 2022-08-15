/* Replace with your SQL commands */

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


create table sessiondb
(
    ssid       uuid                     default uuid_generate_v4() primary key,
    user_id    uuid references userdb (user_id),
    start_time timestamp with time zone default now(),
    end_time   timestamp,
    is_ended   boolean                  default false
);