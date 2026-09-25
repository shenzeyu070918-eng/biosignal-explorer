"use strict";

// Kept only in this page's memory. Reloading clears the imported data.
let importedData = null;
let importRequest = 0;
const fileInput = document.getElementById("csv-file");
const importStatus = document.getElementById("import-status");
const sampleCount = document.getElementById("sample-count");

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
    showStatus(`Successfully imported ${file.name}.`, "success");
    sampleCount.textContent = `Imported samples: ${importedData.time.length}`;
    sampleCount.hidden = false;
  } catch (error) {
    showStatus(`Import rejected: ${error.message}`, "error");
  }
});
