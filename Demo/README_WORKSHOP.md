# HackUnion Smart Image Classifier — Workshop Guide (Step-by-Step)

This guide is made for **beginner workshop sessions**.
It explains setup, demo flow, troubleshooting, and provides **separate full code blocks** for:
1) `index.html`
2) `styles.css`
3) `script.js`

---

## 1) Workshop Goal

Build a browser-only ML demo that:
- starts webcam,
- loads a Teachable Machine image model,
- shows class predictions with confidence,
- works without backend,
- includes upload fallback if webcam is unavailable.

---

## 2) Prerequisites

- VS Code
- A modern browser (Chrome/Edge recommended)
- Live Server extension in VS Code
- Teachable Machine model URL or exported model files

---

## 3) Project Structure

Use this structure:

```text
Demo/
├─ index.html
├─ styles.css
├─ script.js
├─ README.md
├─ WORKSHOP_README.md
├─ README_WORKSHOP.md
└─ my_model/
   └─ PUT_MODEL_FILES_HERE.txt
```

---

## 4) Model Setup Options

### Option A (Hosted URL — easiest)
1. Export model in Teachable Machine as TensorFlow.js
2. Copy hosted URL (example: `https://teachablemachine.withgoogle.com/models/xxxx/`)
3. Paste in `script.js` as `MODEL_URL`

### Option B (Local Files)
1. Export model as TensorFlow.js
2. Copy files into `my_model/`:
   - `model.json`
   - `metadata.json`
   - all `.bin` files
3. Set `MODEL_URL` to `"./my_model/"`

---

## 5) Run Locally

1. Open project folder in VS Code
2. Right-click `index.html`
3. Click **Open with Live Server**
4. Click **Start Camera**
5. Allow camera access in browser

> Important: avoid opening with `file://` directly for camera/model fetch reliability.

---

## 6) Classroom Demo Flow

1. Show title and explain this is browser-only ML
2. Click **Start Camera**
3. Demonstrate prediction updates (class + confidence)
4. Click **Stop Camera**
5. Upload an image as fallback mode
6. Show confidence changes and discuss model accuracy

---

## 7) Troubleshooting Checklist

- **Model not loading**:
  - verify `MODEL_URL`
  - verify `model.json`, `metadata.json`, `.bin` files
- **Camera denied**:
  - allow permission in browser site settings
- **Secure context issue**:
  - run via `localhost` (Live Server)
- **No prediction updates**:
  - check browser console for fetch errors

---

## 8) Full Code Blocks (File-by-File)

### A) `index.html`

```html
<!--
HackUnion Smart Image Classifier (Beginner Setup Guide)
========================================================
How to get your Teachable Machine model URL:
1) Go to https://teachablemachine.withgoogle.com/ and open your Image Project.
2) Click "Export Model".
3) Choose "Tensorflow.js".
4) You can use either:
  - "Upload (cloud hosted)" model URL
    Example: https://teachablemachine.withgoogle.com/models/abc123/
  - or "Download my model" and place the folder as ./my_model/

How to set your model path in this project:
1) Open script.js
2) Find: const MODEL_URL = "./my_model/";
3) Keep as-is if you downloaded model files into ./my_model/
4) Or replace with your hosted URL.
5) Keep the trailing slash (/) if possible.

How to run locally (no backend needed):
- Export from Teachable Machine as TensorFlow.js.
- Copy files into:
  - Demo/my_model/model.json
  - Demo/my_model/metadata.json
  - all .bin weight files from export
- Use VS Code "Live Server" extension and click "Go Live" (localhost).
- Do not open with file:// directly.
- Click Start Camera, then allow camera permission in browser.

Optional deployment with GitHub Pages:
1) Create a new GitHub repository and upload these files.
2) Go to Settings -> Pages.
3) Source: Deploy from a branch, Branch: main, Folder: / (root).
4) Save and open your Pages URL.
-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HackUnion Smart Image Classifier</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="bg-grid" aria-hidden="true"></div>

    <main class="app-shell">
      <header class="hero">
        <p class="chip">Student Tech Meetup Demo</p>
        <h1>HackUnion Smart Image Classifier</h1>
        <p class="subtitle">
          A beginner-friendly Machine Learning demo built with Teachable Machine + TensorFlow.js,
          running fully in your browser with no backend.
        </p>
      </header>

      <section class="controls card" aria-label="Camera controls">
        <button id="startButton" class="btn-primary">Start Camera</button>
        <button id="stopButton" class="btn-secondary" disabled>Stop Camera</button>
        <label for="imageUpload" class="upload-label">or Upload Image</label>
        <input id="imageUpload" class="upload-input" type="file" accept="image/*" />
        <p id="statusText" class="status">Status: Waiting to start...</p>
      </section>

      <section class="demo-grid">
        <article class="card webcam-card">
          <h2>Webcam Preview</h2>
          <div id="webcam-container" class="webcam-container">
            <p class="placeholder">Your camera feed will appear here.</p>
          </div>
        </article>

        <article class="card results-card">
          <h2>Prediction Results</h2>
          <div id="prediction-container" class="prediction-container">
            <p class="placeholder">Predictions will appear after camera starts.</p>
          </div>
        </article>

        <article class="card upload-card">
          <h2>Optional Fallback: Image Upload</h2>
          <div class="upload-preview-wrap">
            <img
              id="uploadedImage"
              class="uploaded-image hidden"
              alt="Selected image for prediction"
            />
            <p id="uploadPlaceholder" class="placeholder">
              If webcam access is blocked, upload an image to classify.
            </p>
          </div>
        </article>
      </section>

      <section class="card readme-section" aria-label="Project README">
        <h2>README for Students</h2>
        <p>
          This project shows how to run image classification in the browser using a model trained in
          Teachable Machine. You can change the model, redesign the UI, or add custom actions when
          a specific class is detected.
        </p>
        <ul>
          <li>Try retraining your own model (for hand signs, objects, or expressions).</li>
          <li>Replace the model URL in <strong>script.js</strong> and test instantly.</li>
          <li>Customize styles in <strong>styles.css</strong> to match your meetup branding.</li>
        </ul>
      </section>
    </main>

    <!-- Required ML libraries from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>
    <script src="script.js"></script>
  </body>
</html>
```

