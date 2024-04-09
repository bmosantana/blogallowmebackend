const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

// como criar um arquivo .env para configuração de portas e etc
//const PORT = process.env.PORT || 3000;
const PORT = 3000;

// configurando o Pool de conexão com o PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'minha_api',
    password: 'sua_senha',
    port: this.PORT, //porta que  server sql está rodado (parão: 3000)
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
        res.status(500).json({ message: 'Erro interno do servidor' })
    }
});

//Post Method criado para facilitar inserção de novas noticias via postman
app.post('/noticias', async (req, res) => {
    const { titulo, dt_criacao, texto, autor } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO items(titulo, dt_criacao, texto, autor) VALUES($1, $2, $3, $4) RETURNING *', [titulo, dt_criacao, texto, autor]);
        const newItem = result.rows[0];

        client.release();
        res.status(201).json(newItem);

    } catch (err) {
        console.error('Erro ao criar item: ', err);
        res.status(400).json({ message: 'Erro ao criar item.' });
    }
});

//Get Item pelo Id único
app.get('/noticias/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM noticias WHERE id = $1', [id]);
        const item = result.rows[0];

        client.release();

        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item não encontrado.' });
        }

    } catch (err) {
        console.error('Erro ao buscar item: ', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

//Put para editar uma possivel noticia
app.put('/noticias/:id', async (req, res) => {
    const id = req.params.id;
    const { titulo, dt_criacao, texto, autor } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('UPDATE noticias SET titulo = $1, dt_criacao = $2, texto = $3, autor = $4 WHERE id = $5 RETURNING *', [titulo, dt_criacao, texto, autor, id]);
        const updatedItem = result.rows[0];

        client.release();

        if (updatedItem) {
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao atualizar item:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

//Delete de Noticias pelo ID
app.delete('/noticias/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const client = await pool.connect();
        await client.query('DELETE FROM items WHERE id = $1', [id]);
        client.release();
        res.json({ message: 'Item deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar item:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

//Iniciando Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});