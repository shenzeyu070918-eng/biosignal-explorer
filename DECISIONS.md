# Decision Log

Record each meaningful choice when it is made. Revisit a decision only when new evidence warrants it.

Entries describe their historical checkpoint. Current implementation status is in `PLAN.md` and `DEV_LOG.md`.

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

Output the ECG waveform, Duration, Sampling Rate, Maximum, Minimum, and Mean. To make the scope checkable, define Duration as last minus first time (s), estimate Sampling Rate as the reciprocal of the mean consecutive time interval (Hz), and calculate Maximum, Minimum, and arithmetic Mean from voltage (mV). The subsequent CSV validation decision below requires at least 3 valid data rows before producing results. The mean interval gives one rate estimate when intervals vary slightly; it does not correct irregular sampling.

### Reason

One fixed data contract makes raw rows, axes, and basic values easier for beginners to connect. The sampling-rate definition implements the student's interval-based requirement.

### Trade-offs

Files using other conventions must be prepared outside this MVP. Approximately even sampling does not imply support for arbitrary irregular data. The tolerance and insufficient-sample response, initially deferred, are resolved by the CSV validation decision below.

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

At the scope-confirmation checkpoint, Phase 1 was marked ready for human acceptance. The student subsequently accepted Phase 1 on 2026-09-24; this is recorded in `DEV_LOG.md` and preserved at Git tag `phase-1-accepted`. This phase's deliverable is the documented foundation; a runnable application and connected GitHub repository are not acceptance gates for this work package. Do not start Phase 2 automatically. Future features must be introduced one phase at a time, only after the previous phase is accepted and further work is requested.

The current MVP excludes diagnosis, arrhythmia classification, AI analysis, login, database, backend, EEG/PPG/EMG, and complex signal processing. Possible later R-peak, heart-rate, filtering, or additional-signal work requires a future scope decision.

### Reason

Explicit phase boundaries keep the learning project small and ensure every meaningful change can be reviewed and understood.

### Trade-offs

Further work waits for review and the next work package. Future extensibility is achieved through gradual changes rather than infrastructure built in advance.

## Decision: CSV validation thresholds and rejection — 2026-09-24

### Context

After accepting Phase 1, the student specified validation rules to document before authorizing Phase 2. These resolve the previously deferred sampling tolerance and insufficient-sample handling.

### Options considered

- Leave these details open until Phase 2, as previously planned.
- Record the student's explicit thresholds and rejection behavior now.

### Final choice

Require the exact header `time,voltage`, numeric values in both columns of every data row, at least 3 valid data rows, and strictly increasing time. Existing units remain seconds (s) and millivolts (mV).

Define `Δt_i = time[i+1] - time[i]` and `μ = mean(Δt)`. Accept approximate uniform sampling only when every interval satisfies `abs(Δt_i - μ) <= 0.05 * μ`, including the 5% boundary. Sampling Rate will later be calculated as `1 / mean(Δt)` in Hz.

Reject any file violating these rules with a clear user-facing error message. Do not silently discard invalid rows, resample, or correct data to make a file pass. This decision documents future behavior only; Phase 2 remains unstarted.

### Reason

The fixed rules make acceptance reproducible and give the interval-based Sampling Rate estimate a clear input contract.

### Trade-offs

Files with fewer than 3 valid rows or any interval beyond the 5% tolerance are rejected even if they could be useful for other purposes. The MVP supports only this small, explicit input scope.

## Decision: Phase 5 learning check with a target user — 2026-09-24

### Context

The project should help beginners connect raw ECG data with the waveform and basic signal information. The student requested direct evidence of this understanding during Phase 5.

### Options considered

- Rely on the existing flow, desktop, and mobile checks.
- Add a target user's explanation to the future human acceptance evidence.

### Final choice

In Phase 5, ask at least one target user to identify how a CSV data point relates to the waveform and explain at least one displayed signal parameter in their own words. Record their responses and any confusion in `DEV_LOG.md` before accepting Phase 5.

### Reason

The user's explanation provides evidence for the learning goal beyond successful rendering and readable layout.

### Trade-offs

This requires a real target user's participation when Phase 5 is reached. A single user's check is limited evidence, so broader feedback remains planned for Phase 6.

