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

module.exports = app;