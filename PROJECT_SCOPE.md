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
- The MVP assumes approximately evenly sampled ECG data.
- Arbitrary column names and alternative units are not supported.

### Output definitions

- ECG waveform: voltage (mV) against time (s).
- Duration (s): last time value minus first time value.
- Sampling Rate (Hz): estimated from the intervals between consecutive time values. For at least two samples, use the reciprocal of the mean interval: `1 / mean(time[i+1] - time[i])`. This estimate relies on the approximately even sampling assumption.
- Maximum, Minimum, and Mean (mV): respectively the maximum, minimum, and arithmetic mean of the voltage values.

The numeric tolerance for approximately even sampling and the response to insufficient samples will be documented as validation details in Phase 2 before implementation. The MVP does not include resampling or correction of irregular data.

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
- The planned GitHub repository is `biosignal-explorer`, public, under the owner's personal GitHub account. Its creation and connection are not part of this documentation update; only local Git exists currently.
- Do not add features outside the current MVP without an explicit scope decision.

## Technical direction

The confirmed approach is a browser-based web application built with HTML, CSS, and Vanilla JavaScript. Do not use React, Vue, Next.js, a backend, or a database in the MVP. All ECG files are read and processed locally in the browser and are never uploaded to a server.

The intended running method is to open the future static HTML entry page in a browser, without a framework or build step. No runnable page exists yet. Keep the code structure simple and introduce separation only when actual implementation needs it; do not build abstractions for hypothetical future signals or features.

## Success criteria

1. A correctly formatted ECG CSV can be selected and loaded.
2. `time` and `voltage` are read correctly.
3. The ECG waveform is clearly visible with meaningful axes.
4. Duration, Sampling Rate, Maximum, Minimum, and Mean are displayed correctly for known sample data.
5. A beginner can explain how the CSV rows relate to the plotted waveform and basic information after using the page.

## Future expansion principle

This is a long-term, continuously iterative project. After observing real student use, add one valuable capability at a time. ECG analysis, R-peaks, heart rate, filtering, and other signal types are possible later directions, but none is part of this MVP. Define and record each future feature as a separate phase with scope, decisions, tests, and human acceptance. Start it only after the previous phase has been accepted; acceptance does not automatically start further work.
