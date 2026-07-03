# Grade 9 Science Single Learning App — Development Specification

## 1. Purpose

Build **one unified web learning app** for **Grade 9 Science**, English medium, aligned to the Sri Lankan curriculum content provided. The app must combine the two chapter experiences into a single product rather than generating two separate chapter apps.

The app should be joyful, visual, interactive, and suitable for Grade 9 learners aged approximately 13–14. It should help students understand scientific concepts through short lessons, animations, simulations, drag-and-drop activities, calculations, instant feedback, and recap cards.

---

## 2. Change from Original Requirement

The source requirement describes **two separate single-file HTML apps**, one per chapter. This development requirement converts that into **one single learning web app** with multiple science modules.

### Original structure

- Chapter 5 app: Pressure Exerted by Solids
- Chapter 6 app: Human Circulatory System
- Each chapter has its own lesson and two interactive exercises.

### Required new structure

- One web app: **Grade 9 Science Learning App**
- The app contains two learning modules:
  1. **Pressure Exerted by Solids**
  2. **The Human Circulatory System**
- Each module contains:
  - One interactive lesson
  - Two interactive exercises
  - Recap and progress tracking
- A shared home screen, navigation system, visual style, progress model, and accessibility baseline must be used across all modules.

---

## 3. Target Users

### Primary users

Grade 9 students, ages approximately 13–14, studying Science in English medium.

### Secondary users

Teachers, parents, tuition instructors, and school facilitators who may use the app during lessons, revision sessions, exhibitions, or self-learning activities.

---

## 4. Product Goals

The app must:

1. Provide a single place for Grade 9 Science interactive learning.
2. Make abstract science ideas visual and interactive.
3. Support self-paced learning.
4. Reinforce textbook vocabulary, formulas, diagrams, and calculations.
5. Provide immediate feedback with retry opportunities.
6. Work well on school laptops and tablets.
7. Be simple enough to run without complex setup.
8. Be expandable later with more Grade 9 Science chapters.

---

## 5. MVP Scope

The MVP must include:

1. A home dashboard.
2. Module selection for the two chapters.
3. Interactive lesson for Chapter 5: Pressure Exerted by Solids.
4. Exercise 1 for Chapter 5: Pressure Playground.
5. Exercise 2 for Chapter 5: Increase or Decrease? + calculation drill.
6. Interactive lesson for Chapter 6: Human Circulatory System.
7. Exercise 1 for Chapter 6: Label the Heart.
8. Exercise 2 for Chapter 6: Transfusion Lab.
9. Student progress tracking in browser local storage.
10. Responsive layout for laptop and tablet.
11. Accessibility-friendly controls.

---

## 6. Recommended Technical Format

### MVP implementation option

Build as a **single self-contained web app**:

- `index.html`
- Embedded or linked `style.css`
- Embedded or linked `app.js`
- No backend required for MVP
- No login required for MVP
- Store progress in `localStorage`
- Use SVG, Canvas, CSS animations, and vanilla JavaScript where possible

### Alternative implementation option

If a more maintainable codebase is preferred:

- React or Vue single-page app
- Static deployment
- JSON-based content model
- Service worker for offline caching
- Build output still deploys as a single static web app

### Offline behavior

The app should work offline after first load.

Recommended:

- Use a service worker for static asset caching if the app is split into files.
- Avoid depending on external APIs.
- If CDN libraries are used, cache them after first load or bundle them locally for school use.

---

## 7. Performance Requirements

The app should:

- Run smoothly on a normal school laptop or tablet.
- Target approximately 60 fps for animations.
- Avoid heavy 3D rendering unless optimized.
- Prefer SVG/CSS/Canvas for diagrams and animations.
- Keep images compressed.
- Avoid large external libraries unless necessary.
- Degrade gracefully on lower-powered devices.

---

## 8. Design Requirements

The visual design must be:

- Joyful and modern
- Middle-school-friendly
- Bright but calm
- Clean and uncluttered
- Built around rounded cards, soft shadows, large spacing, and readable text

### Suggested design language

- Rounded cards for content blocks
- Large headings
- Short paragraphs
- Friendly iconography
- Calm science-themed colors
- Micro-animations for feedback
- Animated diagrams for abstract concepts
- Large touch targets for tablets

