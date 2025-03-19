-- crea la base de datos en postgres
create table users(
    id uuid primary key default gen_random_uuid(),
    username varchar unique not null,
    password varchar not null,
    created_at timestamp default current_timestamp
);

create table mensages (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    channel varchar not null,
    message varchar not null,
    created_at timestamp default current_timestamp
);