const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

// A minimal DOM stand-in exercises the real event handler without a browser dependency.
// This checks state and messages, not browser rendering or the native file picker.
function setup() {
  let onChange;
  const elements = {
    "csv-file": { files: [], addEventListener: (_, handler) => { onChange = handler; } },
    "import-status": { textContent: "No file imported.", dataset: {} },
    "sample-count": { textContent: "", hidden: true },
    "waveform": { hidden: true },
    "waveform-plot": { innerHTML: "" },
  };
  const context = vm.createContext({ document: { getElementById: (id) => elements[id] } });
  vm.runInContext(readFileSync(join(__dirname, "../src/csv.js"), "utf8"), context);
  vm.runInContext(readFileSync(join(__dirname, "../src/waveform.js"), "utf8"), context);
  vm.runInContext(readFileSync(join(__dirname, "../src/app.js"), "utf8"), context);
  return {
    status: elements["import-status"],
    count: elements["sample-count"],
    waveform: elements["waveform"],
    plot: elements["waveform-plot"],
    data: () => JSON.parse(vm.runInContext("JSON.stringify(importedData)", context)),
    select(file) {
      elements["csv-file"].files = file ? [file] : [];
      return onChange();
    },
  };
}

const valid = "time,voltage\n0,0.1\n0.004,-0.2\n0.008,0.8\n";
const file = (text = valid, name = "example.csv") => ({ name, text: async () => text });

test("selection imports arrays in memory and shows a success message and sample count", async () => {
  const app = setup();
  await app.select(file());
  assert.deepEqual(app.data(), { time: [0, 0.004, 0.008], voltage: [0.1, -0.2, 0.8] });
  assert.equal(app.status.textContent, "Successfully imported example.csv.");
  assert.equal(app.status.dataset.state, "success");
  assert.equal(app.count.textContent, "Imported samples: 3");
  assert.equal(app.count.hidden, false);
  assert.equal(app.waveform.hidden, false);
  assert.match(app.plot.innerHTML, /<polyline points=/);
  assert.match(app.plot.innerHTML, /Time \(s\)/);
  assert.match(app.plot.innerHTML, /Voltage \(mV\)/);
});

test("invalid replacement clears previous arrays and sample count; a later valid import recovers", async () => {
  const app = setup();
  await app.select(file());
  await app.select(file("time,voltage\n0,0\n1,bad\n2,0"));
  assert.equal(app.data(), null);
  assert.equal(app.count.hidden, true);
  assert.equal(app.count.textContent, "");
  assert.match(app.status.textContent, /Import rejected: Line 3: voltage/);
  assert.equal(app.status.dataset.state, "error");
  assert.equal(app.waveform.hidden, true);
  assert.equal(app.plot.innerHTML, "");
  await app.select(file());
  assert.equal(app.count.hidden, false);
  assert.equal(app.status.dataset.state, "success");
  assert.equal(app.waveform.hidden, false);
  assert.match(app.plot.innerHTML, /<polyline points=/);
});

test("rejects a non-CSV extension before reading; accepts an uppercase CSV extension", async () => {
  const app = setup();
  let read = false;
  await app.select(file());
  await app.select({ name: "data.txt", text: async () => { read = true; return valid; } });
  assert.equal(read, false);
  assert.equal(app.data(), null);
  assert.match(app.status.textContent, /\.csv extension/);
  assert.equal(app.waveform.hidden, true);
  assert.equal(app.plot.innerHTML, "");
  await app.select(file(valid, "data.CSV"));
  assert.equal(app.status.dataset.state, "success");
});

test("reports a file-read failure and clears any previous import", async () => {
  const app = setup();
  await app.select(file());
  await app.select({ name: "unreadable.csv", text: async () => { throw new Error("read failed"); } });
  assert.equal(app.data(), null);
  assert.equal(app.count.hidden, true);
  assert.match(app.status.textContent, /browser could not read this file/);
  assert.equal(app.waveform.hidden, true);
  assert.equal(app.plot.innerHTML, "");
});

test("a slow earlier read cannot overwrite a newer successful selection", async () => {
  const app = setup();
  let finishRead;
  const oldImport = app.select({ name: "old.csv", text: () => new Promise((resolve) => { finishRead = resolve; }) });
  assert.equal(app.status.dataset.state, "loading");
  await app.select(file(valid, "latest.csv"));
  const latestPlot = app.plot.innerHTML;
  finishRead("time,voltage\n0,1\n1,2\n2,3\n3,4");
  await oldImport;
  assert.equal(app.status.textContent, "Successfully imported latest.csv.");
  assert.equal(app.count.textContent, "Imported samples: 3");
  assert.deepEqual(app.data().voltage, [0.1, -0.2, 0.8]);
  assert.equal(app.plot.innerHTML, latestPlot);
});

test("a stale read failure cannot overwrite a newer result", async () => {
  const app = setup();
  let failRead;
  const oldImport = app.select({ name: "old.csv", text: () => new Promise((_, reject) => { failRead = reject; }) });
  await app.select(file());
  failRead(new Error("late failure"));
  await oldImport;
  assert.equal(app.status.dataset.state, "success");
});

test("clearing a selection resets state and a new page starts with no imported data", async () => {
  const app = setup();
  await app.select(file());
  await app.select(undefined);
  assert.equal(app.data(), null);
  assert.equal(app.count.hidden, true);
  assert.equal(app.status.textContent, "No file imported.");
  assert.equal(app.waveform.hidden, true);
  assert.equal(app.plot.innerHTML, "");
  assert.equal(setup().data(), null);
  assert.equal(setup().waveform.hidden, true);
  assert.equal(setup().plot.innerHTML, "");
});

test("a second valid file replaces the waveform with its own time and voltage values", async () => {
  const app = setup();
  await app.select(file());
  const previousPlot = app.plot.innerHTML;
  const secondCsv = readFileSync(join(__dirname, "fixtures/second-valid.csv"), "utf8");
  await app.select(file(secondCsv, "second-valid.csv"));
  assert.notEqual(app.plot.innerHTML, previousPlot);
  assert.equal(app.waveform.hidden, false);
  assert.equal((app.plot.innerHTML.match(/<polyline /g) || []).length, 1);
  assert.match(app.plot.innerHTML, />10\.016<\/text>/);
  assert.match(app.plot.innerHTML, />-0\.5<\/text>/);
  assert.equal(app.count.textContent, "Imported samples: 5");
  assert.deepEqual(app.data().voltage, [0.5, -0.5, 0.5, -0.5, 0.5]);
});

test("starting a read clears the previous plot immediately, before validation completes", async () => {
  const app = setup();
  await app.select(file());
  let finishRead;
  const reading = app.select({ name: "pending.csv", text: () => new Promise((resolve) => { finishRead = resolve; }) });
  assert.equal(app.waveform.hidden, true);
  assert.equal(app.plot.innerHTML, "");
  finishRead("time,voltage\n0,0\n1,bad\n2,0");
  await reading;
  assert.equal(app.waveform.hidden, true);
  assert.equal(app.plot.innerHTML, "");
});