### Tone of voice

Use a friendly, encouraging tone.

Examples:

- “Great! You reduced pressure by increasing the area.”
- “Try again. The force stayed the same, so the area needs to change.”
- “Remember: pressure gets bigger when the same force acts on a smaller area.”

---

## 9. Accessibility Requirements

The app must include:

1. Large tap targets.
2. Keyboard-usable controls.
3. Visible focus states.
4. Readable text contrast.
5. Labels for buttons, sliders, and interactive elements.
6. Alternative text or textual explanation for visual diagrams.
7. No essential information conveyed by color alone.
8. Feedback messages for both correct and incorrect answers.
9. Reduced-motion support where possible.

---

## 10. Global App Structure

### Main screens

1. **Home**
2. **Module Overview**
3. **Lesson**
4. **Exercise 1**
5. **Exercise 2**
6. **Module Recap**
7. **Progress Summary**

### Top-level navigation

The app should have a persistent navigation structure:

- Home
- Modules
- Progress

Within a module, show:

- Lesson
- Exercise 1
- Exercise 2
- Recap

### Progress indicator

Each module should show progress such as:

- Lesson viewed
- Exercise 1 completed
- Exercise 2 completed
- Score or streak where applicable
- Overall module completion percentage

Example:

```text
Pressure Exerted by Solids
Lesson: Complete
Exercise 1: 2/3 challenges complete
Exercise 2: 8/10 cards sorted, 4 calculation streak
Overall: 72%
```

---

## 11. Information Architecture

```text
Grade 9 Science Learning App
│
├── Home Dashboard
│   ├── Continue Learning
│   ├── Chapter Cards
│   └── Overall Progress
│
├── Chapter 5: Pressure Exerted by Solids
│   ├── Interactive Lesson
│   ├── Exercise 1: Pressure Playground
│   ├── Exercise 2: Increase or Decrease? + Calculation Drill
│   └── Recap
│
├── Chapter 6: The Human Circulatory System
│   ├── Interactive Lesson
│   ├── Exercise 1: Label the Heart
│   ├── Exercise 2: Transfusion Lab
│   └── Recap
│
└── Progress Summary
    ├── Chapter Completion
    ├── Scores
    └── Suggested Revision Areas
```

---

## 12. Shared Pedagogical Requirements

Every module must:

1. Start with a relatable hook.
2. Build concepts step by step.
3. Define technical terms the first time they appear.
4. Use diagrams, animation, simulation, or interaction for each abstract idea.
5. Include scientific vocabulary from the textbook.
6. Include exact formulas from the textbook where relevant.
7. Include worked examples.
8. End with a short recap card.
9. Use exercises that require students to do something, not just answer static questions.
10. Provide instant feedback and allow retrying.

---

# Module 1 — Pressure Exerted by Solids

## 13. Module Overview

### Chapter

Chapter 5: Pressure Exerted by Solid

### Learning goals

By the end of this module, students should be able to:

1. Define **pressure** as the perpendicular force acting on a unit area.
2. State the two factors that affect pressure:
   - Perpendicular force
   - Surface area
3. Use the formula:

```text
P = F / A
```

Where:

```text
P = pressure
F = perpendicular force
A = surface area
```

Units:

```text
F = N
A = m²
P = Nm⁻² or Pa
1 Nm⁻² = 1 Pa
```

4. Explain that pressure increases when force increases.
5. Explain that pressure decreases when contact area increases.
6. Give everyday examples of increasing and decreasing pressure.

---

## 14. Pressure Module Navigation

Inside this module, show these tabs or steps:

1. Lesson
2. Pressure Playground
3. Increase or Decrease?
4. Recap

---

## 15. Pressure Lesson Requirements

The lesson must be animated and scrollable.

### 15.1 Hook — The School Bag

Show a student wearing a school bag.

The user can change:

- Strap width: narrow or broad
- Bag weight: light, medium, heavy

Visual response:

- Narrow strap should show higher shoulder pressure.
- Broad strap should show lower shoulder pressure.
- Heavier bag should show higher force and higher pressure.
- A comfort meter should respond to pressure.

Scientific message:

```text
Same force + smaller area = higher pressure.
Same force + larger area = lower pressure.
```

### 15.2 Factor 1 — Force

