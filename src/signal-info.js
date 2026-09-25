"use strict";

// Input is the already validated CSV data. Keep calculations unrounded.
function calculateSignalInfo({ time, voltage }) {
  let meanInterval = 0;
  for (let i = 1; i < time.length; i += 1) {
    meanInterval += (time[i] - time[i - 1] - meanInterval) / i;
  }

  let maximum = voltage[0];
  let minimum = voltage[0];
  for (const value of voltage) {
    maximum = Math.max(maximum, value);
    minimum = Math.min(minimum, value);
  }
  // Scaling avoids overflow when averaging large finite voltage values.
  const scale = Math.max(Math.abs(maximum), Math.abs(minimum)) || 1;
  let mean = 0;
  for (let i = 0; i < voltage.length; i += 1) {
    mean += (voltage[i] / scale - mean) / (i + 1);
  }

  return {
    duration: time[time.length - 1] - time[0],
    samplingRate: 1 / meanInterval,
    maximum,
    minimum,
    mean: mean * scale,
  };
}

function formatSignalValue(value, unit) {
  if (!Number.isFinite(value)) return "Unavailable (numeric range)";
  return `${Number(value.toPrecision(6))} ${unit}`;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateSignalInfo, formatSignalValue };
}
