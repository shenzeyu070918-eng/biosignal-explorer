const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { parseEcgCsv } = require("../src/csv.js");

const fixture = (name) => readFileSync(join(__dirname, "fixtures", name), "utf8");
const csv = (...rows) => ["time,voltage", ...rows].join("\n");

test("valid CSV preserves numeric time and voltage arrays", () => {
  assert.deepEqual(parseEcgCsv(fixture("valid.csv")), {
    time: [0, 0.004, 0.008, 0.012],
    voltage: [0.1, -0.2, 0.8, 0.2],
  });
});

for (const [name, expected] of [
  ["wrong-headers.csv", /Line 1: headers must be exactly/],
  ["non-numeric.csv", /Line 3: voltage must contain/],
  ["too-few-rows.csv", /At least 3 valid data rows are required; found 2/],
  ["non-increasing.csv", /Line 4: time must be strictly greater/],
  ["over-five-percent.csv", /Lines 2–3:.*more than 5%/],
]) {
  test(`rejects ${name} with a specific reason`, () => {
    assert.throws(() => parseEcgCsv(fixture(name)), expected);
  });
}

test("accepts the minimum 3 rows with exactly -5% and +5% intervals", () => {
  // Mean interval 0.004; intervals 0.0038 and 0.0042 are each exactly 5% away.
  assert.deepEqual(parseEcgCsv(fixture("exactly-five-percent.csv")).time, [0, 0.0038, 0.008]);
  assert.deepEqual(parseEcgCsv(csv("0,0", "0.0042,1", "0.008,0")).time, [0, 0.0042, 0.008]);
});

test("does not widen the 5% rule to accept a slightly larger deviation", () => {
  // Intervals 0.94999999 and 1.05000001, mean 1: 5.000001% deviation.
  assert.throws(() => parseEcgCsv(csv("0,0", "0.94999999,1", "2,0")), /more than 5%/);
});

test("rejects decreasing time as well as duplicate time", () => {
  assert.throws(() => parseEcgCsv(csv("0,0", "0.004,1", "0.003,0")), /Line 4: time/);
});

test("requires every interval, including the last, to satisfy the limit", () => {
  assert.throws(() => parseEcgCsv(csv("0,0", "1,0", "2,0", "3,0", "4.1,0")), /Lines 5–6:.*more than 5%/);
});

test("rejects empty, non-finite, hexadecimal and partially numeric cells in either column", () => {
  for (const badValue of ["", " ", "NaN", "Infinity", "1e309", "0x10", "2mV", '""', '"1']) {
    assert.throws(() => parseEcgCsv(csv("0,0", `1,${badValue}`, "2,0")), /Line 3: voltage/);
    assert.throws(() => parseEcgCsv(csv("0,0", `${badValue},1`, "2,0")), /Line 3: time/);
  }
});

test("accepts decimal/scientific numbers, quoted numeric cells, UTF-8 BOM and CRLF", () => {
  assert.deepEqual(parseEcgCsv('\uFEFFtime,voltage\r\n"0", +.1\r\n"4e-3","-2e-1"\r\n8e-3,1.\r\n'), {
    time: [0, 0.004, 0.008], voltage: [0.1, -0.2, 1],
  });
});

test("rejects empty files and header-only files", () => {
  assert.throws(() => parseEcgCsv(""), /file is empty/);
  assert.throws(() => parseEcgCsv("time,voltage\n"), /found 0/);
});

test("requires the exact header spelling, order and number of columns", () => {
  for (const header of ["Time,voltage", "voltage,time", "time, voltage", '"time","voltage"', "time,voltage,extra"]) {
    assert.throws(() => parseEcgCsv(`${header}\n0,0\n1,1\n2,0`), /Line 1: headers/);
  }
});

test("rejects missing/extra columns and blank rows, including after valid rows", () => {
  assert.throws(() => parseEcgCsv(csv("0,0", "1", "2,0")), /Line 3: expected exactly 2 columns.*found 1/);
  assert.throws(() => parseEcgCsv(csv("0,0", "1,1,2", "2,0")), /Line 3: expected exactly 2 columns.*found 3/);
  assert.throws(() => parseEcgCsv(csv("0,0", "", "1,1", "2,0")), /Line 3: blank data rows/);
  assert.throws(() => parseEcgCsv(csv("0,0", "1,1", "2,0", "3,bad")), /Line 5: voltage/);
});

test("rejects a time interval that overflows JavaScript's numeric range", () => {
  assert.throws(() => parseEcgCsv(csv("-1e308,0", "1e308,1", "1.5e308,0")), /time interval is too large/);
});
