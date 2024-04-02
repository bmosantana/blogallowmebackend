const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

// como criar um arquivo .env para configuração de portas e etc
const PORT = process.env.PORT || 3000;

// configurando o Pool de conexão com o PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'minha_api',
    password: 'sua_senha',
    port: 5432,
});

