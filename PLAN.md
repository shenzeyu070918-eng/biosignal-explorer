# BioSignal Explorer — Phased Plan

Only the current phase may be worked on. Record its evidence in `DEV_LOG.md` and obtain student acceptance before entering the next phase. A Git checkpoint should capture each accepted phase. This plan describes future work; it does not mark those phases complete.

**Current status:** Phases 1 and 2 are Accepted, preserved at Git tags `phase-1-accepted` and `phase-2-accepted`. Phase 3 — ECG Visualization is implemented and waiting for human acceptance as of 2026-09-25. Phases 4–6 have not started and must not start automatically.

**Confirmed boundaries:** HTML, CSS, and Vanilla JavaScript in the browser; ECG files stay local and are never uploaded. No React, Vue, Next.js, backend, database, login, diagnosis, arrhythmia classification, AI analysis, other signal types, or complex signal processing. The personal repository remote is configured as `https://github.com/shenzeyu070918-eng/biosignal-explorer.git`. Maintain all three logs and Git checkpoints across future iterations. `PROJECT_SCOPE.md` defines the CSV and output contract.

## Phase 1 — Project Foundation

- **Status:** Accepted by the student on 2026-09-24.
- **Goal:** Establish a minimal project structure, project records, and a development approach suitable for a student.
- **Tasks:** Inspect the starting directory; create the scope, plan, logs, and README; initialize local Git; record the confirmed technology, future browser running method, CSV contract, outputs, repository plan, and iteration rules. Finish this phase with documentation only.
- **Acceptance Criteria:** The documents agree on the confirmed scope and current status; the directory is understandable; Git tracks the project records; the future running method is explained without claiming an existing application. A runnable page and a connected GitHub repository are not gates for this documentation phase.
- **How AI will test it:** Check required files and sections, review agreement across documents, inspect the Git diff and history, and confirm that no business code or dependencies were introduced.
- **How the student will check it:** Read the scope and plan, confirm that the structure and technical direction are understandable, and explicitly accept Phase 1.
- **Exit condition:** Met: explicit human acceptance is recorded in `DEV_LOG.md`, with the accepted state preserved at Git tag `phase-1-accepted`. The student authorized Phase 2 on 2026-09-25.

## Phase 2 — CSV Import

- **Status:** Accepted by the student on 2026-09-25. All seven acceptance CSV files were manually tested; valid → invalid → valid handling and refresh reset passed. The implementation also has 23 previously passing automated tests. See `DEV_LOG.md` for the acceptance record.
- **Goal:** Read a fixed-format CSV containing `time` and `voltage`.
- **Tasks:** Implement local file selection and CSV parsing against the confirmed contract: exact headers `time,voltage`, numeric time in s and voltage in mV in every data row, at least 3 valid data rows, and strictly increasing time. For adjacent intervals `Δt`, require every interval to differ from `mean(Δt)` by no more than 5%, inclusive. Reject rule violations with clear user-facing errors. Sampling Rate will later be calculated in Phase 4 as `1 / mean(Δt)`.
- **Acceptance Criteria:** A valid CSV loads both columns in order without uploading data, keeps numeric time and voltage arrays in memory, and shows success plus the imported sample count. Incorrect headers, nonnumeric values, fewer than 3 valid data rows, duplicate or decreasing time, and any interval beyond the 5% limit cause file rejection with understandable feedback. Invalid rows are not silently discarded, and failed imports leave no previous data or count displayed. No arbitrary column or unit mapping is offered.
- **How AI will test it:** Compare a known valid CSV with expected parsed rows; check incorrect headers, nonnumeric values, 2 versus 3 data rows, duplicate/decreasing time, intervals exactly at the inclusive 5% boundary, and an interval beyond it. Inspect the file-reading path for unintended uploads.
- **How the student will check it:** Follow the exact steps and seven sample cases in `README.md`, check success/error transitions and refresh behavior, then try a class ECG CSV that meets the fixed format if available.
- **Exit condition:** Met: parsing behavior, tests, and explicit human acceptance are recorded. The accepted state is preserved at annotated Git tag `phase-2-accepted`. The student subsequently authorized Phase 3 on 2026-09-25.

