# Trabalho 2 PSPD

Exemplo de Microserviço gRPC (C++ + Node.js + Front-End)


Este projeto demonstra como criar um servidor gRPC em C++ e um cliente gRPC em Node.js com uma interface front-end baseada em HTML, CSS e JavaScript que se comunicam usando o mesmo arquivo `.proto`.

-------------------------------------------------------------------------------

## Integrantes
|Matrícula | Aluno |
| -- | -- |
| 190084600  |  Arthur José Nascimento de Lima |
| 200019015  |  Guilherme Puida Moreira |
| 200067923  |  João Henrique Marques Calzavara |
| 200062379  |  Marcos Vinícius de Deus |

## Servidor gRPC C++

Essa é a parte do servidor gRPC na linguagem C++ do nosso trabalho, que pode ser encontrado na pasta [cpp](/cpp/).
Segue abaixo um tutorial de como rodar localmente.

### Guia de Instalação via Docker e Configuração do Servidor gRPC

#### Passo 1: Construir e Executar a Imagem Docker

```bash
docker build -t mygrpc .
docker run -it -p 9999:9999 mygrpc
```

#### Passo 2: Configuração do Servidor

1. Crie o diretório do servidor:

```bash
mkdir /root/server
cd /root/server
```

2. Crie o arquivo `CMakeLists.txt` com o seguinte conteúdo inicial:

```cmake
cmake_minimum_required(VERSION 3.20)
project(myserver)

set (CMAKE_EXPORT_COMPILE_COMMANDS ON)
find_package(Protobuf CONFIG REQUIRED)
find_package(gRPC CONFIG REQUIRED)

add_executable(server src/server.cc)
target_link_libraries(server gRPC::grpc++)
```

3. Crie o diretório `build` e configure o projeto:

```bash
mkdir build
cd build
cmake ..
```

##### Saída esperada do CMake

```plaintext
-- The C compiler identification is GNU 13.3.0
-- The CXX compiler identification is GNU 13.3.0
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /usr/bin/cc - skipped
-- Detecting C compile features
-- Detecting C compile features - done
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Performing Test CMAKE_HAVE_LIBC_PTHREAD
-- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Success
-- Found Threads: TRUE  
-- Configuring done (0.5s)
-- Generating done (0.0s)
-- Build files have been written to: /root/server/build
```

4. Retorne ao diretório principal:

```bash
cd ..
```

5. Crie o diretório `src` e o arquivo inicial do servidor:

```bash
mkdir src
vim src/server.cc
```

##### Conteúdo inicial de `server.cc`

```cpp
int main() {
    return 0;
}
```

6. Atualize o arquivo `CMakeLists.txt` para incluir a biblioteca proto:

```cmake
cmake_minimum_required(VERSION 3.20)
project(myserver)

set (CMAKE_EXPORT_COMPILE_COMMANDS ON)
find_package(Protobuf CONFIG REQUIRED)
find_package(gRPC CONFIG REQUIRED)

add_library(protolib proto/dictionary.proto)
target_link_libraries(protolib gRPC::grpc++)

target_include_directories(protolib PUBLIC ${CMAKE_CURRENT_BINARY_DIR})
protobuf_generate(TARGET protolib LANGUAGE cpp)

add_executable(server src/server.cc)
target_link_libraries(server gRPC::grpc++)
```

7. Compile o projeto:

```bash
cd build
make
```

#### Passo 3: Configuração Final do CMake

Atualize novamente o arquivo `CMakeLists.txt` com a configuração final:

```cmake
cmake_minimum_required(VERSION 3.20)
project(myserver)

set (CMAKE_EXPORT_COMPILE_COMMANDS ON)
find_package(Protobuf CONFIG REQUIRED)
find_package(gRPC CONFIG REQUIRED)

add_library(protolib proto/dictionary.proto)
target_link_libraries(protolib gRPC::grpc++)
target_include_directories(protolib PUBLIC ${CMAKE_CURRENT_BINARY_DIR})
get_target_property(grpc_cpp_plugin_location gRPC::grpc_cpp_plugin LOCATION)

protobuf_generate(TARGET protolib LANGUAGE cpp)
protobuf_generate(TARGET protolib LANGUAGE grpc
    GENERATE_EXTENSIONS .grpc.pb.h .grpc.pb.cc
    PLUGIN "protoc-gen-grpc=${grpc_cpp_plugin_location}")

add_executable(server src/server.cc)
target_link_libraries(server protolib)
```

