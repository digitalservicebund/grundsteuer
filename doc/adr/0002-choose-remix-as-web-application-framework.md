# 2. Choose Remix as web application framework

Date: 2021-12-17

## Status

Decided

## Context

The _Grundsteuer_ project hasn't started yet but we expect that we will build an application which will be concerned with submitting forms. The main part of the application will probably consist of user-facing functionality. We don't expect significant amounts of business logic, which won't already be handled by separate microservices. We are looking for a framework supporting developers to create a great and resilient UX for all users.

## Decision

We investigated several options and after getting an overview of possible candidates we made decisions.

- we decided against a pure SPA + REST API approach, as this doesn't allow us to cater for users where JavaScript is disabled, isn't working or loading slowly. We want the framework to support server-side rendering (SSR).
- we decided against a traditional setup with only server-side rendering, as this would restrict our possibilities to create a great UX. We want to be able to use client-side rendering.
- we decided to use a fullstack framework, as it supports developers to create applications that support both – server-side and client-side rendering – without having to implement UI logic twice.
- we chose [Remix](https://remix.run/) from several fullstack options, as besides data loading it also supports data writing very well. We will have quite some forms, so this is an important feature and a main differentiator to other fullstack frameworks.

## Consequences

In comparison to non-fullstack frameworks, Remix will significantly increase developer productivity when creating _progressively enhanced_ applications.

Remix is not mature. It was open-sourced only a few weeks ago and ecosystem and community are still small. But the reception in the developer community is quite positive, the Remix team consists of experienced figures and just got funded with $3M. The outlook is positive but we likely have to deal with lack of things (documentation, libraries).

The development team has no deep knowledge working with fullstack frameworks, and knowledge of React and Typescript varies. As there is some time left before the official project launch, we can use that time to become more familiar with the new technologies, but we probably also need to plan for extra learning time on the project.
