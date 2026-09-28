"use strict";

// Only plot already validated numeric arrays. No parsing or signal processing here.
function createWaveformSvg({ time, voltage }) {
  const left = 80;
  const right = 608;
  const top = 24;
  const bottom = 260;
  const firstTime = time[0];
  const lastTime = time[time.length - 1];
  // These bounds only position the line and axis ticks; no signal metrics are shown.
  let lowerVoltage = voltage[0];
  let upperVoltage = voltage[0];
  for (const value of voltage) {
    if (value < lowerVoltage) lowerVoltage = value;
    if (value > upperVoltage) upperVoltage = value;
  }

  function position(value, lower, upper) {
    if (lower === upper) return 0.5; // A constant signal is a horizontal line.
    const span = upper - lower;
    if (Number.isFinite(span)) return (value - lower) / span;
    // Keep even extremely wide finite ranges from overflowing during scaling.
    return (value / 2 - lower / 2) / (upper / 2 - lower / 2);
  }
  const x = (value) => left + position(value, firstTime, lastTime) * (right - left);
  const y = (value) => bottom - position(value, lowerVoltage, upperVoltage) * (bottom - top);
  const label = (value) => String(Number(value.toPrecision(6)));
  const points = time.map((value, i) => `${x(value).toFixed(3)},${y(voltage[i]).toFixed(3)}`).join(" ");

  const axes = [];
  for (let tick = 0; tick <= 4; tick += 1) {
    const fraction = tick / 4;
    const tickX = left + fraction * (right - left);
    const tickTime = firstTime * (1 - fraction) + lastTime * fraction;
    axes.push(`<line x1="${tickX}" y1="${top}" x2="${tickX}" y2="${bottom}" stroke="#dce4ea"/>`);
    const anchor = tick === 0 ? "start" : tick === 4 ? "end" : "middle";
    axes.push(`<text x="${tickX}" y="282" text-anchor="${anchor}">${label(tickTime)}</text>`);
  }
  // For a constant signal, one tick labels its actual voltage without an invented range.
  const voltageTicks = lowerVoltage === upperVoltage ? [0.5] : [0, 0.25, 0.5, 0.75, 1];
  for (const fraction of voltageTicks) {
    const tickY = bottom - fraction * (bottom - top);
    const tickVoltage = lowerVoltage * (1 - fraction) + upperVoltage * fraction;
    axes.push(`<line x1="${left}" y1="${tickY}" x2="${right}" y2="${tickY}" stroke="#dce4ea"/>`);
    axes.push(`<text x="70" y="${tickY + 4}" text-anchor="end">${label(tickVoltage)}</text>`);
  }

  // All interpolated content comes from validated numbers, never raw CSV or filenames.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" role="img" aria-labelledby="ecg-title ecg-description" font-family="system-ui, sans-serif" font-size="16" fill="#1c2d3d">
    <title id="ecg-title">ECG waveform</title>
    <desc id="ecg-description">Imported voltage in millivolts plotted against time in seconds. Straight lines connect each consecutive sample.</desc>
    ${axes.join("\n")}
    <path d="M ${left} ${top} V ${bottom} H ${right}" fill="none" stroke="#627787"/>
    <polyline points="${points}" fill="none" stroke="#176b83" stroke-width="2" stroke-linejoin="round"/>
    <text x="344" y="310" text-anchor="middle" font-size="18">Time (s)</text>
    <text x="16" y="142" text-anchor="middle" font-size="18" transform="rotate(-90 16 142)">Voltage (mV)</text>
  </svg>`;
}

if (typeof module !== "undefined" && module.exports) module.exports = { createWaveformSvg };