## Decision: Small fixed-format parser and page-memory state — 2026-09-25

### Context

Phase 2 authorizes CSV import and validation only, with no external dependency and a page that opens directly from disk.

### Options considered

- Introduce a general CSV library and a module/build setup.
- Use plain deferred scripts, a pure fixed-format numeric parser, and a small file-selection handler.

### Final choice

Use `src/index.html`, `styles.css`, `csv.js`, and `app.js`. The parser returns `{ time, voltage }` only after validation succeeds. The event handler keeps this result in the page-level `importedData` variable, resets it on a new selection, and ignores stale asynchronous reads. Nothing is persisted or transmitted.

Require a `.csv` extension, case-insensitive, without depending on inconsistent OS MIME labels. Accept UTF-8 BOM, ordinary line endings and one terminal line ending, optional numeric quotes, whitespace around numeric cells, and finite decimal/scientific numbers. Headers remain exactly `time,voltage`. Reject empty cells, blank data rows, non-finite values, wrong column counts, and invalid numeric text without dropping rows. This is a fixed numeric CSV reader, not a general text-field CSV tool.

Compare each normalized interval deviation to `0.05`, with only `8 * Number.EPSILON` added for binary floating-point roundoff. This preserves the inclusive mathematical 5% boundary; a 5.000001% deviation is tested and rejected. Compute the interval mean only for validation; do not calculate or display Sampling Rate or other signal metrics in Phase 2.

### Reason

The pure parser can be checked with Node's built-in tests while the app runs without Node or a server. Separate selection state prevents failed or stale reads from leaving misleading imported data.

### Trade-offs

Files must follow the fixed numeric format and fit in browser memory. Physical units cannot be inferred from numbers, so the page states the required s/mV units. Tests with a simulated DOM verify state and messages but do not substitute for human browser acceptance.

### Follow-up on earlier deferred details

The existing `origin` remote was observed as `https://github.com/shenzeyu070918-eng/biosignal-explorer.git` at the start of Phase 2. The entry-page instructions are now in `README.md`.

## Decision: Native SVG waveform using validated arrays — 2026-09-25

### Context

Phase 3 authorizes only a waveform, labeled axes, and correct replacement/clearing behavior. Phase 2 validation must remain unchanged.

### Options considered

- A chart library, introducing a dependency and extra configuration.
- Canvas, requiring drawing-state and resize handling.
- Native SVG, with one polyline and simple axis/grid elements.

### Final choice

Add `waveform.js` to turn the already validated `importedData` arrays into native SVG. Plot every sample at its actual time and voltage with straight connecting segments. Use automatic axis ranges and numeric ticks labeled Time (s) and Voltage (mV). A constant-voltage signal is centered vertically with its actual voltage as the single Y-axis tick. Internal bounds serve only to map data to plot coordinates; no signal statistics are presented.

Clear the SVG and hide its section immediately on each new selection. Show a new plot only after parsing and validation succeed, using the existing stale-read guard. Reloading starts with an empty hidden section. Keep the existing parser untouched.

### Reason

SVG stays dependency-free, scales with the page, and produces inspectable coordinates for focused tests. It adds one small renderer without restructuring the import flow.

### Trade-offs

The whole file is displayed without zoom, downsampling, filtering, smoothing, or analysis. Long dense recordings may appear crowded. Axis ranges change per file, as explained beside the plot. Small screens may scroll the plot horizontally to preserve label readability. Native browser behavior still requires human acceptance; unit tests and standalone raster inspection do not replace it.


## Decision: Basic metrics from validated arrays, with display-only rounding — 2026-09-25

### Context

Phase 4 requires five calculations using the already validated ECG data, with readable units and correct import/reset behavior. The existing validation and waveform must remain unchanged.

### Options considered

- Calculate and format everything directly in the import handler.
- Add one small, pure calculation/formatting file that is independently testable, and connect it to the existing handler.
- Use a statistics or UI dependency.

### Final choice

Add `signal-info.js` with the five formulas and a display formatter. Duration uses last minus first time. Sampling Rate uses the reciprocal of the mean adjacent interval. Maximum, Minimum, and arithmetic Mean use voltage only. A scaled running average avoids overflowing the sum of large finite voltage values; calculations use JavaScript Numbers without deliberate rounding. Format results to at most six significant digits, trim trailing zeros, and append s, Hz, or mV. Non-finite derived results display “Unavailable (numeric range)” without changing the CSV acceptance rules.

