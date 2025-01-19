// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const readline = require('readline');

// // Ajuste se o arquivo .proto estiver em outra pasta
// const PROTO_PATH = './dictionary.proto';

// // Carrega o arquivo .proto
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });
// const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// // Obtemos o service Dictionary (pacote "dictionary")
// const DictionaryService = protoDescriptor.dictionary.Dictionary;

// // Cria o stub do cliente gRPC apontando para o servidor Python
// const client = new DictionaryService(
//   'localhost:50051', // Ajuste se o servidor estiver em outro IP/porta
//   grpc.credentials.createInsecure()
// );

// // Configura leitura interativa no terminal
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// console.log("==== Cliente do Microserviço Dicionário (Node.js) ====");
// console.log("Digite uma palavra para enviar ao servidor.\n"
//           + "Se digitar 'IMPRIMIR', o servidor retorna todas as palavras.\n"
//           + "Depois da requisição, o cliente encerra.\n");

// rl.question("Sua palavra: ", (word) => {
//   client.SendWord({ word }, (err, response) => {
//     if (err) {
//       console.error("Erro na chamada gRPC:", err);
//     } else {
//       if (word.toUpperCase() === "IMPRIMIR") {
//         console.log("\n== Lista de Palavras ==");
//         response.words.forEach((wc) => {
//           console.log(`  ${wc.word} = ${wc.count}`);
//         });
//       } else {
//         console.log("\n== Resposta do Servidor ==");
//         console.log(response.message);
//       }
//     }
//     rl.close();
//   });
// });


// grpc_client.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Carrega o .proto
const PROTO_PATH = path.join(__dirname, 'dictionary.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Pega o serviço "Dictionary" do pacote "dictionary"
const DictionaryService = protoDescriptor.dictionary.Dictionary;

// Cria um stub apontando para o servidor Python
// Ajuste o host/porta se o servidor Python estiver em outro lugar
const client = new DictionaryService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

/**
 * Função para enviar uma palavra qualquer.
 * - Se for 'IMPRIMIR', o servidor retorna a lista de words.
 * - Senão, apenas incrementa/inclui a palavra.
 */
function sendWord(word) {
  return new Promise((resolve, reject) => {
    client.SendWord({ word }, (err, response) => {
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
}

module.exports = {
  sendWord
};
