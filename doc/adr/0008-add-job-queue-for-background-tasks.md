# 8. Add Job Queue for background tasks

Date: 2023-01-27

## Status

Accepted

## Context

We need to send mails to users when the tax declaration was sent successfully. We want that to take place in the
background to prevent waiting times for the user.

## Decision

We use [BullMQ](https://docs.bullmq.io/guide/introduction).

**Assumption:** jobs are small, e.g. a request to Sendinblue or Erica and/or a database read/update (no heavy lifting)

- one queue per job type, e.g. sending FSC request confirmation mail is one queue, sending FSC reminder mail is another queue
- one worker per queue
- example calculation: given we have 8 web instances and 5 queues → 40 workers (5 workers per instance, one for each queue)

## Consequences

- workers share Node.js process with web app (there are no separate worker processes) →
- con: we cannot scale workers independently from web processes (assuming we don’t need that)
- pro: setup is simple (no extra container for workers)

The job queue could be used for more tasks (e.g. replacing the cronjob for checking erica requests.)