Animate the soap-and-wire activity.

Interaction:

- Slider controls number of sand bags.
- More sand bags means greater force.
- Greater force means greater pressure.
- Wire cuts soap faster as force increases.

Display:

- Number of sand bags
- Approximate force
- Cutting speed or cutting time
- Short explanation

Scientific message:

```text
When area is kept constant, pressure increases as force increases.
```

### 15.3 Factor 2 — Area

Animate a wooden block on a sponge.

Interaction:

- Switch block orientation:
  - Large face touching sponge
  - Small face touching sponge

Visual response:

- Same block weight should remain constant.
- Smaller contact area should compress the sponge more.
- Larger contact area should compress the sponge less.

Scientific message:

```text
When force is kept constant, pressure increases as area decreases.
```

### 15.4 Definition of Pressure

Reveal the definition step by step.

Required wording:

```text
Pressure is the perpendicular force acting on a unit area.
```

Then reveal the formula:

```text
P = F / A
```

Explain:

- Perpendicular means acting at right angles to the surface.
- Unit area means one square metre when SI units are used.

### 15.5 Units

Explain:

```text
N ÷ m² = Nm⁻²
Nm⁻² = Pa
1 Nm⁻² = 1 Pa
```

Include a short note:

- Pascal is the SI unit of pressure.
- It is named after Blaise Pascal.

### 15.6 Worked Example 1

Problem:

```text
A force of 300 N acts on an area of 2 m². Find the pressure.
```

Solution:

```text
P = F / A
P = 300 N / 2 m²
P = 150 Nm⁻²
P = 150 Pa
```

### 15.7 Worked Example 2

Problem:

```text
A box exerts a pressure of 200 Pa with a force of 400 N. Find the contact area.
```

Solution:

```text
P = F / A
A = F / P
A = 400 N / 200 Pa
A = 2 m²
```

### 15.8 Everyday Connections

Show illustrated cards for:

#### Increasing pressure

- Sharp knife
- Ice-skate blade
- Thin cutting wire
- Drawing pin
- High heel

Scientific explanation:

```text
Pressure increases when the contact area is small or force is large.
```

#### Decreasing pressure

- Broad school bag strap
- Truck with many wheels
- Camel's wide feet
- Tractor's wide tyres
- Flat shoe

Scientific explanation:

```text
Pressure decreases when the contact area is large or force is small.
```

### 15.9 Recap Card

The recap card must include:

```text
Pressure = perpendicular force / area
P = F / A
Pressure increases when force increases.
Pressure decreases when area increases.
```

---

## 16. Exercise 1 — Pressure Playground

### Purpose

Allow students to experiment with force, area, pressure, and visible surface deformation.

### Layout

Show:

- A block
- A squishy surface such as sponge or sand
- Force slider
- Contact area slider
- Live pressure readout
- Color-coded pressure gauge
- Challenge panel
- Feedback panel

### Controls

#### Force slider

```text
Label: Force, F
Unit: N
Suggested range: 50 N to 1000 N
Step: 10 N
```

#### Contact area slider

```text
Label: Contact area, A
Unit: m²
Suggested range: 0.1 m² to 5.0 m²
Step: 0.1 m²
```

### Formula

The app must calculate:

```text
P = F / A
```

Where:

```text
P = pressure in Pa
F = force in N
A = area in m²
```

### Visual behavior

- Higher pressure creates a deeper dent.
- Lower pressure creates a shallower dent.
- The gauge should move from low to high.
- Do not rely only on color; also show text such as Low, Medium, High.

### Mini-challenges

#### Challenge 1

```text
Make the pressure exactly 150 Pa.
```

Validation:

- Accept any values where F / A = 150 Pa.
- Allow a small tolerance, for example ±1 Pa.

Feedback:

```text
Correct! Your force divided by area gives about 150 Pa.
```

#### Challenge 2

```text
Keep the force the same but halve the pressure.
```

Validation:

- Store the starting force and pressure.
- Student must keep force unchanged.
- Student must double the area to halve the pressure.
- Accept tolerance for slider limitations.

Feedback:

```text
Correct! When force stayed the same, doubling the area halved the pressure.
```

#### Challenge 3

```text
Cut the soap: reach at least 500 Pa.
```

Validation:

```text
P >= 500 Pa
```

