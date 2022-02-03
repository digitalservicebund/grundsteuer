# 3. Data model for form steps

Date: 2022-02-03

## Status

Accepted

## Context

Tax form is split into many steps ("one thing per page"). At the end you get an overview page which will also resemble the steps. Depending on your input over the course of the process some steps will not be visited because they are not relevant. From the overview page you can go back to single steps to edit data. On every step you have a "next" option to get to the next reasonable step. The model should also allow non-linear access to steps, e.g. via a navigation menu.

From a technical perspective we strive for minimal redundancy. From a multi-disciplinary team perspectiva it would be nice to be able to visualise the logic.

## Decision

We start with modeling the data as a 1-dimensional list of steps. A step contains form fields and validations and metdata for view rendering. A step can have a condition, which is for now a function taking in the current state (input data so far) and returns true or false. One step maps to one page with one url. We construct views from the data model and a parameterized template.

## Consequences

Solution is simple and has no redundancy. Flow logic (e.g. branching) is linearized into the list of steps with conditions and we are not sure if this will scale. Data model and UI are coupled and we expect the benefits to outweigh the drawbacks. Modeling step conditions with plain functions is powerful but difficult to parse for visualisation.
