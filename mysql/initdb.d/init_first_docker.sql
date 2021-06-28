create database if not exists first_docker;

use first_docker;

SET character_set_database=utf8;
SET character_set_server=utf8;
SET time_zone = '+09:00';

create table users (
  id int auto_increment,
  user_name varchar(255),
  pass varchar(255),
  user_icon varchar(255),
  created_at datetime default current_timestamp,
  primary key(id)
) CHARACTER SET 'utf8';

create table posts (
  id int auto_increment,
  article text,
  likes int default 0,
  user_id int,
  created_at datetime default current_timestamp,
  primary key(id)
) CHARACTER SET 'utf8';

create table comments (
  id int auto_increment,
  article text,
  post_id int,
  user_id int,
  created_at datetime default current_timestamp,
  primary key(id)
) CHARACTER SET 'utf8';

create table likes (
  id int auto_increment,
  post_id int,
  user_id int,
  created_at datetime default current_timestamp,
  primary key(id)
) CHARACTER SET 'utf8';


insert into users (user_name, pass) values ("test_user", "0000");

insert into posts (article, user_id) values ("初期化データ: これはテストです", 1)
