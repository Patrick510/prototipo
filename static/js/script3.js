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
  if (!stream) {
    console.error("Stream não está disponível.");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((audioStream) => {
      audioRecorder = new MediaRecorder(audioStream);

      audioRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      audioRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
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
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = URL.createObjectURL(blob);

  audioContainer.innerHTML = "";
  audioContainer.appendChild(audio);
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

audioRecorder.onstop = () => {
  audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
  mostrarAudioGravado(audioBlob);
  console.log("Áudio gravado:", audioBlob);
  audioChunks = [];
};
