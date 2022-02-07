# 6. Data model

Date: 2022-02-07

## Status

Accepted

## Context

So far we only have isolated step objects. At some point we need to combine them, validate them and send them to Erica.

## Decision

Besides step objects we create objects which combine several steps and validate them together. At the "top" we have a form object which contains all steps.

## Consequences

Hierarchical organization and divide et impera keeps complexity low. We have places to validate dependencies between steps.
