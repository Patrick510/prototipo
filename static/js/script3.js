const record = document.querySelector("#record");
const stop = document.querySelector("#stop");
const video = document.querySelector("#video");
const photoContainer = document.querySelector("#photoContainer");
const audioContainer = document.querySelector("#audioContainer");

let stream = null;
let mediaRecorder = null;
let audioChunks = [];
let audioRecorder;
let audioBlob;
let imageDataURL;

navigator.mediaDevices
  .getUserMedia({ audio: false, video: true })
  .then((mediaStream) => {
    stream = mediaStream;

    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    console.error("Erro ao acessar mídia:", err);
  });

record.addEventListener("click", () => {
  tirarFoto();
  iniciarGravacao();
  record.disabled = true;
  stop.disabled = false;
});

stop.addEventListener("click", () => {
  pararGravacao();
  record.disabled = false;
  stop.disabled = true;
});

function tirarFoto() {
  const canvas = document.getElementById("canvas");
  const video = document.getElementById("video");
  const contexto = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

  imageDataURL = canvas.toDataURL("image/png");
  const img = document.createElement("img");
  img.src = imageDataURL;
  img.className = "rounded-lg border border-gray-300 mt-4";

  photoContainer.innerHTML = "";
  photoContainer.appendChild(img);
}

function iniciarGravacao() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((audioStream) => {
      audioRecorder = new MediaRecorder(audioStream);

      audioRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      audioRecorder.onstop = () => {
        console.log("Tipo do primeiro chunk:", audioChunks[0]?.type);
        audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        mostrarAudioGravado(audioBlob);
        audioChunks = [];
      };

      audioRecorder.start();
      console.log("Gravação de áudio iniciada!");
    })
    .catch((err) => {
      console.error("Erro ao acessar o áudio:", err);
    });
}

function mostrarAudioGravado(blob) {
  const audioUrl = URL.createObjectURL(blob);
  const audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.src = audioUrl;

  const downloadButton = document.createElement("a");
  downloadButton.href = audioUrl;
  downloadButton.download = "audio_gravado.webm";
  downloadButton.textContent = "Baixar Áudio";
  downloadButton.className = "btn btn-primary mt-2";

  audioContainer.innerHTML = "";
  audioContainer.appendChild(audioElement);
  audioContainer.appendChild(downloadButton);
}

function pararGravacao() {
  if (audioRecorder && audioRecorder.state === "recording") {
    audioRecorder.stop();
    console.log("Gravação de áudio parada!");
    console.log("Áudio gravado:", audioBlob);
    console.log("Imagem capturada:", imageDataURL);
  } else {
    console.error("Nenhuma gravação em andamento para parar.");
  }
}