## Phase 3 — ECG Visualization

- **Status:** Implemented; waiting for human acceptance. All 31 tests pass, including the existing Phase 2 tests. Standalone SVG renders were visually inspected; browser rendering and native file selection require the manual checks in `README.md`.
- **Goal:** Show voltage over time as an ECG waveform.
- **Tasks:** Draw a native SVG waveform from Phase 2's validated in-memory arrays; label time (s) and voltage (mV) axes. Replace the plot on another valid import and clear it on any new selection or failed import. Refresh returns to an empty page state. Preserve all CSV validation behavior.
- **Acceptance Criteria:** `valid.csv` displays a waveform at the correct time/voltage positions. A second valid CSV updates the line and axes. Valid → invalid removes the old waveform; invalid → valid restores it. Refresh shows no waveform. Existing Phase 2 tests continue to pass. No signal metrics or analysis are added.
- **How AI will test it:** Run the entire test suite; check coordinate mapping, actual time spacing, constant-voltage rendering, and replacement/clearing state. Inspect standalone SVG renders and report the known browser-tool limitation honestly.
- **How the student will check it:** Follow the Phase 3 steps in `README.md`, compare the four points in `valid.csv` with the plot, check `second-valid.csv`, test valid/invalid transitions, and refresh. A representative class ECG CSV can be checked too if available.
- **Exit condition:** Visualization evidence and an implementation checkpoint are recorded. Explicit human acceptance is still pending. Do not begin Phase 4 without acceptance and a separate instruction.

## Phase 4 — Basic Signal Information

- **Goal:** Calculate and show Duration, Sampling Rate, Maximum, Minimum, and Mean.
- **Tasks:** Apply the definitions in `PROJECT_SCOPE.md`: Duration in s as last minus first time; Sampling Rate in Hz as the reciprocal of the mean adjacent time interval; Maximum, Minimum, and arithmetic Mean of voltage in mV. Display them with short explanations.
- **Acceptance Criteria:** All five values match hand-calculated results for input that passes the CSV rules. Rejected files do not produce result metrics. Sampling Rate is presented as an estimate for approximately uniformly sampled data meeting the 5% limit.
- **How AI will test it:** Compare results with independent hand calculations for a small dataset and relevant edge cases.
- **How the student will check it:** Verify at least one small example manually and confirm the labels and explanations are understandable.
- **Exit condition:** Calculation evidence and student acceptance are recorded, followed by a Git checkpoint.

## Phase 5 — UX & Mobile Check

- **Goal:** Keep the complete MVP simple and usable on desktop and a mobile screen.
- **Tasks:** Review the import-to-result flow, plain-language guidance, readability, error states, and basic mobile layout; make only necessary adjustments.
- **Acceptance Criteria:** A beginner can complete the flow without instructions outside the page; the waveform and metrics remain readable on common desktop and mobile widths. At least one target user demonstrates the understanding described in Human Acceptance below.
- **How AI will test it:** Inspect the flow and capture desktop/mobile views; check obvious layout overflow and confusing states.
- **How the student will check it:** Complete the full flow on a laptop and phone, noting any confusing step.
- **Human Acceptance:** Ask at least one target user to identify how a CSV data point relates to the waveform and explain at least one displayed signal parameter in their own words. Record their responses and any confusion in `DEV_LOG.md` as evidence before accepting Phase 5.
- **Exit condition:** UX findings and student acceptance are recorded, followed by a Git checkpoint.

## Phase 6 — Feedback & Iteration

- **Goal:** Learn from real student use and choose a small, valuable improvement.
- **Tasks:** Invite a few target students to try the MVP; record where they hesitate; prioritize at most a few changes that support the original learning goal.
- **Acceptance Criteria:** Feedback is documented, a concrete improvement is selected or a reason to make no change is recorded, and MVP scope remains clear.
- **How AI will test it:** Review feedback against success criteria and test any accepted small change with an appropriate focused check.
- **How the student will check it:** Observe or discuss a real student's experience and decide whether the selected improvement helps.
- **Exit condition:** Feedback, decision, any change, human acceptance, and a Git checkpoint are recorded before planning another phase.
