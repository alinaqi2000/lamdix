import type { ImageKey } from "./images";

export type ServiceExtras = {
  icon: string;
  image: ImageKey;
  features: { icon: string; title: string; body: string }[];
  process: { title: string; body: string }[];
  chips: string[];
  faq: { q: string; a: string }[];
};

export const serviceExtras: Record<string, ServiceExtras> = {
  "custom-software-development": {
    icon: "Code1Solid",
    image: "coderDesk",
    features: [
      { icon: "Layout9Solid", title: "Web & mobile applications", body: "Customer-facing products, internal tools, and portals — built for the people who actually use them." },
      { icon: "Cart1Solid", title: "SaaS & ecommerce", body: "Subscription platforms, storefronts, and checkout flows designed around your business model." },
      { icon: "Share1Solid", title: "APIs & integrations", body: "Clean interfaces between your systems and the third parties you depend on." },
      { icon: "Database2Solid", title: "Enterprise systems", body: "Systems of record, workflow engines, and reporting built for auditability." },
      { icon: "RefreshCircle1ClockwiseSolid", title: "Legacy modernization", body: "Incrementally replacing systems that still earn their keep — without stopping the business." },
      { icon: "Shield2Solid", title: "Ownership by default", body: "Documented, tested code in repositories and infrastructure you control." },
    ],
    process: [
      { title: "Assess", body: "We review the problem, existing systems, and whether custom is even the right call." },
      { title: "Architect", body: "Data model, integrations, and a written plan reviewed with you before code." },
      { title: "Build", body: "Visible increments with automated tests on the paths that carry business risk." },
      { title: "Operate", body: "Deployment pipelines, documentation, and an optional maintenance rhythm." },
    ],
    chips: ["Web applications", "Mobile", "APIs & integrations", "Databases", "Legacy systems", "Ecommerce", "Internal tools", "SaaS platforms"],
    faq: [
      { q: "How do you decide between custom and off-the-shelf?", a: "Honestly, and early. If a SaaS tool covers the need, we say so — custom earns its cost only where your process is the differentiator. Discovery produces a written build-vs-buy call." },
      { q: "Can you take over our existing codebase?", a: "Yes — after an honest assessment of what is there. Sometimes that means modernizing incrementally; sometimes it means we recommend against rebuilding at all." },
      { q: "Who owns the code?", a: "You do. Repositories, infrastructure, and documentation are handed over as we build — no lock-in by design." },
    ],
  },
  "ai-agents-and-chatbots": {
    icon: "Gears3Solid",
    image: "circuitMacro",
    features: [
      { icon: "Books2Solid", title: "Knowledge assistants", body: "Answers grounded in your documentation through retrieval — not a model improvising." },
      { icon: "ChatBubble2Solid", title: "Customer-facing chatbots", body: "First-line support that resolves the repetitive and hands the rest to people." },
      { icon: "Gear1Solid", title: "Tool-using agents", body: "Agents that act in your systems — create tickets, check status, update records — with scoped permissions." },
      { icon: "Shield2CheckSolid", title: "Guardrails", body: "Explicit limits enforced in code: what the agent may read, write, and never touch." },
      { icon: "BarChart4Solid", title: "Evaluation", body: "Test sets built from real questions, run on every meaningful change." },
      { icon: "User4Solid", title: "Human handoff", body: "Escalation designed in from the start, carrying context — not bolted on later." },
    ],
    process: [
      { title: "Ground", body: "We collect real questions and build the evaluation set before choosing architecture." },
      { title: "Build", body: "Retrieval pipeline, tool definitions, and the agent itself in working increments." },
      { title: "Evaluate", body: "Accuracy and failure modes measured on your data before anything ships." },
      { title: "Monitor", body: "Logging, quality sampling, and drift checks on a defined cadence." },
    ],
    chips: ["Retrieval (RAG)", "Tool agents", "Guardrails", "Evaluation sets", "Conversation logging", "Human handoff", "Helpdesk integration", "Knowledge ingestion"],
    faq: [
      { q: "How accurate will the agent be?", a: "We don't quote numbers before evaluating on your data — anyone who does is guessing. We build an evaluation set from real questions and measure before launch." },
      { q: "Can the agent take actions in our systems?", a: "Yes, through narrowly scoped tools — create a ticket, check an order — with permissions enforced in code, never open-ended API access." },
      { q: "What happens when it doesn't know?", a: "A designed path: clarifying question, graceful refusal, or human handoff with context intact. Improvised guessing is the failure mode we engineer against." },
    ],
  },
  "voice-ai-and-calling-agents": {
    icon: "Telephone1Solid",
    image: "headsetDim",
    features: [
      { icon: "Telephone1Solid", title: "Inbound answering", body: "Every call answered instantly — after hours, at peak load, without hold queues." },
      { icon: "MapPin5Solid", title: "Routing & intent", body: "Callers reach the right place through intent handling, not phone trees." },
      { icon: "AgendaSolid", title: "Appointment handling", body: "Booking, rescheduling, and reminders straight into your calendar or CRM." },
      { icon: "Microphone1Solid", title: "Disclosed automation", body: "Agents identify themselves as automated in the first sentence — always." },
      { icon: "User4Solid", title: "Human fallback", body: "Transfer rules with context passed along, plus designed after-hours behavior." },
      { icon: "FileMultipleSolid", title: "Recording & transcripts", body: "Recording with appropriate disclosure and deliberate retention settings." },
    ],
    process: [
      { title: "Scope", body: "We define which call types the agent owns — it transfers rather than improvises outside them." },
      { title: "Design", body: "Call flows, disclosure, fallback, and recording rules reviewed before a single dial." },
      { title: "Test", body: "Accents, interruptions, silence, and edge cases exercised before go-live." },
      { title: "Run", body: "Monitored conversations with review sampling and escalation tuning." },
    ],
    chips: ["Inbound answering", "Intent routing", "Appointment booking", "CRM write-back", "Call recording", "Transcription", "Warm transfer", "Telephony integration"],
    faq: [
      { q: "Will callers know they're talking to an AI?", a: "Yes — the agent discloses itself within the first sentence, every call. We don't build systems meant to pass as human." },
      { q: "What if the caller needs a person?", a: "Asking for a human is a first-class path: warm transfer with full context, or a designed callback flow when nobody is available." },
      { q: "Is call recording legal?", a: "Recording rules differ by jurisdiction — some require all-party consent. We build disclosure in by default and flag obligations; the legal review is yours." },
    ],
  },
  "calling-campaigns": {
    icon: "Telephone3Solid",
    image: "cableNetwork",
    features: [
      { icon: "TargetUserSolid", title: "Lead qualification", body: "First-touch qualification that scores and routes, so sales time goes to real prospects." },
      { icon: "AgendaSolid", title: "Appointment setting", body: "Qualified meetings booked against a rubric — quality measured, not just count." },
      { icon: "ChatBubble2Solid", title: "Customer outreach", body: "Renewals, reactivation, and follow-up programs for existing customers." },
      { icon: "Database2Solid", title: "CRM integration", body: "Outcomes, dispositions, and notes written back in a structure your team uses." },
      { icon: "Shield2CheckSolid", title: "Consent & opt-outs", body: "Suppression lists and consent status checked before every dial — not batch cleanup." },
      { icon: "BarChart4Solid", title: "Iterated scripts", body: "Call flows improved from recorded-call review, not guessed at launch." },
    ],
    process: [
      { title: "Define", body: "List criteria, consent verification, call flow, and the qualification rubric." },
      { title: "Script", body: "Call flows written, tested, and iterated against real conversations." },
      { title: "Run", body: "AI agents, human callers, or hybrid — matched to the segment." },
      { title: "Report", body: "Outcomes and dispositions in your CRM, with honest quality metrics." },
    ],
    chips: ["Lead qualification", "Appointment setting", "Customer outreach", "CRM write-back", "Opt-out handling", "Suppression lists", "Script iteration", "Call recording"],
    faq: [
      { q: "Is this telemarketing or robocalling?", a: "No. We run structured programs with consent verification and working opt-outs. If the goal is maximum dials at minimum quality, we're the wrong fit." },
      { q: "Who provides the contact list?", a: "You do, with a lawful basis to dial those numbers. We don't source or scrape contact lists." },
      { q: "AI callers or human callers?", a: "Both are options — matched to the segment and the conversation's sensitivity. Either way, scripts, disclosure, and opt-outs work the same." },
    ],
  },
  "customer-support": {
    icon: "Headphone1Solid",
    image: "headsetLaptop",
    features: [
      { icon: "ChatBubble2Solid", title: "Multichannel coverage", body: "Chat, email, phone, and social routed into one queue with clear ownership." },
      { icon: "Gears3Solid", title: "AI first line", body: "Repetitive questions resolved instantly, sensitive ones routed to people." },
      { icon: "Books2Solid", title: "Knowledge base", body: "Documentation structure and a maintenance process that keeps it honest." },
      { icon: "StarFatSolid", title: "Quality assurance", body: "Conversation sampling, a scoring rubric, and a coaching loop." },
      { icon: "ArrowUpwardSolid", title: "Escalation design", body: "Clear paths for urgent and sensitive issues — nothing disappears into a queue." },
      { icon: "BarChart4Solid", title: "Insight loop", body: "Recurring drivers reported so product and sales see what support sees." },
    ],
    process: [
      { title: "Audit", body: "We map current volume, channels, and where conversations leak." },
      { title: "Set up", body: "Helpdesk, routing, SLAs, and knowledge structure." },
      { title: "Automate", body: "AI first-line where it genuinely resolves, human paths where it matters." },
      { title: "Review", body: "QA sampling and reporting on a defined cadence." },
    ],
    chips: ["Helpdesk setup", "Multichannel", "AI deflection", "Knowledge base", "QA sampling", "Escalation rules", "CRM sync", "Support reporting"],
    faq: [
      { q: "Do you staff the support team?", a: "Depending on the engagement — we can operate coverage, build the system for your team, or both. The model is defined together upfront." },
      { q: "How much volume can AI actually handle?", a: "That depends on your question mix — we measure resolution quality, not just deflection counts, and tell you honestly where AI helps." },
      { q: "Can you work with our existing helpdesk?", a: "Usually yes — we integrate where the tooling is sound and only recommend changes when the platform is genuinely the problem." },
    ],
  },
  "cloud-and-product-engineering": {
    icon: "Cloud2Solid",
    image: "dataCenter",
    features: [
      { icon: "Cloud2Solid", title: "Cloud infrastructure", body: "Environments, access control, and cost sanity on mainstream cloud providers." },
      { icon: "RefreshCircle1ClockwiseSolid", title: "CI/CD pipelines", body: "Automated build, test, and staged deployment — releases that are boring." },
      { icon: "Locked1Solid", title: "Security baseline", body: "Dependency and secret management, reviewed surfaces, update cadence." },
      { icon: "Shield2CheckSolid", title: "Testing strategy", body: "Coverage weighted toward business risk plus pre-release checks." },
      { icon: "Share1Solid", title: "Integrations", body: "Payment, CRM, and third-party APIs that don't silently rot." },
      { icon: "Gear1Solid", title: "Maintenance", body: "A defined upkeep rhythm for products already in the world." },
    ],
    process: [
      { title: "Review", body: "We audit the pipeline, environments, and where the fragility lives." },
      { title: "Stabilize", body: "CI/CD, monitoring, and rollback paths first — the unglamorous essentials." },
      { title: "Harden", body: "Security baseline and test coverage on what carries risk." },
      { title: "Maintain", body: "Ongoing engineering rhythm with written response expectations." },
    ],
    chips: ["CI/CD", "Cloud infrastructure", "Security baseline", "Automated testing", "Monitoring", "Integrations", "UX refinement", "Maintenance"],
    faq: [
      { q: "Which cloud providers do you work with?", a: "We recommend on fit and cost, not vendor allegiance — and we don't build architectures that exist to pad a resume." },
      { q: "Can you take over maintenance of our product?", a: "Yes — maintenance agreements define response expectations in writing, including what's urgent and what isn't." },
      { q: "Do you do security audits?", a: "We deliver a security baseline and a process — dependency hygiene, access review, update cadence. We don't claim to make systems unbreachable." },
    ],
  },
};
