export type ProcessPhase = {
  id: string;
  n: string;
  icon: string;
  t: string;
  p: string;
  happen: { i: string; t: string; p: string }[];
  get: string[];
  involve: string;
  gate: string;
};

export const phases: ProcessPhase[] = [
  {
    id: "discover", n: "01", icon: "TargetUserSolid", t: "Discover",
    p: "We map the real problem before proposing anything — users, systems, constraints, data, and what success measurably looks like.",
    happen: [
      { i: "UserMultiple4Solid", t: "Stakeholder sessions", p: "Interviews with the people who own and use the system." },
      { i: "Share1Solid", t: "Systems audit", p: "Existing tools, integrations, data quality, and constraints." },
      { i: "BarChart4Solid", t: "Success criteria", p: "Measurable outcomes agreed before scope is set." },
    ],
    get: ["Written technical plan", "Scope & risk assessment", "Build-vs-buy recommendation", "Success criteria"],
    involve: "A few focused conversations and access to the systems and people who know the problem.",
    gate: "The plan is worth building — and you agree it is. If custom work isn't the answer, we say so here.",
  },
  {
    id: "design", n: "02", icon: "Layout9Solid", t: "Design",
    p: "Architecture, interfaces, and flows designed before implementation — reviewed with you, not presented after.",
    happen: [
      { i: "Share1Solid", t: "System architecture", p: "How the pieces connect: data model, services, integrations." },
      { i: "Layout9Solid", t: "Interface design", p: "Screens and flows designed for the people who'll use them." },
      { i: "Notebook1Solid", t: "Decision records", p: "Why each choice was made — documented, not tribal." },
    ],
    get: ["System architecture", "Interface design", "Data & integration model", "Decision records"],
    involve: "Reviewing designs and flows — your feedback lands before a line of production code.",
    gate: "You sign off on architecture and interfaces. Changes here are cheap; later they aren't.",
  },
  {
    id: "engineer", n: "03", icon: "Code1Solid", t: "Engineer",
    p: "Software built in visible increments — you review working builds, not status decks.",
    happen: [
      { i: "RefreshCircle1ClockwiseSolid", t: "Weekly increments", p: "Working software to try and review on a fixed rhythm." },
      { i: "Shield2CheckSolid", t: "Risk-path testing", p: "Automated tests weighted toward the paths that carry business risk." },
      { i: "Locked1Solid", t: "Your repositories", p: "Code lands in repos and infrastructure you own from day one." },
    ],
    get: ["Working builds to review", "Automated test coverage", "Your repos & infrastructure", "Honest progress reporting"],
    involve: "A weekly review where you see real progress and decide what happens next.",
    gate: "The increment does what was promised, tested, and you're satisfied with the direction.",
  },
  {
    id: "evolve", n: "04", icon: "RefreshCircle1ClockwiseSolid", t: "Evolve",
    p: "Deployment, monitoring, and the steady iteration that keeps software healthy after launch.",
    happen: [
      { i: "Cloud2Solid", t: "Deployment", p: "Pipelines, environments, rollback paths — releases that are boring." },
      { i: "BarChart4Solid", t: "Observability", p: "Monitoring, logging, and evaluation sampling for AI features." },
      { i: "Books2Solid", t: "Handover", p: "Runbooks and documentation so the system outlives the engagement." },
    ],
    get: ["Deployment pipelines", "Runbooks & handover docs", "Monitoring setup", "Optional maintenance rhythm"],
    involve: "Deciding what launches and when — we handle the plumbing.",
    gate: "The system is live, monitored, documented, and your team can operate it.",
  },
]

export const together = [
  { i: "AgendaSolid", t: "Weekly demos", p: "Real builds reviewed on a fixed cadence." },
  { i: "Notebook1Solid", t: "Written updates", p: "Async progress and decisions in writing." },
  { i: "Books2Solid", t: "Shared backlog", p: "One prioritized list we both maintain." },
  { i: "User4Solid", t: "Direct access", p: "You talk to the engineers, not a relay." },
  { i: "Locked1Solid", t: "Your accounts", p: "Repos, cloud, and tooling under your ownership." },
  { i: "FileMultipleSolid", t: "Documented decisions", p: "The reasoning survives the project." },
];

export const quality = [
  "Automated tests on risk paths",
  "Code review before merge",
  "Security baseline & dependency hygiene",
  "Evaluation sets for AI features",
  "Observability & alerting",
];

export const processFaq = [
  { q: "How long does an engagement take?", a: "It depends entirely on scope — we price and plan defined work, not vague retainers. Discovery produces a concrete plan with honest estimates." },
  { q: "Can you start mid-project?", a: "Yes — taking over an existing build starts with an honest assessment of what's there before we commit to a direction." },
  { q: "Who owns the work?", a: "You do — repositories, infrastructure, and documentation are yours throughout, not handed over at the end." },
  { q: "What if we need changes later?", a: "We offer a maintenance and partnership rhythm, or a clean handover — either way the documentation means you're never locked in." },
];
