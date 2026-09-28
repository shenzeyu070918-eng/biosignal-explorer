const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { parseEcgCsv } = require("../src/csv.js");
const { createWaveformSvg } = require("../src/waveform.js");

const fixture = (name) => parseEcgCsv(readFileSync(join(__dirname, "fixtures", name), "utf8"));
const points = (svg) => svg.match(/<polyline points="([^"]+)"/)[1].split(" ").map((pair) => pair.split(",").map(Number));

test("time endpoint labels point inward to keep longer values inside the chart", () => {
  const svg = createWaveformSvg(fixture("second-valid.csv"));
  assert.match(svg, /<text x="80" y="282" text-anchor="start">10<\/text>/);
  assert.match(svg, /<text x="608" y="282" text-anchor="end">10\.016<\/text>/);
});

test("valid.csv maps time to horizontal position and voltage to upward vertical position", () => {
  const svg = createWaveformSvg(fixture("valid.csv"));
  // Plot edges: x=80..608; y=24..260. Bounds: t=0..0.012, v=-0.2..0.8.
  assert.deepEqual(points(svg), [[80, 189.2], [256, 260], [432, 24], [608, 165.6]]);
  assert.match(svg, /Time \(s\)/);
  assert.match(svg, /Voltage \(mV\)/);
  assert.match(svg, />0\.012<\/text>/);
  assert.match(svg, />-0\.2<\/text>/);
  assert.match(svg, />0\.8<\/text>/);
});

test("horizontal spacing uses actual validated time values, not sample indices", () => {
  const plotted = points(createWaveformSvg(fixture("exactly-five-percent.csv")));
  assert.equal(plotted[1][0], 330.8); // 47.5% of the range, not the midpoint (344).
});

test("second file updates time ticks, voltage ticks and all five sample positions", () => {
  const svg = createWaveformSvg(fixture("second-valid.csv"));
  assert.deepEqual(points(svg), [[80, 24], [212, 260], [344, 24], [476, 260], [608, 24]]);
  assert.match(svg, />10<\/text>/);
  assert.match(svg, />10\.016<\/text>/);
  assert.match(svg, />-0\.5<\/text>/);
});

test("constant voltage produces a finite horizontal line with its actual voltage label", () => {
  for (const voltage of [0, -2, 1e308]) {
    const svg = createWaveformSvg({ time: [0, 1, 2], voltage: [voltage, voltage, voltage] });
    assert.deepEqual(points(svg), [[80, 142], [344, 142], [608, 142]]);
    assert.ok(svg.includes(`>${voltage}</text>`));
    assert.doesNotMatch(svg, /NaN|Infinity/);
  }
});

test("scaling handles wide finite ranges without overflowing plotted coordinates", () => {
  const svg = createWaveformSvg({ time: [-1e308, 0, 1e308], voltage: [-1e308, 0, 1e308] });
  assert.deepEqual(points(svg), [[80, 260], [344, 142], [608, 24]]);
  assert.doesNotMatch(svg, /NaN|Infinity/);
});

test("plot generation preserves input arrays and connects every sample without smoothing", () => {
  const data = fixture("valid.csv");
  const before = structuredClone(data);
  Object.freeze(data.time);
  Object.freeze(data.voltage);
  Object.freeze(data);
  const svg = createWaveformSvg(data);
  assert.deepEqual(data, before);
  assert.equal(points(svg).length, data.time.length);
  assert.equal((svg.match(/<polyline /g) || []).length, 1);
  assert.match(svg, /role="img"/);
});
