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

// analise do corpo da requisição
app.use(bodyParser.json());

// Rotas
app.get('/noticias', async (req, res) => {
    const { titulo, texto, dt_criacao } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM  noticias')
        const items = result.rows;

        client.release();
        res.json(items);

    } catch (err) {
        console.error('Erro ao buscar itens:', err);
        res.status(500).json({message: 'Erro interno do servidor'})
    }
});

app.get('/noticias/:id', async (req, res) => {
    try {

    } catch (error) {

    }
});