Feedback:

```text
Correct! High pressure helps the wire cut into the soap.
```

### Required feedback behavior

- Correct answer: checkmark, celebration animation, explanation.
- Incorrect answer: no penalty, explanation, retry option.

---

## 17. Exercise 2 — Increase or Decrease? + Calculation Drill

This screen contains two parts.

---

### 17.1 Part A — Sort the Scene

Students drag cards into two zones:

1. **Increases pressure**
2. **Decreases pressure**

### Cards

| Situation | Correct Category | Scientific Reason |
|---|---|---|
| Sharp knife | Increases pressure | A sharp edge has a small contact area. |
| Ice-skate blade | Increases pressure | A narrow blade creates high pressure on ice. |
| Thin cutting wire | Increases pressure | A thin wire acts over a very small area. |
| Drawing pin | Increases pressure | The pointed tip has a very small area. |
| High heel | Increases pressure | The heel concentrates force on a small area. |
| Camel's wide feet | Decreases pressure | Wide feet spread weight over a large area. |
| Broad bag strap | Decreases pressure | A broad strap spreads force over the shoulder. |
| Truck with many wheels | Decreases pressure | More wheels increase total contact area. |
| Tractor's wide tyres | Decreases pressure | Wide tyres spread force over soft ground. |
| Flat shoe | Decreases pressure | A flat sole has a larger contact area than a heel. |

### Feedback

Each card must give instant feedback:

- Correct: lock card in place and show a one-line reason.
- Incorrect: return card or highlight and explain why.

---

### 17.2 Part B — Calculation Drill

The calculation drill should auto-generate and present textbook-style problems.

Problem types:

1. Solve for pressure:

```text
P = F / A
```

2. Solve for force:

```text
F = P × A
```

3. Solve for area:

```text
A = F / P
```

### Requirements

- Show formula before solving.
- Accept numeric answer.
- Show unit.
- Allow retry.
- Show step-by-step solution after correct answer or after hint.
- Track score and streak.

### Required fixed problems

#### Fixed Problem 1

```text
A force of 300 N acts on an area of 2 m². Find the pressure.
```

Answer:

```text
P = 150 Pa
```

#### Fixed Problem 2

```text
A 400 N box exerts a pressure of 200 Pa. Find the contact area.
```

Answer:

```text
A = 2 m²
```

#### Fixed Problem 3 — Cuboid on different faces

A cuboid has dimensions:

```text
2 m × 1 m × 1 m
```

Weight:

```text
400 N
```

Question A:

```text
Find the pressure when it rests on the 2 m × 1 m face.
```

Calculation:

```text
Area = 2 m × 1 m = 2 m²
P = 400 N / 2 m²
P = 200 Pa
```

Question B:

```text
Find the pressure on the same face when an extra 150 N is added.
```

Calculation:

```text
Total force = 400 N + 150 N = 550 N
Area = 2 m²
P = 550 N / 2 m²
P = 275 Pa
```

Question C:

```text
Find the pressure when the cuboid stands on the 1 m × 1 m face.
```

Calculation:

```text
Area = 1 m × 1 m = 1 m²
P = 400 N / 1 m²
P = 400 Pa
```

---

# Module 2 — The Human Circulatory System

## 18. Module Overview

### Chapter

Chapter 6: The Human Circulatory System

### Learning goals

By the end of this module, students should be able to:

1. Identify the four heart chambers:
   - Right atrium
   - Left atrium
   - Right ventricle
   - Left ventricle

2. Identify main vessels:
   - Aorta
   - Pulmonary artery
   - Pulmonary veins
   - Superior vena cava
   - Inferior vena cava

3. Identify valves:
   - Bicuspid valve / mitral valve
   - Tricuspid valve
   - Semilunar valves

4. Distinguish between:
   - Arteries
   - Veins
   - Capillaries

5. Describe the vessel flow chain:

```text
artery → arterioles → capillaries → venules → veins
```

6. Describe blood components:
   - Plasma, approximately 55%
   - Corpuscles, approximately 45%
   - Red blood cells / erythrocytes
   - White blood cells / leukocytes
   - Platelets

