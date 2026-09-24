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

The precise accepted time unit, voltage unit, CSV validation rules, and sampling-rate calculation will be decided before implementing the relevant phase and recorded in `DECISIONS.md`.

## Non-goals for the current MVP

- Medical diagnosis, clinical advice, disease classification, or arrhythmia detection.
- User login, accounts, database, or server-side storage.
- EEG, PPG, EMG, or other signal types.
- Complex filtering, signal processing, R-peak detection, or heart-rate estimation.
- Large AI features or dependencies added only to make the project appear complete.

## Constraints

- Keep the first version small, useful, and real. Make the smallest change necessary.
- Finish and accept one clearly scoped phase before starting the next.
- Record meaningful work, decisions, errors, tests, and human acceptance.
- Use Git checkpoints for local history; connect to GitHub when the owner chooses a repository.
- Do not add features outside the current MVP without an explicit scope decision.

## Technical direction

Prefer a simple browser-based solution that a beginner can inspect and maintain. Plain HTML, CSS, and JavaScript are the initial direction, not a locked implementation decision. Confirm the smallest workable approach in Phase 1. No framework, database, or substantial dependency is justified by the current requirements. Keep uploaded data local to the browser if this direction is used.

## Success criteria

1. A correctly formatted ECG CSV can be selected and loaded.
2. `time` and `voltage` are read correctly.
3. The ECG waveform is clearly visible with meaningful axes.
4. Duration, Sampling Rate, Maximum, Minimum, and Mean are displayed correctly for known sample data.
5. A beginner can explain how the CSV rows relate to the plotted waveform and basic information after using the page.

## Future expansion principle

After observing real student use, add one valuable capability at a time. ECG analysis, R-peaks, heart rate, filtering, and other signal types are possible later directions, but none is part of this MVP. Each addition needs its own scope, decision, tests, and acceptance before implementation.
