# BioSignal Explorer

BioSignal Explorer is a small learning project for students beginning to study ECG and physiological signals. Its goal is to help a student connect a two-column `time` / `voltage` CSV with an ECG waveform and five basic signal values: Duration, Sampling Rate, Maximum, Minimum, and Mean.

**Confirmed MVP:** A browser-based web application using HTML, CSS, and Vanilla JavaScript. It accepts CSV files with the exact header `time,voltage`, numeric time in seconds (s), numeric voltage in millivolts (mV), at least 3 valid data rows, and strictly increasing time. Every adjacent time interval must differ from the mean interval by no more than 5%; Sampling Rate is calculated as `1 / mean(Δt)`. Files violating the validation rules are rejected with clear user-facing errors. ECG files are only read locally in the browser and are never uploaded to a server. See `PROJECT_SCOPE.md` for the full validation rules and output definitions.

The MVP excludes React, Vue, Next.js, a backend, a database, login, diagnosis, arrhythmia classification, AI analysis, EEG/PPG/EMG, and complex signal processing.

**Current status:** Phases 1–3 are Accepted, with stable Git tags `phase-1-accepted`, `phase-2-accepted`, and `phase-3-accepted`. Phase 4 — Basic Signal Information is implemented and **waiting for human acceptance**. Valid imports show the waveform, sample count, and Duration, Sampling Rate, Maximum, Minimum, and Mean. Phases 5–6 have not started. The Git remote `origin` is configured as `https://github.com/shenzeyu070918-eng/biosignal-explorer.git`.

**Run now:** Open `src/index.html` in a current browser. On this Mac, from the project directory, run `open src/index.html`. No installation, server, build step, or internet connection is required. Select a CSV using the file input; import starts immediately. Only the latest successful import is kept in memory. A new selection clears the previous data, sample count, waveform, and metrics; refreshing clears all results. The graph uses automatic axis ranges, so compare axis labels when changing files. On narrow screens, scroll the graph horizontally if needed.

**Ongoing development:** Keep the MVP small and evolve one phase at a time. Maintain `DEV_LOG.md`, `DECISIONS.md`, `ERROR_LOG.md`, and Git checkpoints. Accept each phase before starting the next; do not advance automatically.

See `PROJECT_SCOPE.md` for scope and `PLAN.md` for phase gates.

## Phase 2 Human Acceptance

Completed and passed on 2026-09-25: the student tested all seven CSV files, valid → invalid → valid handling, and refresh reset. The checklist below describes the accepted `phase-2-accepted` checkpoint and is retained for regression checks; Phases 3 and 4 add a waveform and metrics to valid imports.

1. Open `src/index.html` and confirm the rules and file selector are visible, with “No file imported.”
2. Select each sample below from `tests/fixtures/`. All are small synthetic test data, not clinical recordings.

| File | Expected result |
| --- | --- |
| `valid.csv` | Success; Imported samples: 4. |
| `wrong-headers.csv` | Rejected; line 1 must be exactly `time,voltage`. |
| `non-numeric.csv` | Rejected; voltage on line 3 must be numeric. |
| `too-few-rows.csv` | Rejected; at least 3 rows required, found 2. |
| `non-increasing.csv` | Rejected; time on line 4 must exceed line 3. |
| `exactly-five-percent.csv` | Success; Imported samples: 3. Intervals are 0.0038 s and 0.0042 s, each exactly 5% from their mean of 0.004 s. |
| `over-five-percent.csv` | Rejected; interval on lines 2–3 exceeds 5%. Intervals are 0.00376 s and 0.00424 s, a 6% deviation. |

3. Import `valid.csv`, then `non-numeric.csv`: confirm the success message and sample count are replaced by an error, with no old count remaining. Import `valid.csv` again and confirm recovery.
4. Refresh: confirm “No file imported.” and no sample count or waveform.
5. Report the results and explicitly accept Phase 2, or identify the failing file and displayed message. Phase 3 starts only after acceptance and a separate instruction.

The parser accepts UTF-8 BOM, LF/CRLF/CR line endings, a single terminal line ending, decimal/scientific notation, and optionally quoted numeric cells. Headers are literal and case-sensitive. Empty cells, blank data rows, missing/extra columns, non-finite numbers, and files without a `.csv` extension are rejected. Units are fixed requirements; numeric data alone cannot prove which physical unit the original file used.

## Automated checks

With Node.js available, run `node --test tests/*.test.cjs` from the project directory. The tests use only Node built-ins; Node is not required to use the page. The application tests simulate the small DOM interface to verify import, waveform, and metric state; calculation tests verify the five formulas and display precision; waveform tests check SVG sample coordinates and axis labels. These tests do not exercise browser rendering or the native file picker.

On 2026-09-25, all 39 tests passed, including every existing Phase 2 and Phase 3 test. Phase 3 previously included standalone SVG raster inspection and passed human browser acceptance. The browser tool previously blocked the local `file://` workflow; no repeat attempt or bypass was made in Phase 4. Phase 4's real-browser rendering, native file picker, and refresh behavior remain for human acceptance. Automated fresh-page tests use a new simulated page and inspect the initial HTML; they do not reload a real browser.

