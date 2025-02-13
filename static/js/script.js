let noise = new SimplexNoise();
const area = document.getElementById("visualiser");
const video = document.querySelector("#video");
const photoContainer = document.querySelector("#photoContainer");
const status = document.querySelector("#status");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const responseTextElement = document.getElementById("responseText");
const loadingElement = document.getElementById("loading");
const notificationSound = document.getElementById("notificationSound");

let recognition;
let isListening = false;
let isCapturing = false;
let isBusy = false;
responseTextElement.style.visibility = "hidden";

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

  gravarAudio();
};

function capturarImagem() {
  const status = document.querySelector("#status");
  const canvas = document.getElementById("canvas");
  const contexto = canvas.getContext("2d");
  const video = document.getElementById("video");
  const photoContainer = document.getElementById("photoContainer");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imgElement = document.createElement("img");
  imgElement.src = canvas.toDataURL("image/png");
  imgElement.className = "w-[54px] rounded-sm";

  status.innerHTML = "Imagem capturada!";
  photoContainer.innerHTML = "";
  photoContainer.appendChild(status);
  photoContainer.appendChild(imgElement);

  photoContainer.classList.remove("opacity-0", "-translate-y-5");
  photoContainer.classList.add("opacity-100", "translate-y-0");
}

function gravarAudio() {
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const texto = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      if (texto.includes("alex") && !isListening && !isBusy) {
        isListening = true;
        isCapturing = true;
        responseTextElement.style.visibility = "visible";
        responseTextElement.innerText = "Estou ouvindo...";
        capturarImagem();
        playNotificationSound();
      } else if (texto.includes("alex") && isBusy) {
        responseTextElement.style.visibility = "visible";
        responseTextElement.innerText =
          "Estou ocupado processando sua última solicitação. Por favor, aguarde.";
        setTimeout(() => {
          responseTextElement.style.visibility = "hidden";
        }, 3000);
      }

      if (texto.includes("câmbio") && isCapturing) {
        isListening = false;
        isCapturing = false;
        enviarImagemETexto();
      }

      if (isListening) {
        responseTextElement.innerText = texto;
      }
    };

    recognition.onerror = (event) => {
      console.error("Erro de reconhecimento: ", event.error);
    };

    recognition.onend = () => {
      if (isListening || isCapturing) {
        console.log("Reconhecimento de fala encerrado. Reiniciando...");
        recognition.start();
      }
    };

    recognition.start();
  } else {
    console.log("Web Speech API não é suportada neste navegador.");
  }
}

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

function reproduzirAudio() {
  fetch("/audio")
    .then((response) => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error("Erro ao carregar o áudio");
      }
    })
    .then((blob) => {
      const audioURL = URL.createObjectURL(blob);
      document.getElementById("audioPlayer").src = audioURL;
    })
    .catch((error) => console.error("Erro:", error));
}

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
  isBusy = true;
  loadingElement.classList.remove("hidden");

  const canvas = document.getElementById("canvas");
  const formData = new FormData();

  canvas.toBlob((imageBlob) => {
    formData.append("image", imageBlob, "captura.png");
    const texto = responseTextElement.innerText;
    formData.append("text", texto);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados enviados:", data);
        reproduzirAudio();
      })
      .catch((error) => console.error("Erro ao enviar os dados:", error));
  }, "image/png");
}

function updateStatus(message) {
  const statusElement = document.createElement("div");
  statusElement.className =
    "fixed top-0 left-0 right-0 bg-blue-500 text-white p-2 text-center";
  statusElement.textContent = message;
  document.body.appendChild(statusElement);
  setTimeout(() => {
    statusElement.remove();
  }, 3000);
}

function init() {
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

    gravarAudio();
    notificationSound.load();
  };

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(setupMicrophone)
    .catch((err) => {
      console.error("Erro ao acessar o microfone:", err);
      alert("Não foi possível acessar o microfone!");
    });
}

function setupMicrophone(stream) {
  const context = new AudioContext();
  const src = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();

  src.connect(analyser);
  analyser.fftSize = 512;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  startVis(analyser, dataArray);
}

function startVis(analyser, dataArray) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    area.clientWidth / area.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 100;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(area.clientWidth, area.clientHeight);
  renderer.setClearColor("#ffffff");

  area.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(20, 3);
  const material = new THREE.MeshLambertMaterial({
    color: "#374151",
    wireframe: true,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const light = new THREE.DirectionalLight("#ffffff", 0.8);
  light.position.set(100, 100, 100);
  scene.add(light);

  function render() {
    analyser.getByteFrequencyData(dataArray);

    const lowerHalf = dataArray.slice(0, dataArray.length / 2 - 1);
    const upperHalf = dataArray.slice(
      dataArray.length / 2 - 1,
      dataArray.length - 1
    );

    const lowerMax = max(lowerHalf);
    const upperAvg = avg(upperHalf);

    const lowerMaxFr = lowerMax / lowerHalf.length;
    const upperAvgFr = upperAvg / upperHalf.length;

    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.003;
    sphere.rotation.z += 0.005;

    WarpSphere(
      sphere,
      modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
      modulate(upperAvgFr, 0, 1, 0, 4)
    );
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();

  window.addEventListener("resize", () => {
    renderer.setSize(area.clientWidth, area.clientHeight);
    camera.aspect = area.clientWidth / area.clientHeight;
    camera.updateProjectionMatrix();
  });
}

let lastUpdate = 0;
const updateInterval = 1000 / 60;

function WarpSphere(mesh, bassFr, treFr) {
  const currentTime = performance.now();
  if (currentTime - lastUpdate < updateInterval) return;
  lastUpdate = currentTime;

  mesh.geometry.vertices.forEach(function (vertex, i) {
    var offset = mesh.geometry.parameters.radius;
    var amp = 5;
    var time = currentTime;
    vertex.normalize();
    var rf = 0.00001;
    var distance =
      offset +
      bassFr +
      noise.noise3D(
        vertex.x + time * rf * 4,
        vertex.y + time * rf * 6,
        vertex.z + time * rf * 7
      ) *
        amp *
        treFr *
        2;
    vertex.multiplyScalar(distance);
  });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
}

function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + fr * delta;
}

function avg(arr) {
  var total = arr.reduce(function (sum, b) {
    return sum + b;
  });
  return total / arr.length;
}

function max(arr) {
  return arr.reduce(function (a, b) {
    return Math.max(a, b);
  });
}

window.addEventListener("resize", () => {
  renderer.setSize(area.clientWidth, area.clientHeight);
  camera.aspect = area.clientWidth / area.clientHeight;
  camera.updateProjectionMatrix();
});

init();
