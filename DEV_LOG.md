# Development Log

Add one entry for each meaningful work package. Keep test evidence and human acceptance separate; AI verification does not imply student acceptance.

**Current status:** Phase 1 — Accepted, preserved at Git tag `phase-1-accepted`. Phase 2 — CSV Import is Accepted following human review on 2026-09-25, with stable checkpoint tag `phase-2-accepted`. Phase 3 has not started. Earlier entries describe the state at their checkpoints; the latest entry records the current acceptance and decisions.

## Entry template

### Date

YYYY-MM-DD

### Phase

Phase number and work package

### What was completed

- Changes made and relevant Git checkpoint, if any.

### Problems

- Problems encountered, or `None`.

### Testing

- Check performed, result, and limitations.

### Human acceptance

- `Pending` until the student reviews and explicitly accepts this phase; then record date and feedback.

### Next step

- One next work package. Do not start the next phase before acceptance.

---

## 2026-09-24 — Phase 1: Initial project skeleton and documents

### Date

2026-09-24

### Phase

Phase 1 — Project Foundation, initial documentation work package

### What was completed

- Inspected an empty starting directory containing only `work/` and `outputs/`.
- Created the project documents, `src/` placeholder, and `.gitignore`.
- Initialized local Git and created initial checkpoint `4476555`. GitHub is not connected yet.

### Problems

- No existing application structure or Git repository was present. This was expected, not an application error.

### Testing

- Verified required document sections, file structure, and local Git state after creation.
- No application tests were run because no application code exists.

### Human acceptance

- The student accepted the initial skeleton and phase breakdown on 2026-09-24. Full Phase 1 acceptance was subsequently recorded in the acceptance entry below.

### Next step

- Completed by the scope-confirmation work package below; no Phase 2 implementation was authorized.

---

## 2026-09-24 — Phase 1: Final scope confirmation

### Date

2026-09-24

### Phase

Phase 1 — Project Foundation, documentation-only scope confirmation; ready for human acceptance at this historical checkpoint.

### What was completed

- Updated `PROJECT_SCOPE.md`, `PLAN.md`, `README.md`, and `DECISIONS.md` with the student's confirmed browser-based HTML/CSS/Vanilla JavaScript approach and local-only ECG file processing without server uploads.
- Recorded the exact `time,voltage` header, numeric values, s/mV units, strictly increasing time, approximate even sampling, and fixed-column/unit restriction.
- Clarified output definitions: voltage against time; Duration as last minus first time; Sampling Rate from the mean adjacent interval; voltage Maximum, Minimum, and arithmetic Mean.
- Recorded the planned personal public GitHub repository `biosignal-explorer`; no repository was created, connected, or published.
- Confirmed MVP exclusions, long-term maintenance of all three logs and Git checkpoints, and human acceptance before further phases.
- Recorded acceptance of the initial skeleton and phase breakdown separately from the pending acceptance of the updated Phase 1 documents.
- Left `ERROR_LOG.md` unchanged because no new error incident occurred. No business code or dependencies were added.
- Local documentation checkpoint: `1860aef` — `docs: confirm Phase 1 scope and acceptance gate`.

### Problems

- None. At this checkpoint, sampling tolerance and insufficient-sample handling were deferred; the acceptance entry below records their subsequent resolution.

### Testing

- Reviewed all six documents for agreement on technology, input units and rules, outputs, exclusions, repository status, and phase gates.
- Verified that every planned phase retains Goal, Tasks, Acceptance Criteria, How AI will test it, How the student will check it, and Exit condition.
- Checked the Git diff for whitespace errors and limited changes to the five requested Markdown documents. `src/` still contains only its placeholder.
- No application tests were run because no application code exists.

### Human acceptance

- Initial skeleton and phase breakdown: accepted by the student on 2026-09-24.
- Updated Phase 1 scope confirmation: acceptance was pending at this checkpoint and was subsequently recorded in the acceptance entry below.

### Next step

- The requested review was completed by the student; see the acceptance entry below. Phase 2 still requires a subsequent instruction to begin.

---

## 2026-09-24 — Phase 1: Human acceptance and stable checkpoint

### Date

2026-09-24

### Phase

Phase 1 — Project Foundation: Accepted.

### What was completed

- Recorded the student's explicit acceptance of Phase 1 in `PLAN.md`, this log, and the status summaries in `README.md` and `DECISIONS.md`.
- Updated `PROJECT_SCOPE.md`, `PLAN.md`, `README.md`, and `DECISIONS.md` with the exact `time,voltage` headers, numeric values in both columns, at least 3 valid data rows, and strictly increasing time.
- Recorded adjacent intervals `Δt`, later Sampling Rate calculation `1 / mean(Δt)`, and the inclusive rule that every interval differs from the mean by no more than 5%.
- Recorded whole-file rejection with clear user-facing errors for validation violations, without silently discarding invalid rows.
- Added a future Phase 5 Human Acceptance check: at least one target user must connect a CSV point to the waveform and explain at least one displayed signal parameter in their own words; responses will be recorded here during Phase 5.
- Preserved the accepted documentation state with commit message `docs: record Phase 1 acceptance and CSV validation rules` and annotated local Git tag `phase-1-accepted`.

### Problems

- None. `ERROR_LOG.md` has no new incident to record.

### Testing