7. Explain basic blood transfusion compatibility:
   - A, B, AB, O blood groups
   - AB is the universal recipient
   - O is the universal donor
   - Rh⁺ can receive Rh⁺ and Rh⁻
   - Rh⁻ can receive Rh⁻ only
   - Agglutination means clumping due to incompatibility

---

## 19. Circulatory Module Navigation

Inside this module, show these tabs or steps:

1. Lesson
2. Label the Heart
3. Transfusion Lab
4. Recap

---

## 20. Circulatory Lesson Requirements

The lesson must be animated and scrollable.

### 20.1 Hook — The Beating Heart

Show a beating heart animation.

Opening text:

```text
This muscle pumps about 100,000 times a day. Let's look inside.
```

### 20.2 Structure of the Heart

Show an interactive labelled longitudinal section of the heart.

Students should be able to click each part and see an explanation.

Required labels:

- Superior vena cava
- Inferior vena cava
- Aorta
- Pulmonary artery
- Pulmonary veins
- Right atrium
- Left atrium
- Right ventricle
- Left ventricle
- Bicuspid valve / mitral valve
- Tricuspid valve
- Semilunar valves

### 20.3 Blood Flow Animation

Animate blood flow using color coding:

- Deoxygenated blood: blue
- Oxygenated blood: red

Correct sequence:

```text
Body → superior/inferior vena cava → right atrium → tricuspid valve → right ventricle → pulmonary artery → lungs → pulmonary veins → left atrium → bicuspid valve → left ventricle → aorta → body
```

Controls:

- Play
- Pause
- Step forward
- Reset

Important accuracy note:

- The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs.
- The pulmonary veins carry oxygenated blood from the lungs to the left atrium.

### 20.4 Blood Vessels

Show side-by-side animated cross-sections.

#### Artery

Must show:

- Carries blood away from the heart
- Thick elastic walls
- High pressure

#### Vein

Must show:

- Carries blood toward the heart
- Thin walls
- Valves to stop backflow
- Lower pressure than arteries

#### Capillary

Must show:

- Very thin walls, one cell thick
- Exchange of gases, nutrients, and wastes

Show the flow chain:

```text
artery → arterioles → capillaries → venules → veins
```

### 20.5 Blood Components

Show an exploded pie or layered composition:

```text
Plasma: approximately 55%
Corpuscles: approximately 45%
```

Cards:

#### Red blood cells / erythrocytes

- Contain haemoglobin
- Carry oxygen

#### White blood cells / leukocytes

- Defend the body
- Produce antibodies

#### Platelets

- Help blood clot
- Note: dengue and leptospirosis can lower platelet count

### 20.6 Blood Transfusion and Blood Groups

Explain:

- Blood groups: A, B, AB, O
- AB is the universal recipient
- O is the universal donor
- Rhesus factor: positive or negative

Compatibility rules required in the app:

```text
AB can receive A, B, AB, and O.
A can receive A and O.
B can receive B and O.
O can receive O only.
Rh⁺ can receive Rh⁺ and Rh⁻.
Rh⁻ can receive Rh⁻ only.
```

Define:

```text
Agglutination is the clumping of red blood cells when donor and recipient blood are incompatible.
```

### 20.7 Recap Card

The recap card must include:

- Heart chambers
- Main blood vessels
- Valves
- Artery, vein, capillary differences
- Blood components
- Blood group and Rh compatibility basics

---

## 21. Exercise 1 — Label the Heart

### Purpose

Help students identify heart parts on a diagram.

### Interaction options

Either of the following is acceptable:

1. Drag-and-drop labels onto numbered slots.
2. Click a numbered marker and choose a label from a list.

### Required labels

- Superior vena cava
- Inferior vena cava
- Aorta
- Pulmonary artery
- Pulmonary veins
- Right atrium
- Left atrium
- Right ventricle
- Left ventricle
- Bicuspid valve / mitral valve
- Tricuspid valve
- Semilunar valves

### Levels

#### Level 1 — Four chambers

Students identify:

- Right atrium
- Left atrium
- Right ventricle
- Left ventricle

#### Level 2 — Vessels

Students identify:

- Aorta
- Pulmonary artery
- Pulmonary veins
- Superior vena cava
- Inferior vena cava

#### Level 3 — Valves

Students identify:

- Bicuspid valve / mitral valve
- Tricuspid valve
- Semilunar valves

