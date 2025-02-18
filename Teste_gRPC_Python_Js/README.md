# Trabalho 2 PSPD


# Trabalho 2 PSPD

Exemplo de Microserviço gRPC (Python + Node.js + Front-End)

Além do server em C++ que foi o principal do projeto, decidimos fazer também um em python para fins de aprendizado como mostrado abaixo.

Este projeto demonstra como criar um servidor gRPC em Python e um cliente gRPC em Node.js com uma interface front-end baseada em HTML, CSS e JavaScript que se comunicam usando o mesmo arquivo `.proto`.

-------------------------------------------------------------------------------
## Visão Geral

- **Protocolo**: gRPC  
- **Definição de serviço**: arquivo `.proto` (Protobuf)  
- **Servidor**: Python 3, com `grpcio`  
- **Cliente**: Node.js (JavaScript), usando `@grpc/grpc-js` e `@grpc/proto-loader`  
- **Front-End**: HTML, CSS, e JavaScript servidos por um servidor Express no Node.js  

O serviço expõe uma RPC: `SendWord(WordRequest) -> WordReply`.  
- Se a palavra for `"IMPRIMIR"`, o servidor retorna a lista completa de todas as palavras contabilizadas (com contagem).  
- Caso contrário, o servidor incrementa ou adiciona a contagem daquela palavra no dicionário em memória.  

-------------------------------------------------------------------------------
## Estrutura de Arquivos

```
server
├── dictionary.proto
├── dictionary_pb2.py
├── dictionary_pb2_grpc.py
├── dictionary_server.py    (Servidor Python)
├── palavras.json           (Armazena palavras persistentes)

client
├── node_modules
├── dictionary_client.js    (Cliente JavaScript para comunicação gRPC)
├── dictionary.proto        (Mesmo `.proto` usado pelo servidor Python)
├── web_server.js           (Servidor web Express para servir o front-end)
├── public/
│   ├── index.html          (Interface HTML principal)
│   └── style.css           (Estilo do front-end)
├── package.json
├── yarn.lock
```

-------------------------------------------------------------------------------
## 1. Arquivo `.proto`

O arquivo `.proto` continua o mesmo e define:

```proto
syntax = "proto3";

package dictionary;

// Uma única RPC "SendWord"
service Dictionary {
  rpc SendWord(WordRequest) returns (WordReply);
}

message WordRequest {
  string word = 1;
}

message WordReply {
  bool success = 1;
  string message = 2;
  repeated WordCount words = 3; // usado quando a palavra for "IMPRIMIR"
}

message WordCount {
  string word = 1;
  int32 count = 2;
}
```

-------------------------------------------------------------------------------
## 2. Configurar o Servidor em Python

### 2.1 Instalar dependências Python

Use Python 3. Recomenda-se criar um ambiente virtual. Depois, instale:

```bash
pip install grpcio grpcio-tools
```

### 2.2 Gerar o código Python a partir do `.proto`

Com o arquivo `dictionary.proto` na mesma pasta, rode:

```bash
python -m grpc_tools.protoc   -I.   --python_out=.   --grpc_python_out=.   dictionary.proto
```

### 2.3 Servidor Python (`dictionary_server.py`)

O servidor Python salva as palavras em `palavras.json` sempre que uma palavra é adicionada ou atualizada.  

-------------------------------------------------------------------------------
## 3. Configurar o Cliente gRPC e Front-End no Node.js

### 3.1 Instalar dependências Node.js

Inicie um projeto com Yarn e adicione as dependências necessárias:

```bash
yarn init -y
yarn add @grpc/grpc-js @grpc/proto-loader express body-parser
```

### 3.2 Criar o cliente gRPC (`dictionary_client.js`)

Este arquivo encapsula a lógica para comunicação com o servidor Python via gRPC.

### 3.3 Criar o servidor Express (`web_server.js`)

Este servidor fornece rotas HTTP (`/addWord` e `/printWords`) para o front-end se comunicar. As requisições feitas pelo front-end são processadas pelo servidor Express, que chama o cliente gRPC.

-------------------------------------------------------------------------------
## 4. Front-End: HTML, CSS, e JavaScript

### 4.1 Estrutura do Front-End

- **`index.html`**: Interface principal. Pergunta ao usuário se ele quer adicionar uma palavra ou imprimir a lista completa.
- **`style.css`**: Organiza o layout para ser simples e intuitivo.

-------------------------------------------------------------------------------
## 5. Executar o Projeto

### 5.1 Iniciar o servidor Python

1. Vá para a pasta `server`.
2. Crie a venv para conseguir instalar o grpc
```
python3 -m venv .venv
source .venv/bin/activate
```
3. Instale o grpc
```
pip install grpcio grpcio-tools
```
4. Certifique-se de que os arquivos `dictionary_pb2.py` e `dictionary_pb2_grpc.py` foram gerados.
5. Rode o servidor Python:
   ```bash
   python dictionary_server.py
   ```

### 5.2 Iniciar o servidor Node.js

1. Vá para a pasta `client`.
2. Instale as dependências do Node.js:
   ```bash
   yarn install
   ```
3. Inicie o servidor Express:
   ```bash
   node web_server.js
   ```

### 5.3 Acessar o Front-End

Abra no navegador:

```
http://localhost:3000
```

-------------------------------------------------------------------------------
## 6. Fluxo do Sistema

1. O usuário acessa o **front-end** e escolhe entre:  
   - **Adicionar uma palavra**: Envia a palavra para o servidor gRPC via `/addWord`.  
   - **Imprimir lista**: Envia `"IMPRIMIR"` para o servidor gRPC via `/printWords`.  

2. O servidor Express processa as requisições e chama o cliente gRPC (`dictionary_client.js`) para se comunicar com o servidor Python.  

3. O servidor Python executa a lógica de adicionar ou listar palavras e retorna os resultados ao front-end via Express.

-------------------------------------------------------------------------------
## 7. Teste de Interoperabilidade

1. Inicie o servidor Python:
   ```bash
   python dictionary_server.py
   ```
2. Inicie o servidor Node.js:
   ```bash
   node web_server.js
   ```
3. Acesse no navegador:  
   ```
   http://localhost:3000
   ```
4. Teste as funcionalidades:  
   - Adicionar palavras.  
   - Imprimir a lista completa.  

-------------------------------------------------------------------------------
## 8. Observações Finais

- **Versões**:  
  - Testado com Python 3.8+ e Node.js v14+ ou v16+.  
  - Yarn 1.x ou superior.

- **Persistência**: O arquivo `palavras.json` armazena o estado atual do dicionário no servidor Python.

- **Segurança**: Para produção, use TLS/SSL em vez de canais inseguros.

- **Extensões**: Se precisar de mais funcionalidades (como editar ou remover palavras), basta adicionar métodos ao `.proto` e atualizar o código correspondente.

--- 

Com este projeto, você combina um servidor gRPC em Python, um cliente gRPC em Node.js e um front-end funcional para criar uma aplicação moderna e interativa!