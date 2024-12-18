const record = document.querySelector("#record");
const stop = document.querySelector("#stop");
const video = document.querySelector("#video");
const photoContainer = document.querySelector("#photoContainer");
const audioContainer = document.querySelector("#audioContainer");

let stream = null;
let audioRecorder = null;
let audioChunks = [];
let audioBlob = null;
let imageDataURL = null;

// Inicializa a câmera e exibe o vídeo
async function iniciarCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.error("Erro ao acessar a câmera:", err);
  }
}

// Event Listeners para iniciar e parar gravação
record.addEventListener("click", () => {
  tirarFoto();
  iniciarGravacao();
  alternarBotoes(true);
});

stop.addEventListener("click", () => {
  pararGravacao();
  enviarArquivosParaAPI();
  alternarBotoes(false);
});

// Alterna a habilitação dos botões
function alternarBotoes(isRecording) {
  record.disabled = isRecording;
  stop.disabled = !isRecording;
}

// Captura uma foto do vídeo
function tirarFoto() {
  const canvas = document.getElementById("canvas");
  const contexto = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

  imageDataURL = canvas.toDataURL("image/png");
  exibirImagem(imageDataURL);
}

// Exibe a imagem capturada
function exibirImagem(dataURL) {
  const img = document.createElement("img");
  img.src = dataURL;
  img.className = "rounded-lg border border-gray-300 mt-4";

  photoContainer.innerHTML = "";
  photoContainer.appendChild(img);
}

// Inicia a gravação de áudio
function iniciarGravacao() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      audioRecorder = new MediaRecorder(stream);
      audioRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      audioRecorder.onstop = processarAudio;
      audioRecorder.start();
    })
    .catch((err) => console.error("Erro ao acessar o microfone:", err));
}

// Processa o áudio após a gravação parar
function processarAudio() {
  audioBlob = new Blob(audioChunks, { type: "audio/webm" });
  exibirAudioGravado(audioBlob);
}

// Exibe o áudio gravado
function exibirAudioGravado(blob) {
  const audioUrl = URL.createObjectURL(blob);
  const audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.src = audioUrl;

  audioContainer.innerHTML = "";
  audioContainer.appendChild(audioElement);
}

// Para a gravação de áudio
function pararGravacao() {
  if (audioRecorder && audioRecorder.state === "recording") {
    audioRecorder.stop();
  } else {
    console.error("Nenhuma gravação em andamento para parar.");
  }
}

// Envia os arquivos para a API
function enviarArquivosParaAPI() {
  if (!imageDataURL || !audioBlob) {
    alert("Erro: Imagem ou áudio não estão disponíveis.");
    return;
  }

  const formData = new FormData();
  formData.append("image", dataURLToBlob(imageDataURL), "image.png");
  formData.append("audio", audioBlob, "audio.webm");

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Resposta da API:", data);
      alert(
        data.error
          ? `Erro: ${data.error}`
          : "Imagem e áudio enviados com sucesso!"
      );
    })
    .catch((err) => {
      console.error("Erro ao enviar os arquivos:", err);
      alert("Erro ao enviar os arquivos.");
    });
}

// Converte dataURL para Blob
function dataURLToBlob(dataURL) {
  const [header, base64] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const array = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new Blob([array], { type: mime });
}

// Inicializa a câmera ao carregar a página
iniciarCamera();
