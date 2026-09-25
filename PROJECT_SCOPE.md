# BioSignal Explorer — Project Scope

## Project purpose

Build a small learning tool that helps beginners connect raw ECG data, its waveform, and basic signal measurements. The first version should be useful in a real learning session and simple enough for a student to understand and maintain.

## Target users

Undergraduate beginners in intelligent medical engineering, biomedical engineering, and related physiological signal courses, including the project owner.

## Core problem

A student may have ECG values in a file or see an ECG figure in a textbook, but still struggle to connect each `time` / `voltage` row with the displayed waveform and its basic properties. The tool should make that connection quicker and clearer than a general AI conversation.

## Core features

The intended first user flow is: open the website → import an ECG CSV → read its data → display the waveform → show basic information → inspect the relationship between the data and the result.

## MVP

- Accept one user-selected CSV file with exactly the columns `time` and `voltage`.
- Read those columns and report a clear error when the file cannot be used.
- Plot voltage against time as a clear ECG waveform.
- Show Duration, Sampling Rate, Maximum, Minimum, and Mean.
- Explain the displayed values in plain language so a beginner can connect the rows, the axes, and the summary.

### CSV specification

- File type: CSV, with exactly two columns and the exact header row `time,voltage`.
- `time`: numeric values in seconds (s), strictly increasing in file order.
- `voltage`: numeric values in millivolts (mV).
- At least 3 valid data rows are required. Both columns must contain numeric values in every data row.
- Let each adjacent interval be `Δt_i = time[i+1] - time[i]`, and let `μ = mean(Δt)`. Strictly increasing time makes every interval and `μ` positive.
- Data is approximately uniformly sampled only if every interval satisfies `abs(Δt_i - μ) <= 0.05 * μ`. The 5% boundary is inclusive.
- Reject any file that violates these rules with a clear user-facing error message. Do not silently discard invalid rows to make a file pass validation.
- Arbitrary column names and alternative units are not supported.

### Output definitions

- ECG waveform: voltage (mV) against time (s).
- Duration (s): last time value minus first time value.
- Sampling Rate (Hz): later calculate `1 / mean(Δt)` for a file that passes all CSV validation rules, including the minimum of 3 valid data rows and the 5% sampling-uniformity limit.
- Maximum, Minimum, and Mean (mV): respectively the maximum, minimum, and arithmetic mean of the voltage values.

Phase 2 provides import, validation, and an imported sample count. Phase 3 adds a waveform using those validated in-memory arrays, with labeled time (s) and voltage (mV) axes. The five signal metrics remain requirements for later phases. The MVP does not include resampling or correction of irregular data.

## Non-goals for the current MVP

- Medical diagnosis, clinical advice, disease classification, or arrhythmia detection.
- User login, accounts, database, or server-side storage.
- EEG, PPG, EMG, or other signal types.
- Complex filtering or other complex signal processing, R-peak detection, or heart-rate estimation.
- AI analysis of any kind, or dependencies added only to make the project appear complete.

## Constraints

- Keep the first version small, useful, and real. Make the smallest change necessary.
- Finish and accept one clearly scoped phase before starting the next.
- Record meaningful work, decisions, errors, tests, and human acceptance.
- Maintain `DEV_LOG.md`, `DECISIONS.md`, `ERROR_LOG.md`, and Git checkpoints throughout development.
- The project uses the personal repository `biosignal-explorer`, planned as public. Local Git remote `origin` is configured as `https://github.com/shenzeyu070918-eng/biosignal-explorer.git`.
- Do not add features outside the current MVP without an explicit scope decision.

## Technical direction

The confirmed approach is a browser-based web application built with HTML, CSS, and Vanilla JavaScript. Do not use React, Vue, Next.js, a backend, or a database in the MVP. All ECG files are read and processed locally in the browser and are never uploaded to a server.

Open `src/index.html` directly in a browser, without a framework, build step, or server. The page provides CSV import and a native SVG waveform. Keep the code structure simple and introduce separation only when actual implementation needs it; do not build abstractions for hypothetical future signals or features.

## Success criteria

1. A correctly formatted ECG CSV can be selected and loaded.
2. `time` and `voltage` are read correctly.
3. The ECG waveform is clearly visible with meaningful axes.
4. Duration, Sampling Rate, Maximum, Minimum, and Mean are displayed correctly for known sample data.
5. In Phase 5, at least one target user can identify how a CSV data point relates to the waveform and explain at least one displayed signal parameter in their own words.

## Future expansion principle

This is a long-term, continuously iterative project. After observing real student use, add one valuable capability at a time. ECG analysis, R-peaks, heart rate, filtering, and other signal types are possible later directions, but none is part of this MVP. Define and record each future feature as a separate phase with scope, decisions, tests, and human acceptance. Start it only after the previous phase has been accepted; acceptance does not automatically start further work.
