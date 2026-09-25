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
    "signal-info": { hidden: true },
  };
  const metricKeys = ["duration", "samplingRate", "maximum", "minimum", "mean"];
  for (const key of metricKeys) elements[`${key}-value`] = { textContent: "" };
  const context = vm.createContext({ document: { getElementById: (id) => elements[id] } });
  vm.runInContext(readFileSync(join(__dirname, "../src/csv.js"), "utf8"), context);
  vm.runInContext(readFileSync(join(__dirname, "../src/waveform.js"), "utf8"), context);
  vm.runInContext(readFileSync(join(__dirname, "../src/signal-info.js"), "utf8"), context);
  vm.runInContext(readFileSync(join(__dirname, "../src/app.js"), "utf8"), context);
  return {
    status: elements["import-status"],
    count: elements["sample-count"],
    waveform: elements["waveform"],
    plot: elements["waveform-plot"],
    signalInfo: elements["signal-info"],
    metrics: () => metricKeys.map((key) => elements[`${key}-value`].textContent),
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
  assert.deepEqual(app.metrics(), ["0.008 s", "250 Hz", "0.8 mV", "-0.2 mV", "0.233333 mV"]);
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

test("metrics match both fixture datasets and recover after every invalid CSV case", async () => {
  const app = setup();
  const fixture = (name) => file(readFileSync(join(__dirname, "fixtures", name), "utf8"), name);
  await app.select(fixture("valid.csv"));
  assert.equal(app.signalInfo.hidden, false);
  assert.deepEqual(app.metrics(), ["0.012 s", "250 Hz", "0.8 mV", "-0.2 mV", "0.225 mV"]);
  await app.select(fixture("second-valid.csv"));
  assert.deepEqual(app.metrics(), ["0.016 s", "250 Hz", "0.5 mV", "-0.5 mV", "0.1 mV"]);
  for (const name of ["wrong-headers.csv", "non-numeric.csv", "too-few-rows.csv", "non-increasing.csv", "over-five-percent.csv"]) {
    await app.select(fixture(name));
    assert.equal(app.signalInfo.hidden, true);
    assert.deepEqual(app.metrics(), ["", "", "", "", ""]);
    assert.equal(app.waveform.hidden, true);
    assert.equal(app.plot.innerHTML, "");
    await app.select(fixture("valid.csv"));
    assert.equal(app.signalInfo.hidden, false);
    assert.equal(app.waveform.hidden, false);
    assert.deepEqual(app.metrics(), ["0.012 s", "250 Hz", "0.8 mV", "-0.2 mV", "0.225 mV"]);
  }
  await app.select(fixture("exactly-five-percent.csv"));
  assert.deepEqual(app.metrics(), ["0.008 s", "250 Hz", "0.8 mV", "-0.2 mV", "0.233333 mV"]);
  await app.select(file("time,voltage\n100,-6\n102,-3\n104,-9"));
  assert.deepEqual(app.metrics(), ["4 s", "0.5 Hz", "-3 mV", "-9 mV", "-6 mV"]);
});

test("metrics clear during reads, on read failures, wrong extensions, and empty selections", async () => {
  const app = setup();
  for (const next of [undefined, file(valid, "bad.txt"), { name: "bad.csv", text: async () => { throw new Error("read failed"); } }]) {
    await app.select(file());
    await app.select(next);
    assert.equal(app.signalInfo.hidden, true);
    assert.deepEqual(app.metrics(), ["", "", "", "", ""]);
  }
  await app.select(file());
  let finishRead;
  const pending = app.select({ name: "pending.csv", text: () => new Promise((resolve) => { finishRead = resolve; }) });
  assert.equal(app.signalInfo.hidden, true);
  assert.deepEqual(app.metrics(), ["", "", "", "", ""]);
  await app.select(file("time,voltage\n0,0\n1,bad\n2,0"));
  finishRead(valid);
  await pending;
  assert.equal(app.signalInfo.hidden, true);
  assert.deepEqual(app.metrics(), ["", "", "", "", ""]);
  const freshPage = setup();
  assert.equal(freshPage.signalInfo.hidden, true);
  assert.deepEqual(freshPage.metrics(), ["", "", "", "", ""]);
  // The real HTML must also start hidden; the stand-in alone cannot prove this.
  const html = readFileSync(join(__dirname, "../src/index.html"), "utf8");
  assert.match(html, /<section id="signal-info"[^>]* hidden>/);
  for (const key of ["duration", "samplingRate", "maximum", "minimum", "mean"]) {
    assert.ok(html.includes(`<dd id="${key}-value"></dd>`));
  }
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