Recompile o projeto:

```bash
cd build
make
```

#### Passo 4: Implementação do Servidor gRPC

Atualize o arquivo `server.cc` com a implementação do serviço:

```cpp
#include <grpcpp/grpcpp.h>
#include "proto/dictionary.grpc.pb.h"
#include "proto/dictionary.pb.h"

class ProcessingImpl : public DictionaryService::Service {
    private:
        std::map<std::string, int> dictionary;

    ::grpc::Status AddWord(::grpc::ServerContext* context, const ::WordRequest* request, ::WordResponse* response) {
        std::cout << "Função AddWord Chamada" << std::endl;
        const std::string& word = request->word();
        if (dictionary.find(word) != dictionary.end()) {
            dictionary[word]++;
        } else {
            dictionary[word] = 1;
        }
        response->set_message("Word added successfully: " + word);
        return grpc::Status::OK;
    }

    ::grpc::Status GetDictionary(::grpc::ServerContext* context, const ::EmptyRequest* request, ::DictionaryResponse* response) {
        std::cout << "Função GetDictionary Chamada" << std::endl;
        for (const auto& entry : dictionary) {
            (*response->mutable_words())[entry.first] = entry.second;
        }
        return grpc::Status::OK;
    }
};

int main() {
    ProcessingImpl service;
    grpc::ServerBuilder builder;

    builder.AddListeningPort("0.0.0.0:9999", grpc::InsecureServerCredentials());
    builder.RegisterService(&service);

    std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
    server->Wait();
    return 0;
}
```

## Cliente gRPC JavaScript + FrontEnd

Essa é a parte do cliente gRPC na linguagem Javascript do nosso trabalho, que pode ser encontrado na pasta [CLient](/Client/).
Segue abaixo um tutorial de como rodar localmente.

## Configurar o Cliente gRPC e Front-End no Node.js

### Instalar dependências Node.js

Inicie um projeto com Yarn e adicione as dependências necessárias:

```bash
yarn init -y
yarn add @grpc/grpc-js @grpc/proto-loader express body-parser
```

### Criar o cliente gRPC (`dictionary_client.js`)

Este arquivo encapsula a lógica para comunicação com o servidor C++ via gRPC.

### Criar o servidor Express (`web_server.js`)

Este servidor fornece rotas HTTP (`/addWord` e `/printWords`) para o front-end se comunicar. As requisições feitas pelo front-end são processadas pelo servidor Express, que chama o cliente gRPC.

-------------------------------------------------------------------------------
### Front-End: HTML, CSS, e JavaScript

#### Estrutura do Front-End

- **`index.html`**: Interface principal. Pergunta ao usuário se ele quer adicionar uma palavra ou imprimir a lista completa.
- **`style.css`**: Organiza o layout para ser simples e intuitivo.

### Iniciar o servidor Node.js

1. Vá para a pasta `client`.
2. Instale as dependências do Node.js:
   ```bash
   yarn install
   ```
3. Inicie o servidor Express:
   ```bash
   node web_server.js
   ```

### Acessar o Front-End

Abra no navegador:

```
http://localhost:3000
```

## Fluxo do Sistema

1. O usuário acessa o **front-end** e escolhe entre:  
   - **Adicionar uma palavra**: Envia a palavra para o servidor gRPC via `/addWord`.  
   - **Imprimir lista**: Envia `"IMPRIMIR"` para o servidor gRPC via `/printWords`.  

2. O servidor Express processa as requisições e chama o cliente gRPC (`dictionary_client.js`) para se comunicar com o servidor C++.  

3. O servidor C++ executa a lógica de adicionar ou listar palavras e retorna os resultados ao front-end via Express.

