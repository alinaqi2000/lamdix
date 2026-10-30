export type Service = {
  slug: string;
  title: string;
  short: string;
  intro: string[];
  whenUseful: string[];
  deliverables: string[];
  scope: string[];
  related: { slug: string; label: string }[];
  relatedArticles: string[];
};

export const services: Service[] = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    short:
      "Web applications, mobile apps, SaaS products, ecommerce, APIs, and enterprise systems — designed, built, and maintained end to end.",
    intro: [
      "Off-the-shelf tools cover common cases well, but they bend your process to fit their model. When the way you work is the advantage — a pricing logic nobody else has, a workflow that spans five systems, a product idea with no template — custom software is how you keep it.",
      "We build software that is meant to be owned: documented, tested, and structured so the next engineer (yours or ours) can pick it up without archaeology. We work across web and mobile front ends, SaaS products, ecommerce builds, internal tools, APIs and integrations, enterprise systems, and the modernization of legacy code that still earns its keep.",
    ],
    whenUseful: [
      "Your team exports data to spreadsheets to bridge gaps between systems that should talk to each other.",
      "You are paying for several SaaS tools that each do 60% of what you need, and none of it together.",
      "You have a product idea whose value depends on the software, not on the service around it.",
      "A legacy system runs the business but cannot be extended, integrated, or safely changed.",
    ],
    deliverables: [
      "Discovery notes and a written technical plan: architecture, data model, integrations, and risks.",
      "Working software delivered in visible increments — you review real builds, not status decks.",
      "Automated test coverage on the paths that carry business risk.",
      "Deployment pipeline and environments you control, with infrastructure documented as code where it makes sense.",
      "Handover documentation: architecture decisions, runbooks, and dependency inventory.",
    ],
    scope: [
      "We scope in increments rather than promising a fixed everything up front; the plan is explicit about what is known and what is estimated.",
      "We do not take over systems we have not reviewed; modernization starts with an honest assessment, which sometimes recommends against rebuilding.",
      "We build on mainstream, well-supported stacks. Exotic technology is a liability you inherit — we only choose it when it is clearly justified.",
      "We are candid when a SaaS tool or a simpler approach will do the job cheaper than custom work.",
    ],
    related: [
      { slug: "cloud-and-product-engineering", label: "Cloud & Product Engineering" },
      { slug: "ai-agents-and-chatbots", label: "AI Agents & Chatbots" },
    ],
    relatedArticles: ["custom-software-vs-saas"],
  },
  {
    slug: "ai-agents-and-chatbots",
    title: "AI Agents & Chatbots",
    short:
      "Knowledge assistants, retrieval-grounded chatbots, and tool-using agents — evaluated, monitored, and handed to humans when it matters.",
    intro: [
      "A demo agent is easy. A production agent that answers from your actual documents, uses your tools safely, fails gracefully, and knows when to bring in a person is an engineering project — that is the part we do.",
      "We build chatbots and agents grounded in your knowledge through retrieval (RAG), connected to real systems through well-defined tools, and wrapped in the unglamorous infrastructure that makes them trustworthy: evaluation sets, guardrails, logging, and human handoff paths.",
    ],
    whenUseful: [
      "Customers or staff ask the same questions repeatedly and the answers already exist in your documentation.",
      "A workflow requires reading, classifying, drafting, or routing text at a volume people cannot sustain.",
      "You want an agent to take actions in your systems — create tickets, check order status, update records — with defined limits.",
      "A previous AI experiment worked in the demo and fell apart on real data.",
    ],
    deliverables: [
      "A working agent or chatbot integrated into your site, helpdesk, or internal tools.",
      "Retrieval pipeline over your content: ingestion, chunking, indexing, and update flow.",
      "Tool definitions with explicit permissions — what the agent may read, write, and never touch.",
      "An evaluation set built from real questions, run on every meaningful change.",
      "Monitoring and review tooling: conversation logs, escalation paths, and quality sampling.",
    ],
    scope: [
      "We do not promise accuracy numbers before evaluating on your data; anyone who does is guessing.",
      "Agents get narrow, auditable tool access — not your whole API surface.",
      "Human handoff is designed in from the start, not bolted on after the first bad conversation.",
      "We will tell you when a conventional form, search, or workflow solves the problem better than an agent.",
    ],
    related: [
      { slug: "customer-support", label: "Customer Support" },
      { slug: "voice-ai-and-calling-agents", label: "Voice AI & Calling Agents" },
    ],
    relatedArticles: ["production-ai-agents-checklist", "connecting-support-to-crm"],
  },
  {
    slug: "voice-ai-and-calling-agents",
    title: "Voice AI & Calling Agents",
    short:
      "Inbound call answering, routing, and appointment handling with voice AI — disclosed, recorded responsibly, and always escapable to a human.",
    intro: [
      "Phones are still where urgent customers go, and where businesses lose them after hours or at peak load. Voice AI can answer instantly, route correctly, book appointments, and capture details — but only if it is honest about what it is and careful about when it steps aside.",
      "We build inbound voice agents that identify themselves as automated, handle a defined scope well, and transfer to a person with context intact when the call exceeds that scope. Outbound voice work follows the same discipline plus consent requirements that vary by jurisdiction — we design for compliance, not around it.",
    ],
    whenUseful: [
      "Calls go unanswered outside business hours or during volume spikes.",
      "Reception staff spend their day on repetitive routing and scheduling calls.",
      "You need consistent capture of caller details straight into your CRM or ticketing system.",
      "Outbound appointment reminders or follow-ups consume staff time better spent elsewhere.",
    ],
    deliverables: [
      "Inbound voice agent: greeting with disclosure, intent handling, routing, and appointment booking.",
      "Human fallback design: transfer rules, warm handoff with context, and after-hours behavior.",
      "Call recording and transcription with appropriate disclosure and retention settings.",
      "Integration with your calendar, CRM, or telephony provider.",
      "Test scenarios covering accents, interruptions, silence, and edge cases before go-live.",
    ],
    scope: [
      "Voice agents announce themselves as automated; we do not build systems meant to pass as human.",
      "Recording and outbound calls carry legal requirements that differ by region — we flag obligations, but legal review is yours.",
      "We scope the agent to defined call types. It transfers rather than improvises outside them.",
      "Telephony carriers and regions vary; we confirm coverage for your numbers before committing to a design.",
    ],
    related: [
      { slug: "calling-campaigns", label: "Calling Campaigns" },
      { slug: "ai-agents-and-chatbots", label: "AI Agents & Chatbots" },
    ],
    relatedArticles: ["voice-ai-human-handoff-consent"],
  },
  {
    slug: "calling-campaigns",
    title: "Calling Campaigns",
    short:
      "Structured outreach programs — lead qualification, appointment setting, and customer follow-up — with consent, opt-outs, and clean CRM data.",
    intro: [
      "Outbound calling works when it is a program, not a blast: the right list, a script tested against real conversations, agents (human or AI) who qualify rather than pressure, and data that lands cleanly in your CRM.",
      "We design and run calling campaigns for lead qualification, appointment setting, and customer outreach. Every program is built around consent status, working opt-out handling, and the calling regulations of the regions you dial. We are not in the robocall business — if the goal is maximum dials at minimum quality, we are the wrong fit.",
    ],
    whenUseful: [
      "Inbound leads sit untouched or get one call and a shrug.",
      "Your sales team spends selling time on first-touch qualification.",
      "Existing customers need proactive outreach — renewals, scheduling, reactivation.",
      "Past campaigns produced appointments but no usable data about why others said no.",
    ],
    deliverables: [
      "Campaign design: list criteria, consent verification, call flow, and qualification rubric.",
      "Script development and iteration based on recorded-call review.",
      "Calling execution — AI agents, human callers, or a hybrid, matched to the segment.",
      "CRM integration: outcomes, notes, and dispositions written back in a usable structure.",
      "Opt-out and suppression list management that actually works across systems.",
    ],
    scope: [
      "Calling regulations (TCPA, GDPR-adjacent rules, local equivalents) differ by country and state; we design within them, but you own legal compliance and list provenance.",
      "We require a lawful basis for the numbers we dial — we do not source or scrape contact lists.",
      "Appointment quality beats appointment count; we report both, honestly.",
      "We do not run pressure-sales scripts or campaigns designed to outlast opt-outs.",
    ],
    related: [
      { slug: "voice-ai-and-calling-agents", label: "Voice AI & Calling Agents" },
      { slug: "customer-support", label: "Customer Support" },
    ],
    relatedArticles: ["voice-ai-human-handoff-consent"],
  },
  {
    slug: "customer-support",
    title: "Customer Support",
    short:
      "Support operations that combine people and AI — helpdesk setup, multichannel coverage, escalation design, and quality review.",
    intro: [
      "Good support is a system: the right channel mix, clear escalation paths, a knowledge base that stays current, AI where it helps and humans where it matters, and feedback loops that push recurring issues back to the product team.",
      "We design and operate that system. Depending on the engagement, that means setting up your helpdesk and processes, building the AI layer for first-line questions, staffing coverage, or all three — connected to your CRM so every conversation improves the record rather than disappearing into an inbox.",
    ],
    whenUseful: [
      "Support lives in a shared inbox and nothing is measured, routed, or reusable.",
      "Ticket volume is growing faster than headcount, and quality is slipping on both ends.",
      "You want AI to deflect repetitive questions but keep humans for anything sensitive.",
      "Support insights never reach product or sales because the data is unstructured.",
    ],
    deliverables: [
      "Helpdesk selection and setup: channels, routing, SLAs, macros, and escalation rules.",
      "Knowledge base structure and a maintenance process that keeps it honest.",
      "AI first-line handling where appropriate, with clean human handoff.",
      "Quality assurance: conversation sampling, scoring rubric, and coaching loop.",
      "Reporting on volume, resolution, and recurring drivers — readable by non-support leads.",
    ],
    scope: [
      "Coverage model (hours, channels, human/AI split) is designed with you; we do not claim fixed team sizes or language coverage we have not agreed.",
      "AI deflection is measured on resolution quality, not just tickets avoided.",
      "We integrate with your existing stack where it is sound; we recommend changes only where the tooling is genuinely the problem.",
    ],
    related: [
      { slug: "ai-agents-and-chatbots", label: "AI Agents & Chatbots" },
      { slug: "custom-software-development", label: "Custom Software Development" },
    ],
    relatedArticles: ["connecting-support-to-crm"],
  },
  {
    slug: "cloud-and-product-engineering",
    title: "Cloud & Product Engineering",
    short:
      "The engineering layer around the product — DevOps, cloud infrastructure, security, testing, UX, integrations, and ongoing maintenance.",
    intro: [
      "Shipping the feature is half the work. The other half is everything around it: environments that behave, deployments that are boring, security that is reviewed rather than assumed, tests that catch what matters, and integrations that do not silently rot.",
      "We take on that layer — for products we build and for products that already exist. Engagements range from fixing a fragile pipeline to owning the ongoing engineering of a product: maintenance, integrations, UX refinement, and the steady work that keeps software healthy after launch.",
    ],
    whenUseful: [
      "Deployments are manual, scary, or depend on one person's laptop.",
      "You have a product but no reliable test coverage, monitoring, or rollback path.",
      "Integrations with payment, CRM, or third-party APIs break quietly.",
      "The product works but the interface has accumulated years of inconsistency.",
    ],
    deliverables: [
      "CI/CD pipeline with automated build, test, and staged deployment.",
      "Cloud infrastructure setup or cleanup: environments, access control, and cost sanity.",
      "Security baseline: dependency and secret management, review of exposed surfaces, and update cadence.",
      "Testing strategy: automated coverage weighted toward business risk, plus pre-release checks.",
      "UX and interface refinement in working increments, and a maintenance rhythm you can rely on.",
    ],
    scope: [
      "We recommend cloud services on fit and cost, not vendor allegiance; no architecture is resume-driven.",
      "Security work is a baseline and a process — we do not claim to make systems unbreachable.",
      "Maintenance agreements define response expectations in writing; urgent response terms are explicit, not implied.",
    ],
    related: [
      { slug: "custom-software-development", label: "Custom Software Development" },
      { slug: "ai-agents-and-chatbots", label: "AI Agents & Chatbots" },
    ],
    relatedArticles: ["custom-software-vs-saas"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
