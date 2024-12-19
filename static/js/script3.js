const record = document.querySelector("#record");
const stop = document.querySelector("#stop");
const video = document.querySelector("#video");
const photoContainer = document.querySelector("#photoContainer");
const audioContainer = document.querySelector("#audioContainer");

let audioRecorder,
  audioBlob,
  audioChunks = [];

window.onload = () => {
  const video = document.getElementById("video");
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => (video.srcObject = stream))
    .catch((error) => {
      console.error("Erro ao acessar a câmera:", error);
      alert(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
    });
};

record.addEventListener("click", () => {
  capturarImagem();
  iniciarGravacao();
  record.disabled = true;
  stop.disabled = false;
});

stop.addEventListener("click", () => {
  pararGravacao();
  enviarImagemEAudio();
  record.disabled = false;
  stop.disabled = true;
});

function capturarImagem() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const contexto = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

  const photoContainer = document.getElementById("photoContainer");
  const imgElement = document.createElement("img");
  imgElement.src = canvas.toDataURL("image/png");
  imgElement.className = "rounded-lg w-full border border-gray-300";
  photoContainer.innerHTML = "";
  photoContainer.appendChild(imgElement);
}

function iniciarGravacao() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      audioRecorder = new MediaRecorder(stream);
      audioRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      audioRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        mostrarAudioGravado(audioBlob);
      };
      audioRecorder.start();
    })
    .catch((error) => console.error("Erro ao acessar o microfone:", error));
}

function pararGravacao() {
  if (audioRecorder?.state === "recording") {
    audioRecorder.stop();
  }
}

function mostrarAudioGravado(blob) {
  const audioContainer = document.getElementById("audioContainer");
  const audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.src = URL.createObjectURL(blob);
  audioContainer.innerHTML = "";
  audioContainer.appendChild(audioElement);
}

function enviarImagemEAudio() {
  const canvas = document.getElementById("canvas");
  const formData = new FormData();
  canvas.toBlob((imageBlob) => {
    formData.append("image", imageBlob, "captura.png");
    if (audioBlob) formData.append("audio", audioBlob, "gravacao.webm");

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("Dados enviados:", data))
      .catch((error) => console.error("Erro ao enviar os dados:", error));
  }, "image/png");
}
