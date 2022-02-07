# 5. User flow logic with statecharts

Date: 2022-02-07

## Status

Accepted

## Context

Requirements were updated. Our simple first approach will become quite complicated when we try to adapt it to new requirements. We need something more suitable.

## Decision

We use statecharts to model the user flow logic. They allow us to model even very complicated logic. They can be visualised for better understanding and collaboration. We use the xstate library.

## Consequences

We get the benefits of using statecharts (easier to understand, decoupled behavior, scales well with complexity and more). It's a new technique for the team, need to learn it.
