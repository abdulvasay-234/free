# HackUnion Smart Image Classifier

A beginner-friendly Machine Learning demo website using:
- HTML, CSS, JavaScript
- TensorFlow.js (CDN)
- Teachable Machine Image library (CDN)

## What students learn
- How to use a Teachable Machine model in a browser
- How to access webcam input with JavaScript
- How to display model predictions and confidence
- How to separate project files (`index.html`, `styles.css`, `script.js`) for clean structure

## Quick start
1. Export from Teachable Machine as TensorFlow.js
2. Copy exported files into:
	- `Demo/my_model/model.json`
	- `Demo/my_model/metadata.json`
	- all `.bin` weight files from export
3. Run with Live Server (`localhost`), not direct `file://` open
4. Click `Start Camera`, then allow camera permission in browser

### Optional cloud model mode
- Instead of local `my_model`, set `MODEL_URL` in `script.js` to your hosted Teachable Machine URL.

## No backend required
Everything runs client-side in the browser, making it perfect for workshops and demos.

## Optional GitHub Pages deploy
1. Push files to GitHub
2. Enable Pages in repository settings
3. Use `main` branch and root (`/`) folder
4. Open your published URL
