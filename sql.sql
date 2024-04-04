CREATE DATABASE blog_api;
\c blog_api;

CREATE TABLE  noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    dt_criacao DATE NOT NULL,
    texto TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL
    
);