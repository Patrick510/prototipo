const record = document.querySelector("#record");
const stop = document.querySelector("#stop");
const canvas = document.querySelector("#canvas");
const audioContainer = document.querySelector("#audioContainer");

let stream = null;
let mediaRecorder = null;
let audioChunks = [];

navigator.mediaDevices
  .getUserMedia({ audio: true, video: false })
  .then((mediaStream) => {
    stream = mediaStream;
  })
  .catch((err) => {
    console.error("getUserMedia Error: ", err);
  });

record.addEventListener("click", () => {
  iniciarGravacao();
});
stop.addEventListener("click", () => {
  pararGravacao();
});

function iniciarGravacao() {
  if (!stream) {
    console.error("Stream não está disponível.");
    return;
  }

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(audioBlob);
    const audioElement = document.createElement("audio");

    audioElement.controls = true;
    audioElement.src = url;

    audioContainer.innerHTML = "";
    audioContainer.appendChild(audioElement);
    audioChunks = [];

    const a = document.createElement("a");
    a.href = url;
    a.download = "audio.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  mediaRecorder.start();
  console.log("Gravação iniciada!");

  setTimeout(() => {
    pararGravacao();
  }, 5000);
}

function pararGravacao() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("Gravação parada!");
    stream.getTracks().forEach((track) => track.stop());
  }
}
