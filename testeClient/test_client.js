const { sendWord, getDictionary } = require('./dictionary_client');

// Testar a função sendWord
sendWord('example', (err, response) => {
    if (err) {
        console.error('Erro ao adicionar palavra:', err);
    } else {
        console.log('Resposta do servidor (AddWord):', response.message);
    }

    // Após adicionar, testar getDictionary
    getDictionary({}, (err, response) => {
        if (err) {
            console.error('Erro ao obter dicionário:', err);
        } else {
            console.log('Dicionário recebido do servidor (GetDictionary):');
            for (const [word, count] of Object.entries(response.words)) {
                console.log(`- ${word}: ${count}`);
            }
        }
    });
});