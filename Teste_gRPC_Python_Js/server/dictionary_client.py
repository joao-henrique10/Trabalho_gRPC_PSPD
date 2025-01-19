import grpc
import dictionary_pb2
import dictionary_pb2_grpc

def main():
    channel = grpc.insecure_channel('localhost:50051')
    stub = dictionary_pb2_grpc.DictionaryStub(channel)

    print("Digite uma palavra para enviar ao servidor.\n" 
          "Se digitar 'IMPRIMIR', o servidor retorna todas as palavras.\n"
          "Depois de enviar, o cliente encerra.\n")

    palavra = input("Sua palavra: ").strip()

    request = dictionary_pb2.WordRequest(word=palavra)
    reply = stub.SendWord(request)

    # Se foi "IMPRIMIR", a resposta conterá 'words' preenchido
    if palavra.upper() == "IMPRIMIR":
        print("\n== Conteúdo do dicionário retornado pelo servidor ==\n")
        for wc in reply.words:
            print(f"{wc.word} = {wc.count}")
    else:
        # Apenas exibe a mensagem do servidor
        print(f"\n== Resposta do servidor ==\n{reply.message}")

if __name__ == "__main__":
    main()
