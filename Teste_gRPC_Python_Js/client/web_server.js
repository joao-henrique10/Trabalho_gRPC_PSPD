// web_server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sendWord } = require('./dictionary_client');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON no body (no caso de POST)
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /addWord
 * Espera um JSON: { word: "algumaPalavra" }
 * Chama gRPC com essa palavra.
 */
app.post('/addWord', async (req, res) => {
  try {
    const { word } = req.body;
    const response = await sendWord(word);
    // response = { success, message, words[] } (words só se for IMPRIMIR)
    res.json(response);
  } catch (error) {
    console.error("Erro em /addWord:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /printWords
 * Não precisa de body, pois sempre enviamos "IMPRIMIR"
 */
app.get('/printWords', async (req, res) => {
  try {
    const response = await sendWord("IMPRIMIR");
    // response.words deve conter a lista
    res.json(response);
  } catch (error) {
    console.error("Erro em /printWords:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Web server rodando em http://localhost:${PORT}`);
});
