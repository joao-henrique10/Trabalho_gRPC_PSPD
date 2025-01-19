const express = require('express');
const bodyParser = require('body-parser');
const { sendWord, getDictionary } = require('./dictionary_client'); // Atualize os métodos se necessário

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Rota para adicionar uma palavra
app.post('/addWord', async (req, res) => {
  const { word } = req.body;
  try {
    const response = await new Promise((resolve, reject) => {
      sendWord(word, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
    res.json({ message: response.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todas as palavras
app.get('/printWords', async (req, res) => {
  try {
    const response = await new Promise((resolve, reject) => {
      getDictionary({}, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
    res.json({ words: response.words });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor web rodando em http://localhost:${PORT}`);
});
