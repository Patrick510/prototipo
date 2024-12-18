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
const data = [];

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

  enviarArquivosParaAPI();
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
  data.push(imageDataURL);

  photoContainer.innerHTML = "";
  photoContainer.appendChild(img);
}

function iniciarGravacao() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      audioRecorder = new MediaRecorder(stream);
      audioRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      audioRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        console.log("Gravação de áudio finalizada! Dados:", audioBlob);
        data.push(audioBlob);
        mostrarAudioGravado(audioBlob);
      };
      audioRecorder.start();
    })
    .catch((error) => console.error("Erro ao acessar o microfone: ", error));
}

function mostrarAudioGravado(blob) {
  const audioUrl = URL.createObjectURL(blob);
  const audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.src = audioUrl;

  audioContainer.innerHTML = "";
  audioContainer.appendChild(audioElement);
}

function pararGravacao() {
  if (audioRecorder && audioRecorder.state === "recording") {
    audioRecorder.stop();
    console.log(data);
    console.log("Gravação de áudio parada!");
  } else {
    console.error("Nenhuma gravação em andamento para parar.");
  }
}

function enviarArquivosParaAPI() {
  const formData = new FormData();

  if (data.length > 0) {
    const imageData = data.find((item) => item.startsWith("data:image"));
    const audioData = data.find((item) => item instanceof Blob);

    if (imageData && audioData) {
      const imageBlob = dataURLToBlob(imageData);
      formData.append("image", imageBlob, "image.png");

      if (audioData.size > 0) {
        formData.append("audio", audioData, "audio.webm");
      }

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Resposta da API:", data);
          if (data.error) {
            alert("Erro: " + data.error);
          } else {
            alert("Imagem e áudio enviados com sucesso!");
          }
        })
        .catch((error) => {
          console.error("Erro ao enviar os arquivos:", error);
          alert("Erro ao enviar os arquivos.");
        });
    } else {
      alert("Erro: Imagem ou áudio não estão disponíveis.");
    }
  }
}
