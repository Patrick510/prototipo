# 🕶️ Projeto Óculos Inteligentes 4BLIND

Este projeto é uma aplicação assistiva para pessoas cegas, desenvolvida para descrever o ambiente ao redor do usuário por meio de inteligência artificial. A aplicação utiliza a câmera, o microfone e algoritmos de IA para interpretar e comunicar informações visuais ao usuário de forma acessível.

## 🚀 Funcionalidades

- **Acesso à câmera:** Captura de imagens do ambiente em tempo real, permitindo que o usuário tenha uma visão do ambiente ao seu redor.
- **Entrada de áudio:** O usuário pode interagir com o sistema usando comandos de voz para solicitar informações sobre o ambiente.
- **Descrição do ambiente:** A aplicação processa as imagens capturadas para gerar descrições textuais ou em áudio que são comunicadas ao usuário.
- **Backend com Flask ou Node.js:** Suporte para diferentes frameworks dependendo da branch utilizada. O backend processa os dados de imagem e áudio para gerar as descrições.

### Diretórios principais:

- **/uploads:** Armazena imagens e arquivos temporários enviados pelo usuário.
- **/static:** Contém arquivos estáticos, como imagens e scripts.
- **/templates:** Contém os arquivos HTML para renderização do frontend.
- **/src:** Código-fonte principal da aplicação (backend).

## 🛠️ Tecnologias Utilizadas

- **Frontend:** JavaScript, HTML, CSS
- **Backend:**
  - **Flask** - Framework Python para backend.
- **Inteligência Artificial:**
  - **google-generativeai (gemini):** API de IA usada para gerar descrições das imagens.
- **Ferramentas e Bibliotecas:**
  - **SpeechRecognition:** Para o reconhecimento de comandos de voz do usuário.
  - **OpenCV:** Para captura e processamento de imagens da câmera.
  - **Flask/Node.js:** Para gerenciamento do backend.
  - **FFmpeg:** Necessário para o processamento de áudio e vídeo em algumas plataformas, especialmente no Linux.

## 🐳 Rodando com Docker

Para facilitar a execução, o projeto pode ser rodado usando Docker.

### 📌 Pré-requisitos

- **Docker** instalado na máquina.

### 🚀 Como rodar

1. **Clone o repositório e entre na pasta do projeto:**
   ```sh
   git clone https://github.com/seu_usuario/oculos-inteligentes-4blind.git
   cd oculos-inteligentes-4blind
   ```

### Criando uma imagem Docker do projeto

Com o Docker instalado e o repositório clonado, você pode construir a imagem Docker do projeto. No terminal, execute o seguinte comando na pasta onde está o arquivo `Dockerfile`:

```sh
docker build -t oculos-inteligentes .
```

### Rodando o contêiner

Após a imagem ser construída, você pode rodar o contêiner com o comando abaixo:

```sh
docker run -p 5000:5000 oculos-inteligentes
```