#### Level 4 — Textbook-style prompts

Include prompts such as:

```text
Identify the two veins that open into the right atrium.
```

Expected answer:

```text
Superior vena cava and inferior vena cava
```

Prompt:

```text
Find the bicuspid and tricuspid valves.
```

Prompt:

```text
Name the four chambers of the heart.
```

### Feedback behavior

- Correct placements lock in with a snap animation.
- Incorrect placements explain the error.
- Hints are available.
- Completion score is shown.
- Each correct label reveals a one-line fact.

---

## 22. Exercise 2 — Transfusion Lab

### Purpose

Teach blood group and Rhesus factor compatibility through simulation.

### Layout

Show:

- Patient/recipient card
- Blood group selector
- Rh selector
- Donor blood bags
- Compatibility result panel
- Agglutination animation for incompatible transfusion
- Score panel

### Recipient selector

Students choose:

- Blood group: A, B, AB, O
- Rhesus factor: + or −

### Donor bags

Each donor bag has:

- Blood group: A, B, AB, or O
- Rh factor: + or −

Examples:

```text
A+
A-
B+
B-
AB+
AB-
O+
O-
```

### Compatibility logic

A donor is compatible only when both rules pass:

1. ABO group compatibility
2. Rh compatibility

#### ABO compatibility table

| Recipient | Compatible ABO donors |
|---|---|
| A | A, O |
| B | B, O |
| AB | A, B, AB, O |
| O | O |

#### Rh compatibility table

| Recipient Rh | Compatible donor Rh |
|---|---|
| + | +, - |
| - | - |

### Simulation result

#### Compatible

Show:

- Smooth flow animation
- Green tick
- Message: “Safe transfusion.”

Explanation example:

```text
Compatible. A recipient with group AB can receive A, B, AB, or O blood, and Rh⁺ can receive both Rh⁺ and Rh⁻.
```

#### Incompatible

Show:

- Red cells clumping animation
- Warning message
- Explanation of the failed rule

Explanation example:

```text
Incompatible. A group O recipient can receive only group O blood. Other groups may cause agglutination.
```

### Required reinforcement messages

- AB is the universal recipient.
- O is the universal donor.
- Rh⁻ receives Rh⁻ only.
- Agglutination means clumping.

### Recap questions

Include multiple-choice questions such as:

1. Which blood groups can a group B person receive?
2. Who is the universal donor?
3. Who is the universal recipient?
4. Which cells help clotting?
5. Which blood cells contain haemoglobin?
6. What does agglutination mean?

---

# 23. Data Model

The app should use structured content so more chapters can be added later.

Example content model:

```js
const modules = [
  {
    id: "pressure-solids",
    title: "Pressure Exerted by Solids",
    chapter: 5,
    icon: "🧱",
    sections: [
      { id: "lesson", title: "Lesson", type: "lesson" },
      { id: "exercise-pressure-playground", title: "Pressure Playground", type: "simulation" },
      { id: "exercise-pressure-sort-calc", title: "Increase or Decrease?", type: "mixed-exercise" },
      { id: "recap", title: "Recap", type: "recap" }
    ]
  },
  {
    id: "circulatory-system",
    title: "The Human Circulatory System",
    chapter: 6,
    icon: "❤️",
    sections: [
      { id: "lesson", title: "Lesson", type: "lesson" },
      { id: "exercise-label-heart", title: "Label the Heart", type: "labeling" },
      { id: "exercise-transfusion-lab", title: "Transfusion Lab", type: "simulation" },
      { id: "recap", title: "Recap", type: "recap" }
    ]
  }
];
```

---

# 24. Progress Storage

Use browser `localStorage` for MVP.

Example:

```js
const progress = {
  "pressure-solids": {
    lessonViewed: true,
    pressurePlayground: {
      completedChallenges: ["150pa", "halve-pressure"],
      score: 2
    },
    sortAndCalc: {
      sortedCardsCorrect: 8,
      calculationScore: 5,
      bestStreak: 4
    }
  },
  "circulatory-system": {
    lessonViewed: true,
    labelHeart: {
      completedLabels: 12,
      score: 12
    },
    transfusionLab: {
      casesCompleted: 6,
      score: 5
    }
  }
};
```

---

# 25. Scientific Accuracy Rules

