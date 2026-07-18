// Content for Chapter 4 (Basic Concepts Associated with Force). Everything follows the
// Grade 9 textbook: the five effects of a force, measuring magnitude with a spring
// balance, force as a vector, and its graphical representation.

export type EffectId = "move" | "stop" | "speed" | "direction" | "shape";

export interface ForceEffect {
  id: EffectId;
  title: string;
  emoji: string;
  summary: string;
  example: string;
}

export const forceEffects: ForceEffect[] = [
  {
    id: "move",
    title: "Start something moving",
    emoji: "📦",
    summary: "A force can move an object that is at rest.",
    example: "Pushing a book makes it slide across the table."
  },
  {
    id: "stop",
    title: "Stop something moving",
    emoji: "🛑",
    summary: "A force can stop an object that is moving.",
    example: "Catching a ball applies a force that brings it to rest."
  },
  {
    id: "speed",
    title: "Change the speed",
    emoji: "⚡",
    summary: "A force can make a moving object go faster or slower.",
    example: "Kicking a rolling ball harder makes it speed up."
  },
  {
    id: "direction",
    title: "Change the direction",
    emoji: "↩️",
    summary: "A force can change the direction an object is moving in.",
    example: "Hitting a moving ball with a bat sends it a new way."
  },
  {
    id: "shape",
    title: "Change the shape",
    emoji: "🫳",
    summary: "A force can change the shape of an object.",
    example: "Treading on a ball on the ground squashes it."
  }
];

// Scenarios for Exercise 2's five-way sort. Each shows exactly one effect of a force.
export interface ForceScenario {
  id: string;
  label: string;
  emoji: string;
  effect: EffectId;
  reason: string;
}

export const forceScenarios: ForceScenario[] = [
  { id: "push-book", label: "Pushing a book across a table", emoji: "📖", effect: "move", reason: "A push starts the resting book moving." },
  { id: "kick-still-ball", label: "Kicking a still football", emoji: "⚽", effect: "move", reason: "The kick moves a ball that was at rest." },
  { id: "open-drawer", label: "Pulling open a drawer", emoji: "🗄️", effect: "move", reason: "A pull moves the drawer out from rest." },

  { id: "catch-ball", label: "Catching a cricket ball", emoji: "🧤", effect: "stop", reason: "Your hands apply a force that stops the moving ball." },
  { id: "brakes", label: "Braking a bicycle", emoji: "🚲", effect: "stop", reason: "The braking force brings the moving bicycle to rest." },
  { id: "goalkeeper", label: "A goalkeeper holding a shot", emoji: "🥅", effect: "stop", reason: "The keeper's force stops the ball's motion." },

  { id: "kick-harder", label: "Kicking a rolling ball harder", emoji: "💨", effect: "speed", reason: "The extra force makes the moving ball speed up." },
  { id: "pedal-faster", label: "Pedalling harder downhill", emoji: "🚴", effect: "speed", reason: "A bigger force changes how fast it is already moving." },
  { id: "wind-boat", label: "Wind filling a sail", emoji: "⛵", effect: "speed", reason: "The wind's force speeds the moving boat up." },

  { id: "bat-hit", label: "Hitting a moving ball with a bat", emoji: "🏏", effect: "direction", reason: "The bat's force sends the ball off in a new direction." },
  { id: "steer", label: "Turning a steering wheel", emoji: "🚗", effect: "direction", reason: "The force changes the direction the car moves in." },
  { id: "header", label: "Heading a football", emoji: "🧑", effect: "direction", reason: "The header changes the ball's direction of travel." },

  { id: "squash-ball", label: "Treading on a ball", emoji: "🦶", effect: "shape", reason: "The force squashes the ball, changing its shape." },
  { id: "squeeze-clay", label: "Squeezing modelling clay", emoji: "🧱", effect: "shape", reason: "Your grip's force changes the clay's shape." },
  { id: "stretch-band", label: "Stretching a rubber band", emoji: "➰", effect: "shape", reason: "The pulling force stretches it into a new shape." }
];

export const effectInfo: Record<EffectId, { title: string; hint: string; emoji: string }> = {
  move: { title: "Starts moving", hint: "at rest → moving", emoji: "📦" },
  stop: { title: "Stops moving", hint: "moving → at rest", emoji: "🛑" },
  speed: { title: "Changes speed", hint: "faster or slower", emoji: "⚡" },
  direction: { title: "Changes direction", hint: "new way of moving", emoji: "↩️" },
  shape: { title: "Changes shape", hint: "squashed or stretched", emoji: "🫳" }
};

// ---- Objects for the spring-balance sim (magnitude of force) ----
export interface Weighable {
  id: string;
  label: string;
  emoji: string;
  newtons: number; // reading on a Newton spring balance
}

export const weighables: Weighable[] = [
  { id: "apple", label: "An apple", emoji: "🍎", newtons: 1 },
  { id: "book", label: "A textbook", emoji: "📗", newtons: 4 },
  { id: "stone", label: "A stone", emoji: "🪨", newtons: 8 },
  { id: "bag", label: "A school bag", emoji: "🎒", newtons: 15 }
];

// ---- Everyday: making work easier (page 57) ----
export const easingExamples: { id: string; title: string; problem: string; fix: string; changes: "direction" | "point" }[] = [
  {
    id: "pull-cart",
    title: "Pulling a loaded cart",
    problem: "Pulling horizontally means bending down and straining to keep the force level.",
    fix: "Pull on a slightly upward slant instead — the cart still moves forward, but it's far easier on your back.",
    changes: "direction"
  },
  {
    id: "push-cart",
    title: "Pushing a loaded cart",
    problem: "Pushing low down means bending over and shoving with difficulty.",
    fix: "Fit a handle higher up and push there — changing the point of application makes the same job easier.",
    changes: "point"
  }
];

export const forceTerms: { term: string; meaning: string }[] = [
  { term: "Force", meaning: "A push or a pull." },
  { term: "Magnitude of force", meaning: "How big the force is — measured in newtons (N)." },
  { term: "Newton (N)", meaning: "The SI unit of force." },
  { term: "Weight", meaning: "The gravitational force the Earth pulls on an object with." },
  { term: "Spring balance", meaning: "An instrument that measures a force from how far its spring stretches." },
  { term: "Direction of force", meaning: "The way the push or pull acts." },
  { term: "Point of application", meaning: "The exact point of the object where the force acts." },
  { term: "Vector quantity", meaning: "A quantity that has BOTH a magnitude and a direction — like force." }
];
