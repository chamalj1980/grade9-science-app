# AGENTS.md

## Project goal

Build a single Grade 9 Science learning web app for English-medium Sri Lankan curriculum content.

The canonical product specification is:

`docs/grade_9_science_single_learning_app_development_spec.md`

Do not change curriculum facts unless explicitly requested.

## Development rules

- Use React + Vite + TypeScript.
- Keep the app fully client-side.
- No backend.
- Avoid unnecessary heavy dependencies.
- Prefer SVG, CSS animation, and lightweight Canvas.
- Keep components small and reusable.
- All calculations must be covered by unit tests.
- Use accessible controls: keyboard support, visible focus states, labels, ARIA where useful.
- Use friendly Grade 9 language.
- Keep text short and visual.

## Scientific accuracy rules

### Pressure

- Use `P = F / A`.
- Units: `F` in N, `A` in m², `P` in Pa.
- More force increases pressure.
- Larger area decreases pressure.
- Test all generated numerical examples.

### Circulatory system

- Do not invent anatomy.
- Preserve the named vessels, chambers, valves, blood components, and transfusion rules from the spec.
- Blood flow animation must follow:

`body → vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary veins → left atrium → left ventricle → aorta → body`

## Review guidelines

- Treat incorrect formulas or wrong compatibility logic as critical bugs.
- Treat inaccessible drag/drop interactions as high-priority bugs.
- Treat broken tablet layout as high-priority.
- Treat spelling or terminology errors in curriculum vocabulary as high-priority.