Use a plain definition list below the waveform, with a short explanation for each metric. Populate it only after validation succeeds, using the same `importedData` arrays. Clear every value and hide the section on each new selection or rejection. The existing stale-read guard prevents older reads from restoring old metrics.

### Reason

This keeps formulas easy to inspect and test, adds no dependencies, and reuses the established import lifecycle. Significant digits retain readability for both small and large values without making small nonzero signals appear as zero.

### Trade-offs

JavaScript floating-point arithmetic has finite precision and range; “full precision” means no additional internal rounding, not exact real-number arithmetic. Sampling Rate remains an estimate for approximately uniform sampling. No new input rules, statistical analysis, persistence, or interpretation are introduced. Real browser checks remain human acceptance work.


## Decision: Focused upload, feedback, and narrow-screen presentation — 2026-09-28

### Context

Phase 5 permits only UX and responsive refinements. Inspection found the primary upload control below a long rules block, color-only emphasis for status, and 12-unit SVG ticks shrinking to 9px at the previous 480px chart minimum width. The five metrics were readable but lacked clear value hierarchy.

### Options considered

- Shrink the whole waveform to phone width, making axis labels smaller.
- Build a responsive chart renderer or add zoom/pan controls, increasing code and interaction scope.
- Retain native chart scrolling, enlarge labels, clarify instructions, and adjust only existing markup/styles and SVG label presentation.

### Final choice

Move upload and its live feedback before the detailed rules, preserving the native labeled input and all rules. Give its button a 44px minimum height and stronger contrast. Keep existing explicit success/error text and add panel backgrounds/borders. Use one metric-card column below 600px and two above, with larger values, wrapping, and unchanged units/explanations.

Retain a chart-only horizontal scroll region with a 560px minimum SVG width, 16-unit ticks, and 18-unit axis labels. This keeps ticks at least 14px at the minimum width. Point first/last time labels inward to reduce endpoint clipping. Name the scroll region, make it keyboard-focusable, show a focus outline, and explain swipe/arrow-key use. Preserve plotted coordinates and data processing. Do not hide page overflow to mask layout problems.

### Reason

These changes improve the existing flow without dependencies, new business features, or responsive JavaScript. Native overflow is the smallest way to keep waveform labels readable at 375px and 430px.

### Trade-offs

The full waveform does not fit at once on narrow screens; users must scroll inside the chart and return left for the voltage axis. Real touch scrolling, page layout, and native input presentation depend on the browser and require human acceptance. Static sizing and SVG inspection cannot establish those results. Target-user suggestions will be recorded and prioritized only after review, not automatically implemented.


## Decision: Publish the existing src directory with GitHub Pages — 2026-09-28

### Context

The student requested public deployment of the current static app without feature, UI, or framework changes. The entry page is `src/index.html`, with relative CSS/JavaScript paths. GitHub Pages was not yet configured; repository admin access was available.

### Options considered

- Publish the repository root, requiring an entry redirect or moving app files.
- Duplicate the app into a `docs/` publishing directory, creating two copies to maintain.
- Use a small GitHub Actions Pages workflow to upload `src/` directly, without a build step.

### Final choice

Enable GitHub Pages with the GitHub Actions source and deploy only `src/` using the official checkout, configure-pages, upload-pages-artifact, and deploy-pages actions. Run on pushes to `main` that change `src/**` or the workflow, and allow manual dispatch. Limit the deployment job to repository read, Pages write, and OIDC token permissions. Serialize deployments.

### Reason

This serves the current entry page at the repository URL without moving or copying application files. Relative assets already resolve beneath `/biosignal-explorer/`; no source changes, application dependencies, or build system are needed.

### Trade-offs

Publication depends on GitHub Actions and Pages availability. Documentation-only pushes do not redeploy unchanged app files. Repository documentation and tests remain in GitHub but are not included in the site artifact. Hosting serves static application files; selected ECG files still remain in the user's browser. Deployment does not advance the project to Phase 6 or substitute for target-user acceptance.
