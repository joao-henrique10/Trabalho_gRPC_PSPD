#include <grpcpp/grpcpp.h>
#include "proto/dictionary.grpc.pb.h"
#include "proto/dictionary.pb.h"


class ProcessingImpl : public DictionaryService::Service {
    private:
        std::map<std::string, int> dictionary;
    ::grpc::Status AddWord(::grpc::ServerContext* context, const ::WordRequest* request, ::WordResponse* response){
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
    ::grpc::Status GetDictionary(::grpc::ServerContext* context, const ::EmptyRequest* request, ::DictionaryResponse* response){
        std::cout << "Função GetDictionary Chamado" << std::endl;
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