# BioSignal Explorer — Phased Plan

Only the current phase may be worked on. Record its evidence in `DEV_LOG.md` and obtain student acceptance before entering the next phase. A Git checkpoint should capture each accepted phase. This plan describes future work; it does not mark those phases complete.

**Current status:** Phase 1 — Accepted. The student completed human review and accepted Phase 1 — Project Foundation on 2026-09-24. The accepted documentation state is checkpointed by the local Git tag `phase-1-accepted`. Phases 2–6 have not started and must not start automatically.

**Confirmed boundaries:** HTML, CSS, and Vanilla JavaScript in the browser; ECG files stay local and are never uploaded. No React, Vue, Next.js, backend, database, login, diagnosis, arrhythmia classification, AI analysis, other signal types, or complex signal processing. The public repository is planned as `biosignal-explorer` under the student's personal GitHub account; it is not yet created or connected. Maintain all three logs and Git checkpoints across future iterations. `PROJECT_SCOPE.md` defines the CSV and output contract.

## Phase 1 — Project Foundation

- **Status:** Accepted by the student on 2026-09-24.
- **Goal:** Establish a minimal project structure, project records, and a development approach suitable for a student.
- **Tasks:** Inspect the starting directory; create the scope, plan, logs, and README; initialize local Git; record the confirmed technology, future browser running method, CSV contract, outputs, repository plan, and iteration rules. Finish this phase with documentation only.
- **Acceptance Criteria:** The documents agree on the confirmed scope and current status; the directory is understandable; Git tracks the project records; the future running method is explained without claiming an existing application. A runnable page and a connected GitHub repository are not gates for this documentation phase.
- **How AI will test it:** Check required files and sections, review agreement across documents, inspect the Git diff and history, and confirm that no business code or dependencies were introduced.
- **How the student will check it:** Read the scope and plan, confirm that the structure and technical direction are understandable, and explicitly accept Phase 1.
- **Exit condition:** Met: explicit human acceptance is recorded in `DEV_LOG.md`, with the accepted state preserved at Git tag `phase-1-accepted`. Phase 2 requires a subsequent instruction to begin.

## Phase 2 — CSV Import

- **Goal:** Read a fixed-format CSV containing `time` and `voltage`.
- **Tasks:** Implement local file selection and CSV parsing against the confirmed contract: exact headers `time,voltage`, numeric time in s and voltage in mV in every data row, at least 3 valid data rows, and strictly increasing time. For adjacent intervals `Δt`, require every interval to differ from `mean(Δt)` by no more than 5%, inclusive. Reject rule violations with clear user-facing errors. Sampling Rate will later be calculated in Phase 4 as `1 / mean(Δt)`.
- **Acceptance Criteria:** A valid CSV loads both columns in order without uploading data. Incorrect headers, nonnumeric values, fewer than 3 valid data rows, duplicate or decreasing time, and any interval beyond the 5% limit cause file rejection with understandable feedback. Invalid rows are not silently discarded. No arbitrary column or unit mapping is offered.
- **How AI will test it:** Compare a known valid CSV with expected parsed rows; check incorrect headers, nonnumeric values, 2 versus 3 data rows, duplicate/decreasing time, intervals exactly at the inclusive 5% boundary, and an interval beyond it. Inspect the file-reading path for unintended uploads.
- **How the student will check it:** Import a real class or sample ECG CSV and confirm the values and error messages make sense.
- **Exit condition:** Parsing behavior and its tests are recorded, the student accepts the result, and a Git checkpoint is made.

## Phase 3 — ECG Visualization

- **Goal:** Show voltage over time as an ECG waveform.
- **Tasks:** Draw the waveform from successfully imported data; label time (s) and voltage (mV) axes; keep the presentation readable for a beginner.
- **Acceptance Criteria:** The plot reflects the CSV row order and values, axes are understandable, and a typical ECG file is clearly visible.
- **How AI will test it:** Check plotted coordinates or rendered output against a known tiny dataset and inspect visual behavior with a representative ECG CSV.
- **How the student will check it:** Compare the plot with the source data and confirm the relationship between rows and waveform is clear.
- **Exit condition:** Visualization evidence and student acceptance are recorded, followed by a Git checkpoint.

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
