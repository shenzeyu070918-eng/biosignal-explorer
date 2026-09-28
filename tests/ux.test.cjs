const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

// Markup contracts only: these do not simulate browser layout or accessibility APIs.
const html = readFileSync(join(__dirname, "../src/index.html"), "utf8");
const tagWithId = (id) => html.match(new RegExp(`<[^>]+\\bid="${id}"[^>]*>`))?.[0];

test("upload precedes detailed rules and keeps its label, instructions, and live feedback", () => {
  assert.ok(html.indexOf('id="csv-file"') < html.indexOf('id="csv-rules"'));
  assert.match(html, /<label for="csv-file">[^<]+<\/label>/);
  assert.match(tagWithId("csv-file"), /aria-describedby="csv-rules"/);
  assert.ok(tagWithId("csv-rules"));
  assert.match(tagWithId("import-status"), /role="status"/);
  assert.match(tagWithId("import-status"), /aria-live="polite"/);
  assert.match(tagWithId("import-status"), /aria-atomic="true"/);
});

test("the chart scroll region is keyboard reachable and has visible naming and instructions", () => {
  const chart = tagWithId("waveform-plot");
  assert.match(chart, /tabindex="0"/);
  assert.match(chart, /role="region"/);
  for (const attribute of ["aria-labelledby", "aria-describedby"]) {
    const id = chart.match(new RegExp(`${attribute}="([^"]+)"`))[1];
    assert.ok(tagWithId(id), `${attribute} target must exist`);
    assert.doesNotMatch(tagWithId(id), /\bhidden\b/);
  }
  // A fresh page must not expose an empty chart region or result section.
  assert.match(tagWithId("waveform"), /\bhidden\b/);
  assert.match(tagWithId("signal-info"), /\bhidden\b/);
});