- Reviewed all six documents for consistent acceptance status, CSV validation rules, output definitions, and phase boundaries.
- Checked that the minimum is 3 valid rows, the 5% bound applies to every interval and is inclusive, and invalid files are rejected.
- Verified the Phase 5 learning check is future human work, with both requested tasks and a record of the user's responses.
- Checked the Git diff for whitespace errors and confirmed that changes are limited to five Markdown documents; no business code or dependencies were added.
- No application tests were run because no application code exists.

### Human acceptance

- Phase 1 — Accepted. The student explicitly stated: “Phase 1 — Project Foundation is ACCEPTED.”
- Acceptance date: 2026-09-24. The validation decisions and future Phase 5 acceptance item were supplied in the same instruction.

### Next step

- Stop after the documentation checkpoint. Wait for a separate instruction to begin Phase 2; human acceptance of Phase 1 does not automatically authorize implementation.

---

## 2026-09-25 — Phase 2: CSV Import implementation

### Date

2026-09-25

### Phase

Phase 2 — CSV Import; waiting for human acceptance.

### What was completed

- The student explicitly authorized Phase 2. Inspected the clean working tree and observed the configured personal GitHub `origin` remote.
- Replaced the empty source placeholder with a minimal HTML/CSS/Vanilla JavaScript importer: file selection, browser-local reading, fixed CSV parsing, all required validations, in-memory arrays, success/error messages, and imported sample count.
- Added a stale-read guard and cleared previous data/count on every new selection, including failed imports.
- Added seven synthetic CSV fixtures and two dependency-free automated test files. Added exact Human Acceptance steps and expected results to `README.md`.
- Packaged the tracked sample files and acceptance instructions into the ignored user-facing `outputs/phase-2-acceptance.zip`; archive integrity was checked.
- Synchronized scope, plan, README, and current log status; recorded the parser/precision/state decision and the actual browser-tool restriction.
- No waveform, signal metrics, signal processing, AI, backend, database, or external dependency was added.
- Local implementation checkpoint uses commit message `feat: implement Phase 2 CSV import and validation`. It is not a Phase 2 acceptance checkpoint; the Phase 1 tag remains unchanged.

### Problems

- The browser tool blocked the local `file://` page before loading it. See `ERROR_LOG.md`. No workaround was attempted; real-browser acceptance remains outstanding.

### Testing

- All 23 automated tests passed, using Node built-ins and the bundled runtime because `node` is not on the shell PATH.
- Command: `/Users/shenzeyu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/csv.test.cjs tests/app.test.cjs`.
- Required cases: valid CSV, wrong headers, nonnumeric values, fewer than 3 rows, non-increasing time, exactly 5% deviation (both directions), and greater than 5% deviation.
- Additional checks cover a later invalid interval, malformed/empty cells and rows, numeric formats, BOM/line endings, finite interval range, file extension, read failure, replacement/reset, and stale reads.
- Application tests use a minimal DOM stand-in and assert the actual event handler's in-memory arrays and displayed messages/count. They do not verify native file-picker behavior or rendering.
- Source review confirms no network calls, external resources, storage, or signal metric display. Git diff checks cover whitespace and intended changes only.

### Human acceptance

- Pending. Phase 2 is waiting for human acceptance, not accepted. The seven files in `tests/fixtures/` and the steps in `README.md` are ready for review.

### Next step

- Stop. Await the student's browser checks and explicit Phase 2 acceptance. Do not begin Phase 3.

---

## 2026-09-25 — Phase 2: Human acceptance and closure

### Date

2026-09-25

### Phase

Phase 2 — CSV Import: Accepted.

### What was completed

- Recorded the student's completed manual review and explicit acceptance of Phase 2 in `PLAN.md` and this log; synchronized `README.md` so its current status no longer says acceptance is pending.
- Preserved the accepted state with commit message `docs: record Phase 2 human acceptance` and annotated tag `phase-2-accepted`. This checkpoint includes the existing implementation commit `e708ce7` without changing its functionality.
- The closure publishes `main` and `phase-2-accepted` to `origin` at `https://github.com/shenzeyu070918-eng/biosignal-explorer.git`; verify both remote refs against the local checkpoint after pushing.

### Problems

- None reported during human acceptance. The earlier browser-tool restriction remains a historical testing limitation; the student has now completed the manual checks.

### Testing

- Human-reported result: all seven acceptance files passed their expected outcomes — `valid.csv`, `wrong-headers.csv`, `non-numeric.csv`, `too-few-rows.csv`, `non-increasing.csv`, `exactly-five-percent.csv`, and `over-five-percent.csv`.
- Human-reported result: valid → invalid → valid handling worked, including clearing the old result on rejection and recovering on the next valid import.
- Human-reported result: refreshing correctly reset the page to its initial state.
- Reviewed the documentation diff and checked whitespace. No application tests were rerun because this closure changes documentation only; the prior 23-test result is recorded above.

### Human acceptance

- Phase 2 passed human acceptance on 2026-09-25. The student explicitly stated: “Phase 2 has passed human acceptance.”
- Acceptance includes all seven CSV cases, replacement state handling, and refresh reset.

### Next step

- Stop after publishing and verifying the accepted checkpoint. Phase 3 and ECG visualization have not started; wait for a separate instruction before new feature work.
