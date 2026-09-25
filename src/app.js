"use strict";

// Kept only in this page's memory. Reloading clears the imported data.
let importedData = null;
let importRequest = 0;
const fileInput = document.getElementById("csv-file");
const importStatus = document.getElementById("import-status");
const sampleCount = document.getElementById("sample-count");
const waveform = document.getElementById("waveform");
const waveformPlot = document.getElementById("waveform-plot");
const signalInfo = document.getElementById("signal-info");
const metricFields = [
  ["duration", "s"],
  ["samplingRate", "Hz"],
  ["maximum", "mV"],
  ["minimum", "mV"],
  ["mean", "mV"],
].map(([key, unit]) => ({ key, unit, element: document.getElementById(`${key}-value`) }));

function clearSignalInfo() {
  signalInfo.hidden = true;
  for (const { element } of metricFields) element.textContent = "";
}

function clearWaveform() {
  waveform.hidden = true;
  waveformPlot.innerHTML = "";
}

function showStatus(message, state) {
  importStatus.textContent = message;
  importStatus.dataset.state = state;
}

fileInput.addEventListener("change", async () => {
  const request = ++importRequest;
  const file = fileInput.files[0];
  importedData = null;
  sampleCount.hidden = true;
  sampleCount.textContent = "";
  clearWaveform();
  clearSignalInfo();

  if (!file) {
    showStatus("No file imported.", "idle");
    return;
  }
  if (!/\.csv$/i.test(file.name)) {
    showStatus("Import rejected: choose a file with a .csv extension.", "error");
    return;
  }

  showStatus(`Reading ${file.name}…`, "loading");
  let text;
  try {
    text = await file.text();
  } catch {
    if (request === importRequest) {
      showStatus("Import failed: the browser could not read this file. Check that it is accessible and select it again.", "error");
    }
    return;
  }
  // A slower previous selection must never overwrite the latest selection.
  if (request !== importRequest) return;

  try {
    importedData = parseEcgCsv(text);
    waveformPlot.innerHTML = createWaveformSvg(importedData);
    const metrics = calculateSignalInfo(importedData);
    for (const { key, unit, element } of metricFields) {
      element.textContent = formatSignalValue(metrics[key], unit);
    }
    signalInfo.hidden = false;
    waveform.hidden = false;
    showStatus(`Successfully imported ${file.name}.`, "success");
    sampleCount.textContent = `Imported samples: ${importedData.time.length}`;
    sampleCount.hidden = false;
  } catch (error) {
    importedData = null;
    clearWaveform();
    clearSignalInfo();
    showStatus(`Import rejected: ${error.message}`, "error");
  }
});