### B) `styles.css`

```css
/*
  HackUnion Smart Image Classifier - Styles
  -----------------------------------------
  Goal: Keep all visual styling in one place (centralized and easy to edit).
  Theme: Dark + neon tech look, responsive and workshop friendly.
*/

:root {
  --bg-0: #080b12;
  --bg-1: #0f1420;
  --card: rgba(18, 25, 38, 0.82);
  --line: rgba(107, 152, 255, 0.35);
  --text: #e6f1ff;
  --muted: #a9b8d5;
  --neon-cyan: #2ef2ff;
  --neon-blue: #4f7cff;
  --neon-purple: #a14dff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter", sans-serif;
  background: radial-gradient(circle at top right, #1a2450 0%, var(--bg-0) 46%, #05070b 100%);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

.bg-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
  z-index: -1;
}

.app-shell {
  max-width: 1050px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.hero {
  text-align: center;
  margin-bottom: 1.5rem;
  animation: fadeUp 0.75s ease-out;
}

.chip {
  display: inline-block;
  padding: 0.35rem 0.7rem;
  margin-bottom: 1rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(79, 124, 255, 0.12);
  font-size: 0.85rem;
  color: var(--neon-cyan);
}

h1 {
  margin: 0;
  font-size: clamp(1.7rem, 4vw, 2.6rem);
  line-height: 1.2;
}

.subtitle {
  margin: 0.75rem auto 0;
  max-width: 740px;
  color: var(--muted);
}

.card {
  border: 1px solid var(--line);
  background: var(--card);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03), 0 14px 40px rgba(0, 0, 0, 0.35);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin-bottom: 1rem;
}

.btn-primary {
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  color: white;
  padding: 0.75rem 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  box-shadow: 0 0 18px rgba(79, 124, 255, 0.45);
}

.upload-label {
  font-weight: 600;
  color: var(--text);
}

.upload-input {
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.45rem;
  background: rgba(9, 14, 24, 0.7);
}

.btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 0 24px rgba(161, 77, 255, 0.55);
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  border: 1px solid rgba(161, 77, 255, 0.6);
  border-radius: 12px;
  background: rgba(161, 77, 255, 0.12);
  color: #efe5ff;
  padding: 0.75rem 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 14px rgba(161, 77, 255, 0.25);
}

.btn-secondary:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 0 20px rgba(161, 77, 255, 0.35);
}

.btn-secondary:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.status {
  margin: 0;
  color: var(--muted);
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.webcam-card,
.results-card,
.upload-card,
.readme-section {
  padding: 1rem;
  animation: fadeUp 0.9s ease-out;
}

h2 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #f3f8ff;
}

.webcam-container,
.prediction-container {
  min-height: 250px;
  border: 1px dashed rgba(46, 242, 255, 0.35);
  border-radius: 12px;
  padding: 0.75rem;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(8, 13, 24, 0.7), rgba(9, 18, 33, 0.4));
}

.webcam-container canvas {
  width: 100%;
  max-width: 460px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 0 22px rgba(46, 242, 255, 0.15);
}

.placeholder {
  margin: 0;
  text-align: center;
  color: var(--muted);
}

.upload-preview-wrap {
  min-height: 250px;
  border: 1px dashed rgba(161, 77, 255, 0.45);
  border-radius: 12px;
  padding: 0.75rem;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(8, 13, 24, 0.7), rgba(18, 10, 33, 0.35));
}

.uploaded-image {
  width: 100%;
  max-width: 460px;
  max-height: 320px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 0 22px rgba(161, 77, 255, 0.2);
}

.hidden {
  display: none;
}

.prediction-item {
  width: 100%;
  border: 1px solid rgba(79, 124, 255, 0.3);
  border-radius: 10px;
  padding: 0.55rem 0.65rem;
  margin-bottom: 0.55rem;
  background: rgba(12, 19, 32, 0.8);
  animation: pulseIn 0.35s ease;
}

.prediction-item strong {
  color: var(--neon-cyan);
}

.readme-section p,
.readme-section li {
  color: var(--muted);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (min-width: 860px) {
  .demo-grid {
    grid-template-columns: 1fr 1fr;
  }

  .readme-section {
    grid-column: 1 / -1;
  }

  .upload-card {
    grid-column: 1 / -1;
  }
}
```

### C) `script.js`

```javascript
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
// Or hosted URL example: "https://teachablemachine.withgoogle.com/models/abc123/"
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
```

---

## 9) Student Customization Ideas

- Change color theme in `styles.css`
- Add emoji/sound when confidence exceeds 90%
- Add "Top 1 prediction only" mode
- Add a class-history panel for last 10 predictions

---

## 10) No-Backend Reminder

This project is fully frontend-only:
- no server logic
- no database
- no API keys required

Perfect for beginner workshops and fast demos.
