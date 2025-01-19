const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Necessário para servir arquivos estáticos
const { sendWord, getDictionary } = require('./dictionary_client');

const app = express();
const PORT = 3000;

// Configuração do body-parser para lidar com JSON
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

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

// Rota para servir o arquivo HTML principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor na porta configurada
app.listen(PORT, () => {
  console.log(`Servidor web rodando em http://localhost:${PORT}`);
});