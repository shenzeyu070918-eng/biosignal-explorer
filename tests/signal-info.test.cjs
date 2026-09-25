const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { parseEcgCsv } = require("../src/csv.js");
const { calculateSignalInfo, formatSignalValue } = require("../src/signal-info.js");

function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) <= 1e-12 * Math.max(1, Math.abs(expected)), `${actual} differs from ${expected}`);
}

for (const [name, expected] of [
  ["valid.csv", { duration: 0.012, samplingRate: 250, maximum: 0.8, minimum: -0.2, mean: 0.225 }],
  ["second-valid.csv", { duration: 0.016, samplingRate: 250, maximum: 0.5, minimum: -0.5, mean: 0.1 }],
]) {
  test(`${name}: all five calculations match independently known values`, () => {
    const data = parseEcgCsv(readFileSync(join(__dirname, "fixtures", name), "utf8"));
    Object.freeze(data.time);
    Object.freeze(data.voltage);
    const result = calculateSignalInfo(Object.freeze(data));
    for (const key of Object.keys(expected)) close(result[key], expected[key]);
  });
}

test("sampling rate uses the mean interval, including the inclusive 5% boundary", () => {
  const data = parseEcgCsv(readFileSync(join(__dirname, "fixtures/exactly-five-percent.csv"), "utf8"));
  close(calculateSignalInfo(data).samplingRate, 250);
  assert.notEqual(calculateSignalInfo(data).samplingRate, 1 / (data.time[1] - data.time[0]));
});

test("duration excludes the nonzero start; voltage metrics handle negative and flat signals", () => {
  assert.deepEqual(calculateSignalInfo({ time: [100, 102, 104], voltage: [-6, -3, -9] }), {
    duration: 4, samplingRate: 0.5, maximum: -3, minimum: -9, mean: -6,
  });
  for (const value of [0, -0.5, 1e308]) {
    const result = calculateSignalInfo({ time: [0, 1, 2], voltage: [value, value, value] });
    assert.equal(result.maximum, value);
    assert.equal(result.minimum, value);
    assert.equal(result.mean, value);
  }
  close(calculateSignalInfo({ time: [0, 1, 2], voltage: [1e308, -1e308, 0] }).mean, 0);
});

test("rounding is display-only, includes units, and retains small nonzero values", () => {
  const result = calculateSignalInfo({ time: [0, 0.3, 0.6], voltage: [0, 0, 1] });
  close(result.mean, 1 / 3);
  close(result.samplingRate, 10 / 3);
  assert.notEqual(result.mean, 0.333333);
  assert.equal(formatSignalValue(result.mean, "mV"), "0.333333 mV");
  assert.equal(formatSignalValue(result.samplingRate, "Hz"), "3.33333 Hz");
  assert.equal(formatSignalValue(0.000000001, "s"), "1e-9 s");
  assert.equal(formatSignalValue(-0, "mV"), "0 mV");
  assert.equal(formatSignalValue(250, "Hz"), "250 Hz");
});

test("out-of-range derived values are explicit without changing CSV validation", () => {
  const wide = parseEcgCsv("time,voltage\n-1e308,0\n0,1\n1e308,0");
  const tiny = parseEcgCsv("time,voltage\n0,0\n5e-324,1\n1e-323,0");
  assert.equal(formatSignalValue(calculateSignalInfo(wide).duration, "s"), "Unavailable (numeric range)");
  assert.equal(formatSignalValue(calculateSignalInfo(tiny).samplingRate, "Hz"), "Unavailable (numeric range)");
});
