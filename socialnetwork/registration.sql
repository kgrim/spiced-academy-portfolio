DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    surname VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    url VARCHAR(300),
    bio VARCHAR(600)

);

SELECT * FROM users;


CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    status INT NOT NULL DEFAULT 1

);

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    message VARCHAR(5000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
