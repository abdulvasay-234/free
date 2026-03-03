/*
  HackUnion Smart Image Classifier - JavaScript
  ---------------------------------------------
  STEP-BY-STEP GUIDE:
  1) Paste your Teachable Machine model URL in MODEL_URL.
  2) Click "Start Camera" on the webpage.
  3) The model and webcam will load in the browser.
  4) Live predictions will display class names + confidence scores.

  IMPORTANT:
  - This project runs fully in the browser.
  - No backend server or database is required.
*/

// STEP 1: Add your Teachable Machine model URL here.
// Use local exported folder (default): "./my_model/"

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/9D3RopHL9/";

// STEP 2: These variables store our model, webcam, and prediction count.
let model;
let webcam;
let maxPredictions = 0;
let isRunning = false;
let predictionRows = [];
let lastPredictionTime = 0;
const PREDICTION_INTERVAL_MS = 120;

// STEP 3: Grab important UI elements from index.html.
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusText = document.getElementById("statusText");
const webcamContainer = document.getElementById("webcam-container");
const predictionContainer = document.getElementById("prediction-container");
const imageUploadInput = document.getElementById("imageUpload");
const uploadedImage = document.getElementById("uploadedImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

// STEP 4: Connect button click to start function.
startButton.addEventListener("click", initClassifier);
stopButton.addEventListener("click", stopCamera);
imageUploadInput.addEventListener("change", handleImageUpload);

// STEP 5: Stop webcam safely and release camera resources.
function stopCamera(showStatusMessage = true) {
  isRunning = false;

  if (webcam) {
    try {
      webcam.stop();
    } catch (error) {
      console.warn("Could not stop webcam with tmImage API:", error);
    }

    // Extra safety: stop any browser media tracks if available.
    const mediaStream = webcam.webcam?.srcObject;
    if (mediaStream && typeof mediaStream.getTracks === "function") {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  }

  webcam = null;
  startButton.disabled = false;
  stopButton.disabled = true;
  webcamContainer.innerHTML = '<p class="placeholder">Your camera feed will appear here.</p>';

  if (showStatusMessage) {
    statusText.textContent = "Status: Camera stopped.";
  }
}

// STEP 6: Build prediction rows once to avoid flickering re-renders.
function ensurePredictionRows() {
  if (predictionRows.length === maxPredictions && predictionContainer.children.length === maxPredictions) {
    return;
  }

  predictionContainer.innerHTML = "";
  predictionRows = [];

  for (let index = 0; index < maxPredictions; index += 1) {
    const row = document.createElement("div");
    row.className = "prediction-item";

    const classNode = document.createElement("div");
    const classStrong = document.createElement("strong");
    classStrong.textContent = "-";
    classNode.appendChild(classStrong);

    const confidenceNode = document.createElement("div");
    confidenceNode.textContent = "Confidence: 0.0%";

    row.appendChild(classNode);
    row.appendChild(confidenceNode);
    predictionContainer.appendChild(row);

    predictionRows.push({ classStrong, confidenceNode });
  }
}

// STEP 7: Load model once and reuse it for webcam or uploaded images.
async function loadModelIfNeeded() {
  if (model) return;

  // If URL is not set, show a helpful message.
  if (!MODEL_URL || !MODEL_URL.trim()) {
    statusText.textContent = "Status: Add your MODEL_URL in script.js first.";
    alert("Please set MODEL_URL in script.js before starting the camera or upload.");
    throw new Error("MODEL_URL is not configured.");
  }

  const base = MODEL_URL.endsWith("/") ? MODEL_URL : `${MODEL_URL}/`;
  const modelURL = `${base}model.json`;
  const metadataURL = `${base}metadata.json`;

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  ensurePredictionRows();
}

// STEP 8: Main function to initialize model + webcam.
async function initClassifier() {
  if (isRunning) return;

  isRunning = true;
  startButton.disabled = true;
  statusText.textContent = "Status: Loading model...";

  try {
    await loadModelIfNeeded();
    statusText.textContent = "Status: Model loaded. Requesting camera access...";

    // Create webcam with 320x240 resolution and flipped view for natural selfie mode.
    webcam = new tmImage.Webcam(320, 240, true);
    await webcam.setup();
    await webcam.play();

    // Clear placeholders and attach webcam canvas to UI.
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);

    ensurePredictionRows();
    stopButton.disabled = false;

    statusText.textContent = "Status: Camera started. Running live predictions...";

    // Start prediction loop.
    window.requestAnimationFrame(loop);
  } catch (error) {
    console.error(error);

    const message = String(error?.message || error || "");
    if (message.toLowerCase().includes("fetch") || message.toLowerCase().includes("model")) {
      statusText.textContent =
        "Status: Model files not found. Add my_model/model.json + metadata.json (+ .bin files) or set hosted MODEL_URL.";
    } else if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("denied")) {
      statusText.textContent =
        "Status: Camera permission denied. Allow camera in browser settings and retry.";
    } else if (message.toLowerCase().includes("secure") || message.toLowerCase().includes("https")) {
      statusText.textContent =
        "Status: Camera requires secure context. Run with Live Server (localhost) or HTTPS.";
    } else {
      statusText.textContent =
        "Status: Startup failed. Check model path, run on localhost, and allow camera access.";
    }

    startButton.disabled = false;
    stopButton.disabled = true;
    isRunning = false;
  }
}

// STEP 9: Loop function runs every animation frame.
async function loop() {
  if (!isRunning) return;

  webcam.update();

  const now = performance.now();
  if (now - lastPredictionTime >= PREDICTION_INTERVAL_MS) {
    lastPredictionTime = now;
    await predict();
  }

  window.requestAnimationFrame(loop);
}

// STEP 10: Render predictions in the same result area.
function renderPredictions(prediction) {
  ensurePredictionRows();

  // Sort highest confidence first for easier reading.
  prediction.sort((a, b) => b.probability - a.probability);

  const topPredictions = prediction.slice(0, maxPredictions);
  topPredictions.forEach((item, index) => {
    const row = predictionRows[index];
    if (!row) return;

    const confidence = (item.probability * 100).toFixed(1);
    row.classStrong.textContent = item.className;
    row.confidenceNode.textContent = `Confidence: ${confidence}%`;
  });
}

// STEP 11: Predict class probabilities for webcam frames.
async function predict() {
  const prediction = await model.predict(webcam.canvas);

  renderPredictions(prediction);
}

// STEP 12 (Optional): Fallback prediction using uploaded image.
async function handleImageUpload(event) {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  // Stop webcam if currently running, so upload mode is clear for students.
  stopCamera(false);

  statusText.textContent = "Status: Loading model and classifying uploaded image...";

  try {
    await loadModelIfNeeded();

    // Show uploaded image in preview section.
    const imageUrl = URL.createObjectURL(selectedFile);
    uploadedImage.src = imageUrl;
    uploadedImage.classList.remove("hidden");
    uploadPlaceholder.classList.add("hidden");

    // Wait until image is fully loaded before prediction.
    await new Promise((resolve, reject) => {
      uploadedImage.onload = () => resolve();
      uploadedImage.onerror = reject;
    });

    const prediction = await model.predict(uploadedImage);
    renderPredictions(prediction);
    statusText.textContent = "Status: Uploaded image classified successfully.";

    URL.revokeObjectURL(imageUrl);
  } catch (error) {
    console.error(error);
    statusText.textContent = "Status: Could not classify uploaded image. Check model URL and file.";
  }
}
