const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Caminho para o arquivo .proto (mesmo usado no servidor C++)
const PROTO_PATH = './dictionary.proto';

// Carrega o arquivo .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Obtemos o serviço DictionaryService do pacote gerado
const DictionaryService = protoDescriptor.DictionaryService;

// Cria o cliente gRPC apontando para o servidor C++
// Certifique-se de que a porta corresponde à configurada no servidor
const client = new DictionaryService(
  'localhost:9999', // Porta configurada no servidor C++
  grpc.credentials.createInsecure()
);

/**
 * Função para adicionar uma palavra.
 * - Chama a RPC `AddWord` do servidor.
 * @param {string} word - Palavra a ser adicionada.
 * @param {function} callback - Callback para processar a resposta.
 */
function sendWord(word, callback) {
  client.AddWord({ word }, (err, response) => {
    if (err) {
      console.error('Erro ao chamar AddWord:', err);
      return callback(err, null);
    }
    callback(null, response);
  });
}

/**
 * Função para obter o dicionário completo.
 * - Chama a RPC `GetDictionary` do servidor.
 * @param {object} emptyRequest - Objeto vazio (padrão para a RPC).
 * @param {function} callback - Callback para processar a resposta.
 */
function getDictionary(emptyRequest, callback) {
  client.GetDictionary(emptyRequest, (err, response) => {
    if (err) {
      console.error('Erro ao chamar GetDictionary:', err);
      return callback(err, null);
    }
    callback(null, response);
  });
}

// Exporta as funções para uso no servidor Express (ou outros módulos)
module.exports = { sendWord, getDictionary };
