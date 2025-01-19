import grpc
from concurrent import futures
import os
import json

import dictionary_pb2
import dictionary_pb2_grpc

DICT_FILE = "palavras.json"

class DictionaryService(dictionary_pb2_grpc.DictionaryServicer):
    def __init__(self):
        if os.path.exists(DICT_FILE):
            try:
                with open(DICT_FILE, "r", encoding="utf-8") as f:
                    self.words = json.load(f)
            except json.JSONDecodeError:
                print("[LOG] O arquivo 'palavras.json' está vazio ou inválido; iniciando vazio.")
                self.words = {}
        else:
            self.words = {}

    def SendWord(self, request, context):
        word = request.word.strip()
        peer_info = context.peer()  # para logar o IP/porta do cliente

        if word.upper() == "IMPRIMIR":
            print(f"[LOG] Requisição de IMPRIMIR recebida de {peer_info}")
            reply = dictionary_pb2.WordReply(
                success=True,
                message="Listando todo o dicionário..."
            )
            # Adiciona cada palavra e contagem na resposta
            for w, cnt in self.words.items():
                wc = reply.words.add()
                wc.word = w
                wc.count = cnt
            return reply
        else:
            print(f"[LOG] Requisição de palavra '{word}' recebida de {peer_info}")

            # Se existir, incrementa; se não, começa em 1
            if word in self.words:
                self.words[word] += 1
                msg = f"A palavra '{word}' foi incrementada (agora = {self.words[word]})"
            else:
                self.words[word] = 1
                msg = f"A palavra '{word}' foi inserida com count=1"

            # Salva o dicionário atualizado no arquivo JSON
            with open(DICT_FILE, "w", encoding="utf-8") as f:
                json.dump(self.words, f, ensure_ascii=False, indent=2)

            return dictionary_pb2.WordReply(
                success=True,
                message=msg
            )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    dictionary_pb2_grpc.add_DictionaryServicer_to_server(
        DictionaryService(), server
    )
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Servidor rodando na porta 50051...")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