Developers must ensure:

1. Pressure calculations are mathematically correct.
2. Units are displayed correctly.
3. Pressure increases with force when area is constant.
4. Pressure decreases with area when force is constant.
5. Heart blood flow direction is correct.
6. Left and right sides of the heart are labeled from the anatomical perspective.
7. Arteries carry blood away from the heart.
8. Veins carry blood toward the heart.
9. Capillaries are the exchange sites.
10. Blood group compatibility checks both ABO and Rh rules.
11. Agglutination is shown only for incompatible transfusion.
12. Scientific vocabulary is spelled consistently:
    - haemoglobin
    - erythrocytes
    - leukocytes
    - bicuspid / mitral valve
    - tricuspid valve
    - semilunar valves

---

# 26. Core Logic Requirements

## 26.1 Pressure calculation

```js
function calculatePressure(forceN, areaM2) {
  return forceN / areaM2;
}
```

## 26.2 Rearranged formulas

```js
P = F / A
F = P * A
A = F / P
```

## 26.3 ABO compatibility

```js
const compatibleAboDonors = {
  A: ["A", "O"],
  B: ["B", "O"],
  AB: ["A", "B", "AB", "O"],
  O: ["O"]
};
```

## 26.4 Rh compatibility

```js
const compatibleRhDonors = {
  "+": ["+", "-"],
  "-": ["-"]
};
```

## 26.5 Full transfusion check

```js
function isCompatibleDonor(recipientAbo, recipientRh, donorAbo, donorRh) {
  const aboOk = compatibleAboDonors[recipientAbo].includes(donorAbo);
  const rhOk = compatibleRhDonors[recipientRh].includes(donorRh);
  return aboOk && rhOk;
}
```

---

# 27. UI Component Requirements

The app should be built from reusable components.

Recommended components:

1. `AppShell`
2. `HomeDashboard`
3. `ModuleCard`
4. `ModuleNav`
5. `ProgressBar`
6. `LessonCard`
7. `InteractiveDiagram`
8. `SliderControl`
9. `FeedbackPanel`
10. `ChallengeCard`
11. `DragDropCard`
12. `CalculationDrill`
13. `HeartDiagram`
14. `BloodFlowAnimation`
15. `TransfusionSimulator`
16. `RecapCard`

---

# 28. Suggested File Structure

For a no-build MVP:

```text
grade-9-science-app/
├── index.html
├── styles.css
├── app.js
├── assets/
│   ├── heart-diagram.svg
│   ├── pressure-icons.svg
│   └── app-icons.svg
└── README.md
```

For a React or Vue version:

```text
grade-9-science-app/
├── src/
│   ├── data/
│   │   ├── modules.js
│   │   ├── pressure.js
│   │   └── circulatory.js
│   ├── components/
│   ├── modules/
│   │   ├── PressureModule/
│   │   └── CirculatoryModule/
│   ├── utils/
│   │   ├── pressure.js
│   │   └── transfusion.js
│   └── App.jsx
├── public/
├── package.json
└── README.md
```

---

# 29. Acceptance Criteria

## 29.1 App-level acceptance criteria

The app is acceptable when:

1. It opens as a single Grade 9 Science web app.
2. It includes both required modules.
3. Students can navigate from Home to either module.
4. Each module has one lesson and two exercises.
5. Progress is saved locally.
6. The app works on laptop and tablet layouts.
7. Interactive controls can be used with mouse, touch, and keyboard.
8. All exercises provide instant feedback.
9. The app can be expanded later with additional chapters.

## 29.2 Pressure module acceptance criteria

The Pressure module is acceptable when:

1. It defines pressure correctly.
2. It shows and uses the formula `P = F / A`.
3. It uses correct units: N, m², Nm⁻², Pa.
4. It demonstrates the effect of force.
5. It demonstrates the effect of area.
6. It includes the school bag, soap-and-wire, and sponge/block examples.
7. The Pressure Playground calculates pressure correctly.
8. The dent/deformation responds to pressure.
9. Sort-the-scene cards classify correctly.
10. Calculation drill includes solve-for-P, solve-for-F, and solve-for-A problems.
11. The fixed cuboid problem gives correct values: 200 Pa, 275 Pa, and 400 Pa.

## 29.3 Circulatory module acceptance criteria

