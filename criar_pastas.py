import os

# Caminho base onde a árvore de pastas será criada
base_path = os.path.join(os.path.expanduser("~"), "Coordenação Pedagógica")

def criar_pasta(caminho):
    if not os.path.exists(caminho):
        os.makedirs(caminho)
        print(f"Pasta criada: {caminho}")
    else:
        print(f"Pasta já existe: {caminho}")

# Árvore de diretórios
estrutura = {
    "Ensino Fundamental": {
        "Anos Iniciais (1ª à 5ª Série)": {
            f"{i}ª Série": ["Arte", "Classe Anos Iniciais", "Educação Física", "Língua Inglesa"]
            for i in range(1, 6)
        },
        "Anos Finais": {
            "6º Ano": [
                "Arte", "Ciências", "Educação Física", "Educação Financeira", "Geografia", "História",
                "Língua Inglesa", "Língua Portuguesa", "Matemática", "Projeto de Vida", 
                "Redação e Leitura", "Tecnologia e Inovação"
            ],
            "7º Ano": [
                "Arte", "Ciências", "Educação Física", "Educação Financeira", "Geografia", "História",
                "Língua Inglesa", "Língua Portuguesa", "Matemática", "Projeto de Vida", 
                "Redação e Leitura", "Tecnologia e Inovação"
            ],
            "8º Ano": [
                "Arte", "Ciências", "Educação Física", "Geografia", "História",
                "Língua Inglesa", "Língua Portuguesa", "Matemática", 
                "Orientação de Estudo – LP", "Orientação de Estudo – Matemática", 
                "Projeto de Vida", "Redação e Leitura"
            ],
            "9º Ano": [
                "Arte", "Ciências", "Educação Física", "Geografia", "História",
                "Língua Inglesa", "Língua Portuguesa", "Matemática", 
                "Orientação de Estudo – LP", "Orientação de Estudo – Matemática", 
                "Projeto de Vida", "Redação e Leitura"
            ],
        }
    },
    "Ensino Médio": {
        "1º Ano": [
            "Arte", "Biologia", "Educação Física", "Educação Financeira", "Filosofia", "Física",
            "Geografia", "História", "Inglês", "Língua Portuguesa", "Matemática", "Química", 
            "Redação e Leitura"
        ],
        "2º Ano A - Humanas": [
            "Biologia", "Educação Física", "Educação Financeira", "Empreendedorismo", "Física",
            "Geografia", "História", "Liderança", "Língua Inglesa", "Língua Portuguesa", 
            "Matemática", "Oratória", "Programação", "Química", "Redação e Leitura", "Sociologia"
        ],
        "2º Ano B - Exatas": [
            "Biologia", "Educação Física", "Educação Financeira", "Empreendedorismo", "Física",
            "Geografia", "História", "Liderança", "Língua Inglesa", "Língua Portuguesa", 
            "Matemática", "Programação", "Química", "Redação e Leitura", "Sociologia"
        ],
    },
    "Ensino Médio Técnico": {
        "Disciplinas Comuns": [
            "Biologia", "Educação Física", "Física", "Geografia", "História", "Língua Inglesa",
            "Língua Portuguesa", "Matemática", "Química", "Sociologia"
        ],
        "Técnico em Administração de Empresas": {
            "2º Ano": [
                "Carreira e Competências p/ Mercado de Trabalho em Administração", 
                "Introdução à Administração",
                "Legislação e Pessoas",
                "Matemática Aplicada à Administração"
            ],
            "3º Ano": [
                "Marketing Estratégico",
                "Inovação e Desenvolvimento de Negócios",
                "Gestão de Operações",
                "Gestão Financeira e Contabilidade",
                "Projeto Multidisciplinar em Administração"
            ]
        },
        "Técnico em Vendas": {
            "2º Ano": [
                "Comunicação Empresarial e Introdução a Vendas",
                "Carreira e Competências p/ Mercado de Trabalho em Vendas",
                "Comportamento, Legislação e Direito do Consumidor"
            ]
        },
        "Técnico em Desenvolvimento de Sistemas": {
            "2º Ano": [
                "Carreira e Competências p/ Mercado de Trabalho em DS",
                "Processos de Desenvolvimento de Software e Metodologias Ágeis",
                "Lógica e Linguagem de Programação",
                "Redes de Computadores e Segurança da Informação na Nuvem"
            ],
            "3º Ano": [
                "Programação Mobile",
                "Modelagem e Desenvolvimento de Banco de Dados",
                "Programação Front-End",
                "Programação Back-End",
                "Projeto Multidisciplinar em Desenvolvimento de Sistemas"
            ]
        }
    }
}

# Função recursiva para criar diretórios
def criar_estrutura(base, estrutura):
    for nome, conteudo in estrutura.items():
        caminho_atual = os.path.join(base, nome)
        criar_pasta(caminho_atual)

        if isinstance(conteudo, dict):
            criar_estrutura(caminho_atual, conteudo)
        elif isinstance(conteudo, list):
            for subpasta in conteudo:
                criar_pasta(os.path.join(caminho_atual, subpasta))

# Execução do script
if __name__ == "__main__":
    criar_estrutura(base_path, estrutura)
    print("\nCriação de pastas finalizada!")
