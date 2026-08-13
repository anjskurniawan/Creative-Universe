# Documentation Guide

> Status: Current
> Last verified: 2026-08-13

Documentation records verified system state, not plans or task chronology.

## When to update

Update or add a document when a change affects architecture, backend or API behavior, database structure, frontend flows, configuration, dependencies, storage, deployment, operations, security, or durable agent workflows.

## Format

- Keep one independent topic per file.
- Every segment except README.md must have a Last verified date.
- Add every new Markdown file directly to docs/README.md.
- Do not include secrets, environment values, tokens, or private server paths.
- Keep documents under 200 lines unless there is a documented reason.

## Validation

Run the documentation validator. When docs differ from source, source is current truth. Correct docs and retain the decision history in logs/logs.md.
