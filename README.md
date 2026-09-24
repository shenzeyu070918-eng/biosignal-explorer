# BioSignal Explorer

BioSignal Explorer is a small learning project for students beginning to study ECG and physiological signals. Its goal is to help a student connect a two-column `time` / `voltage` CSV with an ECG waveform and five basic signal values: Duration, Sampling Rate, Maximum, Minimum, and Mean.

**Confirmed MVP:** A browser-based web application using HTML, CSS, and Vanilla JavaScript. It will accept CSV files with the exact header `time,voltage`, numeric time in seconds (s), numeric voltage in millivolts (mV), and strictly increasing time. Approximately even sampling is assumed; Sampling Rate will be estimated from consecutive time intervals. ECG files will only be read locally in the browser and will never be uploaded to a server. See `PROJECT_SCOPE.md` for the precise output definitions.

The MVP excludes React, Vue, Next.js, a backend, a database, login, diagnosis, arrhythmia classification, AI analysis, EEG/PPG/EMG, and complex signal processing.

**Current status:** The student has accepted the skeleton and phase breakdown. Updated Phase 1 documents are ready for human acceptance. The application has not been implemented, and Phase 2 has not started. Local Git is initialized; the planned public GitHub repository is `biosignal-explorer` under the owner's personal account and is not yet created or connected.

**Future running method:** Once implemented, open the static HTML entry page in a browser; no framework or build step is planned. No runnable page or run command exists yet. The intended user flow is to open the website, import an ECG CSV, and inspect the waveform and basic information.

**Ongoing development:** Keep the MVP small and evolve one phase at a time. Maintain `DEV_LOG.md`, `DECISIONS.md`, `ERROR_LOG.md`, and Git checkpoints. Accept each phase before starting the next; do not advance automatically.

See `PROJECT_SCOPE.md` for scope and `PLAN.md` for phase gates.
