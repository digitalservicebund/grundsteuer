# 4. Form step objects

Date: 2022-02-07

## Status

Accepted

## Context

Requirements were updated. Steps might be executed more than once.

## Decision

We create objects for single steps. They encapsulate data and behavior. A step only knows about itself. Especially it does not know about other steps.

## Consequences

Re-using a step becomes easier.
