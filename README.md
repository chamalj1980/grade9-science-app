# Grade 9 Science Learning App

A single web-based learning app for Grade 9 Science.

The app will initially cover:

1. Pressure Exerted by Solids
2. Human Circulatory System

## Product Specification

The canonical development specification is located at:

`docs/grade_9_science_single_learning_app_development_spec.md`

## Curriculum Accuracy Notes

Curriculum-specific facts, formulas, labels, and compatibility rules are tracked in:

`docs/curriculum_accuracy_notes.md`

## Proposed Tech Stack

- React
- Vite
- TypeScript
- CSS
- Vitest

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

The app is fully client-side. Progress for the initial shell is saved in browser
local storage.

## Development Approach

Development should be done milestone by milestone:

1. App shell
2. Pressure calculation utilities
3. Pressure Playground
4. Pressure lesson
5. Pressure sorting and calculation drill
6. Circulatory lesson
7. Label the Heart exercise
8. Transfusion Lab
9. Accessibility and performance polish
