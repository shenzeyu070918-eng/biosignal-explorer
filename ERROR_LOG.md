# Error Log

Use this when an error or misleading diagnosis teaches something worth preserving. Do not invent incidents just to fill the log.

## Entry template

### What happened?

Date, phase, expected behavior, observed behavior, and a reproducible example if available.

### What did we first think was wrong?

Initial hypothesis and why it seemed plausible.

### What was the real cause?

Confirmed cause and supporting evidence.

### How was it fixed?

Smallest corrective change and how it was verified.

### What did I learn?

One practical lesson for future work.

---

## 2026-09-25 — Automated browser check blocked

### What happened?

During Phase 2, opening the local `src/index.html` file through the browser tool was rejected before the page loaded. Rendering and native file selection could not be verified through that tool.

### What did we first think was wrong?

The tool reported a URL-policy block immediately. There was no evidence of an application failure, so no application-bug hypothesis was adopted.

### What was the real cause?

The browser tool disallowed the requested `file://` URL. Its rejection explicitly prohibited bypassing that restriction.

### How was it fixed?

The tool restriction was not bypassed or resolved. Parser and import-state behavior were verified with 23 dependency-free Node tests. Actual browser rendering and the native file picker remain explicitly listed in the Human Acceptance steps in `README.md`.

### What did I learn?

Distinguish a test-tool restriction from an application error, and report exactly which behavior was verified and which still needs human review.


## 2026-09-28 — Local Python HTTPS verification failed

### What happened?

After Pages deployment succeeded, a verification request through the local Python 3.14 urllib failed with `CERTIFICATE_VERIFY_FAILED: unable to get local issuer certificate` before returning a page response.

### What did we first think was wrong?

The message indicated a certificate trust failure in the verification request; it did not establish an application or deployment failure.

### What was the real cause?

The local Python HTTPS client could not build a trusted certificate chain. System curl, with certificate checks enabled, subsequently retrieved the same public URL and all five assets successfully, and the browser loaded the site. No application-path issue was found.

### How was it fixed?

Completed HTTP/content verification using system curl without disabling TLS verification or modifying certificate stores. All six responses were HTTP 200 and matched the local files exactly. The Python environment was left unchanged.

### What did I learn?

A verification client's trust configuration can fail independently of a deployed site. Verify with a correctly configured client before changing application code or weakening certificate checks.