## Phase 3 Human Acceptance

Completed and passed on 2026-09-25: the student verified correct rendering, replacement, clearing on invalid import, restoration on valid import, refresh reset of the waveform and sample count, and all seven Phase 2 CSV cases. The checklist below describes the historical `phase-3-accepted` checkpoint and is retained for regression checks; Phase 4 adds metrics. All sample files are under `tests/fixtures/` and contain synthetic test values, not clinical recordings.

1. Open `src/index.html` (or refresh an already open copy). Expect “No file imported.”, no sample count, and no waveform.
2. Import `valid.csv`. Expect success, 4 samples, and one waveform labeled **Time (s)** horizontally and **Voltage (mV)** vertically. Confirm the line connects these points in order:

   | Time (s) | Voltage (mV) |
   | --- | --- |
   | 0 | 0.1 |
   | 0.004 | -0.2 |
   | 0.008 | 0.8 |
   | 0.012 | 0.2 |

3. Import `second-valid.csv`. Expect 5 samples and a replacement waveform with time from 10 to 10.016 s. Its voltage alternates +0.5, -0.5, +0.5, -0.5, +0.5 mV, forming a high → low → high → low → high line. Confirm there is only one plot and the old 0–0.012 s axis is gone.
4. Import `non-numeric.csv`. Expect the existing line 3 voltage error; the waveform section and sample count must disappear.
5. Import `valid.csv` again. Expect the original four-point waveform and count to return.
6. Recheck the seven Phase 2 fixture outcomes in the table above. The two valid files in that table (`valid.csv` and `exactly-five-percent.csv`) should draw waveforms; each rejected file should leave no previous waveform visible.
7. Refresh after a valid import. Expect the initial message and no waveform or sample count.
8. At the Phase 3 checkpoint, signal metrics were absent. In Phase 4, verify the five metrics using the next checklist. Axis tick numbers remain coordinates only; no analysis controls are added.
9. Report acceptance or the exact file/step that failed. Do not start Phase 4 until Phase 3 is accepted and further work is requested.


## Phase 4 Human Acceptance

**Pending.** All CSVs below are synthetic test data in `tests/fixtures/`. Open `src/index.html` in your browser; if it is already open, refresh to load this version.

### Expected values

| File | Samples | Duration (s) | Sampling Rate (Hz) | Maximum (mV) | Minimum (mV) | Mean (mV) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `valid.csv` | 4 | 0.012 | 250 | 0.8 | -0.2 | 0.225 |
| `second-valid.csv` | 5 | 0.016 | 250 | 0.5 | -0.5 | 0.1 |
| `exactly-five-percent.csv` | 3 | 0.008 | 250 | 0.8 | -0.2 | 0.233333 |

For `valid.csv`, Duration is `0.012 - 0`; the three intervals are 0.004 s, so Sampling Rate is `1 / 0.004 = 250 Hz`. Mean voltage is `(0.1 - 0.2 + 0.8 + 0.2) / 4 = 0.225 mV`.

For `second-valid.csv`, Duration is `10.016 - 10 = 0.016 s`; the four intervals average 0.004 s. Mean voltage is `(0.5 - 0.5 + 0.5 - 0.5 + 0.5) / 5 = 0.1 mV`. Its nonzero start time does not contribute to the voltage metrics or duration.

Values are displayed with up to six significant digits and units; internal calculations are not rounded. Sampling Rate is an estimate from the mean interval. Extremely small values can use scientific notation. If a derived value exceeds JavaScript's numeric range, that field shows “Unavailable (numeric range)” instead of a misleading number; normal fixtures above are fully representable.

### Steps

1. Open or refresh the page. Expect “No file imported.” and no waveform, sample count, or metrics section.
2. Import `valid.csv`. Confirm success, 4 samples, the existing waveform with Time (s) and Voltage (mV) axes, and all five values in the table with the correct units.
3. Import `second-valid.csv`. Confirm 5 samples, one replacement waveform spanning 10–10.016 s, and all five values matching its row. Sampling Rate remains 250 Hz because both files have the same mean interval.
4. Import `non-numeric.csv`. Expect the line 3 voltage error. The previous waveform, count, and entire metrics section must disappear.
5. Import `valid.csv` again. Confirm the original waveform, count, and all five values return.
6. Recheck the seven Phase 2 CSV cases from the earlier table: `valid.csv` and `exactly-five-percent.csv` succeed and show the expected metrics above; `wrong-headers.csv`, `non-numeric.csv`, `too-few-rows.csv`, `non-increasing.csv`, and `over-five-percent.csv` are rejected with the listed reason and no old results. Import a valid file before each invalid file to check clearing.
7. Refresh after a valid import. Confirm the initial message returns and waveform, count, and metrics disappear.
8. Confirm that labels/explanations are readable and that no heart-rate, R-peak, filtering, interpretation, classification, or AI features appear.
9. Report acceptance or the exact failing file, step, and displayed values. Phase 4 remains pending until you explicitly accept it; Phase 5 will not start automatically.
