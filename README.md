﻿# Projeto Óculos Inteligentes 4BLIND

Este projeto é uma aplicação assistiva para pessoas cegas, desenvolvida para descrever o ambiente ao redor do usuário por meio de inteligência artificial. A aplicação utiliza a câmera, o microfone e algoritmos de IA para interpretar e comunicar informações visuais ao usuário de forma acessível.

## 🚀 Funcionalidades

- **Acesso à câmera:** Captura de imagens do ambiente em tempo real, permitindo que o usuário tenha uma visão do ambiente ao seu redor.
- **Entrada de áudio:** O usuário pode interagir com o sistema usando comandos de voz para solicitar informações sobre o ambiente.
- **Descrição do ambiente:** A aplicação processa as imagens capturadas para gerar descrições textuais ou em áudio que são comunicadas ao usuário.
- **Backend com Flask ou Node.js:** Suporte para diferentes frameworks dependendo da branch utilizada. O backend processa os dados de imagem e áudio para gerar as descrições.

## 📂 Estrutura do Projeto

O repositório está dividido em duas branches principais:

- **Branch `patrick`:** Protótipo inicial desenvolvido com Node.js.
- **Branch `nicholas`:** Protótipo desenvolvido com Flask.

### Diretórios principais:

- **/uploads:** Armazena imagens e arquivos temporários enviados pelo usuário.
- **/static:** Contém arquivos estáticos, como imagens e scripts.
- **/templates:** Contém os arquivos HTML para renderização do frontend.
- **/src:** Código-fonte principal da aplicação (backend).

## 🛠️ Tecnologias Utilizadas

- **Frontend:** JavaScript, HTML, CSS
- **Backend:**
  - **Flask** (para a branch `nicholas`) - Framework Python para backend.
  - **Node.js** (para a branch `patrick`) - Framework JavaScript para backend.
- **Inteligência Artificial:**
  - **google-generativeai (gemini):** API de IA usada para gerar descrições das imagens.
- **Ferramentas e Bibliotecas:**
  - **SpeechRecognition:** Para o reconhecimento de comandos de voz do usuário.
  - **OpenCV:** Para captura e processamento de imagens da câmera.
  - **Flask/Node.js:** Para gerenciamento do backend.
  - **FFmpeg:** Necessário para o processamento de áudio e vídeo em algumas plataformas, especialmente no Linux.

## 📖 Instalação e Uso

### Pré-requisitos

- **Python 3.8+** (para o backend Flask)
- **Node.js 16+** (para o backend Node.js)
- **Pip** (para Flask) ou **npm** (para Node.js)
- **FFmpeg:** (necessário no Linux para processamento de mídia)

### Passos para Instalação

#### 1. Clonando o repositório

Clone o repositório em sua máquina local:

```bash
git clone https://github.com/seu_usuario/oculos-inteligentes-4blind.git
cd oculos-inteligentes-4blind
```

#### 2. Escolhendo a branch

Escolha a branch que deseja utilizar:

Para o backend Flask:

```shellscript
git checkout nicholas
```

Para o backend Node.js:

```shellscript
git checkout patrick
```

#### 3. Instalando as dependências

Para o backend Flask:

```shellscript
pip install -r requirements.txt
```

Para o backend Node.js:

```shellscript
npm install
```

#### 4. Configurando as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```plaintext
GOOGLE_API_KEY=sua_chave_api_do_google_aqui
```

#### 5. Executando a aplicação

Para o backend Flask:

```shellscript
python app.py
```

Para o backend Node.js:

```shellscript
npm start
```

A aplicação estará disponível em `http://localhost:5000` (ou a porta especificada no seu código).

## 🧪 Testando a aplicação

1. Abra um navegador e acesse `http://localhost:5000`
2. Permita o acesso à câmera e ao microfone quando solicitado
3. Use os comandos de voz ou os botões na interface para interagir com a aplicação

<!--  ## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) para saber como contribuir para o projeto.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 📞 Contato

Se você tiver alguma dúvida ou sugestão, por favor, abra uma [issue](https://github.com/seu_usuario/oculos-inteligentes-4blind/issues) ou entre em contato conosco através de [[seu_email@exemplo.com](mailto:seu_email@exemplo.com)].
-->
