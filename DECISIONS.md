# Decision Log

Record each meaningful choice when it is made. Revisit a decision only when new evidence warrants it.

## Decision template

### Decision

Short title and date.

### Context

What problem or constraint required a choice?

### Options considered

- Option A
- Option B

### Final choice

The selected option.

### Reason

Why this is the smallest suitable choice now.

### Trade-offs

What this choice gives up or leaves for later.

---

## Decision: Minimal documentation-first skeleton — 2026-09-24

### Context

The project directory was empty and the current work package is foundation only. No application behavior has been approved for implementation yet.

### Options considered

- Create a full framework project now.
- Create only the agreed documents, a source placeholder, and local Git history.

### Final choice

Create the six requested documents, `src/` placeholder, `.gitignore`, and local Git repository. Defer application files and framework selection.

### Reason

This establishes a clear place for future code and a reviewable checkpoint without committing the project to unneeded dependencies.

### Trade-offs

At this initial checkpoint, there was no runnable application or development command, and technology and repository choices were deferred. The following scope confirmation resolves those choices. No runnable application exists yet.

## Decision: Browser application with local files — 2026-09-24

### Context

The student confirmed a small, understandable technical foundation for the MVP.

### Options considered

- HTML, CSS, and Vanilla JavaScript in the browser.
- A frontend framework and/or a backend with data storage.

### Final choice

Build a browser-based web application with HTML, CSS, and Vanilla JavaScript. Do not use React, Vue, Next.js, a backend, or a database. Read all ECG files locally in the browser without uploading them to a server. The future static HTML entry page will open in a browser without a build step; it does not exist yet.

### Reason

The confirmed MVP needs only local file reading, visualization, and basic calculations. This approach is small and suitable for a student to maintain.

### Trade-offs

No server storage, account synchronization, or framework infrastructure. Add structure only when real implementation needs it, keeping later iteration possible without speculative abstractions.

## Decision: Fixed ECG CSV contract and basic outputs — 2026-09-24

### Context

The student confirmed the input format and six outputs so future phases share a single scope.

### Options considered

- Fixed headers and units with approximately even sampling.
- Configurable column mapping, units, and support for irregular signals.

### Final choice

Accept CSV with exactly the header `time,voltage`. Both columns must be numeric. Time is in seconds (s) and strictly increasing; voltage is in millivolts (mV). Assume approximately evenly sampled ECG data. Do not support arbitrary column names or units.

Output the ECG waveform, Duration, Sampling Rate, Maximum, Minimum, and Mean. To make the scope checkable, define Duration as last minus first time (s), estimate Sampling Rate as the reciprocal of the mean consecutive time interval (Hz, requiring at least two samples), and calculate Maximum, Minimum, and arithmetic Mean from voltage (mV). The mean interval gives one rate estimate when intervals vary slightly; it does not correct irregular sampling.

### Reason

One fixed data contract makes raw rows, axes, and basic values easier for beginners to connect. The sampling-rate definition implements the student's interval-based requirement.

### Trade-offs

Files using other conventions must be prepared outside this MVP. Approximately even sampling is an assumption, not a promise to handle arbitrary irregular data. The tolerance and insufficient-sample response remain implementation details to document in Phase 2 before coding.

## Decision: Personal public GitHub repository and checkpoints — 2026-09-24

### Context

BioSignal Explorer is intended to be maintained and improved over time with traceable development records.

### Options considered

- Local Git history only.
- Local Git checkpoints plus a public repository on the student's personal GitHub account.

### Final choice

Keep the project name BioSignal Explorer and plan a public repository named `biosignal-explorer` under the student's personal GitHub account. Maintain local Git checkpoints, `DEV_LOG.md`, `DECISIONS.md`, and `ERROR_LOG.md`. Repository creation, connection, and publishing are separate from this documentation update; no GitHub repository or remote is currently configured for the project.

### Reason

Local checkpoints make changes reviewable now, and the planned GitHub repository supports continued version management later.

### Trade-offs

Current checkpoints exist only locally. The exact GitHub account handle and remote URL will be needed when repository setup is requested.

## Decision: Phase gates and a small MVP — 2026-09-24

### Context

The student accepted the initial skeleton and phase breakdown and requested a final documentation-only scope confirmation.

### Options considered

- Advance automatically into feature implementation after editing the documents.
- Prepare Phase 1 for human acceptance and stop at the documented phase boundary.

### Final choice

Mark Phase 1 as ready for human acceptance, not accepted or complete. This phase's deliverable is the documented foundation; a runnable application and connected GitHub repository are not acceptance gates for this work package. Do not start Phase 2 automatically. Future features must be introduced one phase at a time, only after the previous phase is accepted and further work is requested.

The current MVP excludes diagnosis, arrhythmia classification, AI analysis, login, database, backend, EEG/PPG/EMG, and complex signal processing. Possible later R-peak, heart-rate, filtering, or additional-signal work requires a future scope decision.

### Reason

Explicit phase boundaries keep the learning project small and ensure every meaningful change can be reviewed and understood.

### Trade-offs

Further work waits for review and the next work package. Future extensibility is achieved through gradual changes rather than infrastructure built in advance.

## Deferred implementation details

- Document the approximate-sampling tolerance and insufficient-sample handling in Phase 2 before implementation.
- Obtain the personal GitHub account handle and remote URL when repository setup is requested.
- Document exact entry-page instructions when a runnable page exists. No further technical-stack, header, or unit selection is pending for Phase 1.
