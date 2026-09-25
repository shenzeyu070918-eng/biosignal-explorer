# BioSignal Explorer

BioSignal Explorer is a small learning project for students beginning to study ECG and physiological signals. Its goal is to help a student connect a two-column `time` / `voltage` CSV with an ECG waveform and five basic signal values: Duration, Sampling Rate, Maximum, Minimum, and Mean.

**Confirmed MVP:** A browser-based web application using HTML, CSS, and Vanilla JavaScript. It will accept CSV files with the exact header `time,voltage`, numeric time in seconds (s), numeric voltage in millivolts (mV), at least 3 valid data rows, and strictly increasing time. Every adjacent time interval must differ from the mean interval by no more than 5%; Sampling Rate will later be calculated as `1 / mean(Δt)`. Files violating the validation rules will be rejected with clear user-facing errors. ECG files will only be read locally in the browser and will never be uploaded to a server. See `PROJECT_SCOPE.md` for the full validation rules and output definitions.

The MVP excludes React, Vue, Next.js, a backend, a database, login, diagnosis, arrhythmia classification, AI analysis, EEG/PPG/EMG, and complex signal processing.

**Current status:** Phase 1 is accepted, with stable Git tag `phase-1-accepted`. Phase 2 — CSV Import is Accepted following human review on 2026-09-25, with stable checkpoint tag `phase-2-accepted`. It reads and validates one local CSV, retains its numeric `time` and `voltage` arrays in page memory, and shows success plus an imported sample count or a specific rejection message. Waveforms and signal metrics are not implemented; Phase 3 has not started. The Git remote `origin` is configured as `https://github.com/shenzeyu070918-eng/biosignal-explorer.git`.

**Run now:** Open `src/index.html` in a current browser. On this Mac, from the project directory, run `open src/index.html`. No installation, server, build step, or internet connection is required. Select a CSV using the file input; import starts immediately. Only the latest successful import is kept in memory. A new selection clears the previous data, and refreshing the page clears all imported data.

**Ongoing development:** Keep the MVP small and evolve one phase at a time. Maintain `DEV_LOG.md`, `DECISIONS.md`, `ERROR_LOG.md`, and Git checkpoints. Accept each phase before starting the next; do not advance automatically.

See `PROJECT_SCOPE.md` for scope and `PLAN.md` for phase gates.

## Phase 2 Human Acceptance

Completed and passed on 2026-09-25: the student tested all seven CSV files, valid → invalid → valid handling, and refresh reset. The checklist below is retained for reference and future regression checks.

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
4. Refresh: confirm “No file imported.” and no sample count. No waveform or signal summary should appear in this phase.
5. Report the results and explicitly accept Phase 2, or identify the failing file and displayed message. Phase 3 starts only after acceptance and a separate instruction.

The parser accepts UTF-8 BOM, LF/CRLF/CR line endings, a single terminal line ending, decimal/scientific notation, and optionally quoted numeric cells. Headers are literal and case-sensitive. Empty cells, blank data rows, missing/extra columns, non-finite numbers, and files without a `.csv` extension are rejected. Units are fixed requirements; numeric data alone cannot prove which physical unit the original file used.

## Automated checks

With Node.js available, run `node --test tests/csv.test.cjs tests/app.test.cjs` from the project directory. The tests use only Node built-ins; Node is not required to use the page. The application tests simulate the small DOM interface to verify import state and messages; they do not test actual rendering or the native browser file picker.

On 2026-09-25, all 23 tests passed. The browser tool blocked the local `file://` URL before the app loaded; the student subsequently completed and passed the manual acceptance above, including file selection and page reset.
