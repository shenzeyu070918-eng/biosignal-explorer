"use strict";

// Fixed two-column numeric CSV: no dependency or configurable column mapping.
function parseEcgCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r\n|\n|\r/);
  // A terminal line ending is normal CSV formatting, not an extra data row.
  if (lines[lines.length - 1] === "") lines.pop();
  if (lines.length === 0) throw new Error("The file is empty.");
  if (lines[0] !== "time,voltage") {
    throw new Error('Line 1: headers must be exactly "time,voltage", in that order.');
  }

  const time = [];
  const voltage = [];
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

  for (let row = 1; row < lines.length; row += 1) {
    const lineNumber = row + 1;
    if (lines[row].trim() === "") {
      throw new Error(`Line ${lineNumber}: blank data rows are not allowed.`);
    }
    const cells = lines[row].split(",");
    if (cells.length !== 2) {
      throw new Error(`Line ${lineNumber}: expected exactly 2 columns (time,voltage); found ${cells.length}.`);
    }
    const values = cells.map((cell, column) => {
      let value = cell.trim();
      // Quoted numeric cells are valid CSV; commas/newlines inside numeric cells are not.
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1).trim();
      const number = Number(value);
      if (!decimal.test(value) || !Number.isFinite(number)) {
        const name = column === 0 ? "time" : "voltage";
        throw new Error(`Line ${lineNumber}: ${name} must contain a finite decimal number; empty cells are not allowed.`);
      }
      return number;
    });
    if (time.length > 0 && values[0] <= time[time.length - 1]) {
      throw new Error(`Line ${lineNumber}: time must be strictly greater than the time on line ${lineNumber - 1}.`);
    }
    time.push(values[0]);
    voltage.push(values[1]);
  }

  if (time.length < 3) {
    throw new Error(`At least 3 valid data rows are required; found ${time.length}.`);
  }

  let meanInterval = 0;
  for (let i = 1; i < time.length; i += 1) {
    const interval = time[i] - time[i - 1];
    if (!Number.isFinite(interval)) {
      throw new Error(`Lines ${i + 1}–${i + 2}: the time interval is too large to validate. Use a smaller time range.`);
    }
    // Running mean avoids overflowing a sum of otherwise finite intervals.
    meanInterval += (interval - meanInterval) / i;
  }
  for (let i = 1; i < time.length; i += 1) {
    const interval = time[i] - time[i - 1];
    const deviation = Math.abs(interval - meanInterval) / meanInterval;
    // Decimal 5% boundaries can round slightly above 0.05 in binary arithmetic.
    const roundoff = 8 * Number.EPSILON;
    if (deviation > 0.05 + roundoff) {
      throw new Error(`Lines ${i + 1}–${i + 2}: time interval ${interval} s differs from the mean interval ${meanInterval} s by more than 5%. Use approximately uniformly sampled data.`);
    }
  }

  return { time, voltage };
}

// Allow the same parser to be tested with Node's built-in test runner.
if (typeof module !== "undefined" && module.exports) module.exports = { parseEcgCsv };
