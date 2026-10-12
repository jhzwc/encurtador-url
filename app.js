const express = require('express');
const crypto = require('crypto');
const pool = require('./db');

const app = express();
app.use(express.json());

const ALFABETO = 'abcdefghijklmnopqrstuvwxyz0123456789';

function gerarCodigo() {
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += ALFABETO[crypto.randomInt(ALFABETO.length)];
    }
    return codigo;
}

app.get ('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/links', async (req, res) => {
    const { url } = req.body;
    const codigo = gerarCodigo();
        await pool.execute(
      'INSERT INTO links (codigo, url_original) VALUES (?, ?)',
      [codigo, url]
    );
    res.status(201).json({ codigo });
});

app.get('/:codigo', async (req, res) => {
    const { codigo } = req.params;
const [linhas] = await pool.execute(
    'SELECT url_original FROM links WHERE codigo = ?',
    [codigo]
);

if (linhas.length === 0) {
    return res.status(404).json({ erro: 'Link nao encontrado' });
}

await pool.execute(
    'UPDATE links SET cliques = cliques + 1 WHERE codigo = ?',
    [codigo]
);

res.redirect(302, linhas[0].url_original);
});

module.exports = app;