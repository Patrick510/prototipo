const record = document.querySelector("#record");
const stop = document.querySelector("#stop");
const video = document.querySelector("#video");
const photoContainer = document.querySelector("#photoContainer");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

window.onload = () => {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => (video.srcObject = stream))
    .catch((error) => {
      console.error("Erro ao acessar a câmera:", error);
      alert(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
    });

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognition.onstart = () => {
      console.log("A gravação de áudio começou...");
    };

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      console.log("Texto reconhecido:", texto);
      document.getElementById("textoReconhecido").innerText = texto;
    };

    recognition.onerror = (event) => {
      console.error("Erro de reconhecimento: ", event.error);
    };

    recognition.onend = () => {
      console.log("A gravação terminou.");
    };
  } else {
    console.log("Web Speech API não é suportada neste navegador.");
  }
};

record.addEventListener("click", () => {
  capturarImagem();
  iniciarReconhecimento();
  record.disabled = true;
  stop.disabled = false;
});

stop.addEventListener("click", () => {
  pararReconhecimento();
  enviarImagemETexto();
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

function iniciarReconhecimento() {
  recognition.start();
}

function pararReconhecimento() {
  recognition.stop();
}

function enviarImagemETexto() {
  const canvas = document.getElementById("canvas");
  const formData = new FormData();

  canvas.toBlob((imageBlob) => {
    formData.append("image", imageBlob, "captura.png");

    const texto = document.getElementById("textoReconhecido").innerText;
    formData.append("text", texto);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("Dados enviados:", data))
      .catch((error) => console.error("Erro ao enviar os dados:", error));
  }, "image/png");
}