The Circulatory module is acceptable when:

1. It labels all required heart chambers, valves, and vessels.
2. It shows the correct blood flow sequence.
3. It distinguishes arteries, veins, and capillaries.
4. It explains plasma and corpuscles.
5. It explains erythrocytes, leukocytes, and platelets.
6. It includes ABO and Rh compatibility.
7. It defines agglutination correctly.
8. Label the Heart gives feedback and score.
9. Transfusion Lab checks both ABO and Rh compatibility.
10. Incompatible transfusion shows agglutination and explains the failed rule.

---

# 30. Development Phases

## Phase 1 — App Shell and Navigation

Build:

- Home dashboard
- Module cards
- Module navigation
- Progress indicator
- Local storage structure

## Phase 2 — Pressure Module

Build:

- Pressure lesson
- School bag interaction
- Soap-and-wire animation
- Sponge/block area animation
- Pressure Playground
- Sort-the-scene activity
- Calculation drill

## Phase 3 — Circulatory Module

Build:

- Circulatory lesson
- Heart diagram
- Blood flow animation
- Vessel comparison
- Blood components section
- Label the Heart
- Transfusion Lab

## Phase 4 — Polish and QA

Complete:

- Accessibility checks
- Scientific accuracy checks
- Tablet testing
- Offline testing
- Teacher review
- Student usability testing

---

# 31. Testing Checklist

## Functional testing

- Navigation works across all modules.
- Progress saves after reload.
- Sliders update pressure instantly.
- Drag-and-drop works on touch devices.
- Calculation answers are validated correctly.
- Heart labels lock in when correct.
- Transfusion compatibility works for all ABO/Rh combinations.

## Scientific testing

- All formulas are correct.
- All units are correct.
- Heart labels are correct.
- Blood flow direction is correct.
- ABO compatibility table is correct.
- Rh compatibility table is correct.
- Agglutination is used only in incompatible cases.

## Accessibility testing

- Keyboard navigation works.
- Focus states are visible.
- Screen reader labels are present.
- Color is not the only feedback method.
- Text contrast is readable.
- Touch targets are large enough.

## Performance testing

- Animations remain smooth.
- App loads quickly.
- App works after refresh.
- App works offline after first load if service worker is implemented.

---

# 32. Out of Scope for MVP

The following are not required for MVP:

1. User accounts.
2. Teacher dashboard.
3. Backend database.
4. Cloud synchronization.
5. AI tutor/chatbot.
6. Sinhala/Tamil language modes.
7. Voice narration.
8. LMS integration.
9. Admin content editor.
10. Analytics dashboard.

These can be considered in future versions.

---

# 33. Future Enhancements

Potential next-phase additions:

1. Sinhala and Tamil language modes.
2. Voice narration.
3. Teacher classroom mode.
4. Student accounts.
5. More Grade 9 Science chapters.
6. Quiz bank.
7. Printable worksheets.
8. Badge and reward system.
9. Analytics for teachers.
10. AI tutor for guided hints.
11. LMS integration.
12. Mobile app packaging.

---

# 34. Developer Prompt Summary

Use the following condensed prompt when giving this to a coding assistant:

```text
Build one unified Grade 9 Science learning web app, not two separate apps. The app must include two modules: Chapter 5 Pressure Exerted by Solids and Chapter 6 The Human Circulatory System. Each module must include one interactive lesson, two interactive exercises, recap, progress tracking, and instant feedback.

Use a joyful, modern, middle-school-friendly design with rounded cards, readable typography, visual diagrams, animations, simulations, and accessibility-friendly controls. The app should work on school laptops and tablets, and ideally work offline after first load.

Pressure module must teach pressure as perpendicular force on unit area, use P = F / A, units N, m², Nm⁻² and Pa, include school bag strap, soap-and-wire, sponge/block examples, Pressure Playground simulator, sorting activity, and calculation drill.

Circulatory module must teach heart chambers, main vessels, valves, blood flow, arteries/veins/capillaries, blood components, ABO groups, Rh factor, universal donor/recipient, and agglutination. Include Label the Heart and Transfusion Lab exercises.

Use localStorage for progress. Ensure all calculations and compatibility logic are scientifically accurate. Structure code so more chapters can be added later.
```
