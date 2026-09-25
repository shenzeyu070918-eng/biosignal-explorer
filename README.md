# BioSignal Explorer

BioSignal Explorer is a small learning project for students beginning to study ECG and physiological signals. Its goal is to help a student connect a two-column `time` / `voltage` CSV with an ECG waveform and five basic signal values: Duration, Sampling Rate, Maximum, Minimum, and Mean.

**Confirmed MVP:** A browser-based web application using HTML, CSS, and Vanilla JavaScript. It will accept CSV files with the exact header `time,voltage`, numeric time in seconds (s), numeric voltage in millivolts (mV), at least 3 valid data rows, and strictly increasing time. Every adjacent time interval must differ from the mean interval by no more than 5%; Sampling Rate will later be calculated as `1 / mean(Δt)`. Files violating the validation rules will be rejected with clear user-facing errors. ECG files will only be read locally in the browser and will never be uploaded to a server. See `PROJECT_SCOPE.md` for the full validation rules and output definitions.

The MVP excludes React, Vue, Next.js, a backend, a database, login, diagnosis, arrhythmia classification, AI analysis, EEG/PPG/EMG, and complex signal processing.

**Current status:** Phases 1 and 2 are accepted, with stable Git tags `phase-1-accepted` and `phase-2-accepted`. Phase 3 — ECG Visualization is Accepted following human review on 2026-09-25, with stable checkpoint tag `phase-3-accepted`. A valid local CSV displays a waveform from the validated in-memory arrays, plus the existing success message and sample count. X represents time (s); Y represents voltage (mV). A new selection clears the old plot, a valid replacement draws a new plot, and rejected files leave no waveform. Signal metrics are not implemented; Phase 4 has not started. The Git remote `origin` is configured as `https://github.com/shenzeyu070918-eng/biosignal-explorer.git`.

**Run now:** Open `src/index.html` in a current browser. On this Mac, from the project directory, run `open src/index.html`. No installation, server, build step, or internet connection is required. Select a CSV using the file input; import starts immediately. Only the latest successful import is kept in memory. A new selection clears the previous data and waveform; refreshing clears both. The graph uses automatic axis ranges, so compare axis labels when changing files. On narrow screens, scroll the graph horizontally if needed.

**Ongoing development:** Keep the MVP small and evolve one phase at a time. Maintain `DEV_LOG.md`, `DECISIONS.md`, `ERROR_LOG.md`, and Git checkpoints. Accept each phase before starting the next; do not advance automatically.

See `PROJECT_SCOPE.md` for scope and `PLAN.md` for phase gates.

## Phase 2 Human Acceptance

Completed and passed on 2026-09-25: the student tested all seven CSV files, valid → invalid → valid handling, and refresh reset. The checklist below describes the accepted `phase-2-accepted` checkpoint and is retained for regression checks; Phase 3 now adds a waveform to valid imports.

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

With Node.js available, run `node --test tests/*.test.cjs` from the project directory. The tests use only Node built-ins; Node is not required to use the page. The application tests simulate the small DOM interface to verify import and waveform state; waveform tests check SVG sample coordinates and axis labels. These tests do not exercise browser rendering or the native file picker.

On 2026-09-25, all 31 tests passed, including the original 23 Phase 2 tests. Standalone SVGs for `valid.csv`, `second-valid.csv`, and a constant signal were rasterized and visually inspected. The browser tool previously blocked the local `file://` workflow in this session; no repeat attempt or bypass was made in Phase 3. The student subsequently completed and passed Phase 3 Human Acceptance, including rendering, import transitions, refresh, and all seven Phase 2 cases.

## Phase 3 Human Acceptance

Completed and passed on 2026-09-25: the student verified correct rendering, replacement, clearing on invalid import, restoration on valid import, refresh reset of the waveform and sample count, and all seven Phase 2 CSV cases. The checklist below is retained for future regression checks. All sample files are under `tests/fixtures/` and contain synthetic test values, not clinical recordings.

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
8. Confirm there are no Duration, Sampling Rate, Maximum, Minimum, or Mean results, and no analysis controls. Axis tick numbers are coordinates only.
9. Report acceptance or the exact file/step that failed. Do not start Phase 4 until Phase 3 is accepted and further work is requested.
