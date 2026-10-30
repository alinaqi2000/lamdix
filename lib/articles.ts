import type { ImageKey } from "./images";
export type ArticleSection = {
  heading: string;
  paragraphs?: string[];
  checklist?: string[];
};

export type Article = {
  slug: string;
  cover: ImageKey;
  title: string;
  description: string;
  date: string;
  intro: string[];
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: "production-ai-agents-checklist",
    cover: "circuitMacro",
    title: "A checklist for taking AI agents from demo to production",
    description:
      "The gap between an impressive AI demo and a production agent is engineering: evaluation, tool scoping, handoff, and monitoring. A practical checklist.",
    date: "2026-10-29",
      intro: [
      "An impressive demo does not establish that an agent is ready for real users. Production introduces incomplete data, unexpected requests, and operational failures no script anticipated. The model was never the hard part — everything around it is.",
      "This checklist covers the engineering disciplines that separate a demo from a system you can trust in front of customers. None of it is exotic; all of it is skipped more often than it should be.",
    ],
    sections: [
      {
        heading: "Ground the agent in real inputs before choosing architecture",
        paragraphs: [
          "Build your evaluation set before you build the agent. Collect actual questions, conversations, or tasks — fifty honest examples beat five hundred hypothetical ones. This set becomes the thing you test every change against, and it will immediately show whether you need retrieval, tools, fine-tuning, or just a well-placed search box.",
          "Be suspicious of architecture chosen before this step. A RAG pipeline built on the wrong assumption about your data is still the wrong pipeline.",
        ],
      },
      {
        heading: "Scope tools like permissions, not features",
        paragraphs: [
          "Every tool you give an agent is a capability it can misuse — through error, adversarial input, or a bad interpretation of a reasonable request. Define tools narrowly: read order status, not query the database. Create a ticket, not write to the ticketing API.",
          "Write down, explicitly, what the agent may never do, and enforce it in code — not in the prompt. Prompts instruct; they do not restrict.",
        ],
      },
      {
        heading: "Design the failure path first",
        paragraphs: [
          "A production agent's quality is defined by what it does when it does not know. Decide upfront: when confidence is low, when a request is out of scope, or when a user is frustrated, what happens? The answer should be a designed path — a clarifying question, a human handoff with context, a graceful refusal — never an improvised guess.",
          "Human handoff deserves real design. Transferring a conversation without its context is barely better than making the customer start over.",
        ],
        checklist: [
          "Evaluation set built from real user inputs, run on every model, prompt, or pipeline change",
          "Tool access enumerated, least-privilege, enforced in code",
          "Explicit never-do list, tested with adversarial inputs",
          "Human handoff that carries conversation context",
          "Logging that lets you review any conversation end to end",
          "Quality sampling: a human reads a sample of conversations every week",
          "A kill switch and a rollback path you have actually tested",
        ],
      },
      {
        heading: "Plan for drift, not just launch",
        paragraphs: [
          "Your content changes, your products change, and model providers update their models. An agent accurate in January can quietly degrade by June. Schedule evaluation runs, review conversation samples on a cadence, and version your prompts and retrieval configuration like code — because they are.",
          "The tradeoff to accept: every layer of evaluation, guardrails, and review adds cost and latency. The discipline is putting those layers where the risk is, not everywhere. A FAQ agent and a financial-advice agent deserve different levels of scrutiny, and your design should reflect that honestly.",
        ],
      },
    ],
  },
  {
    slug: "voice-ai-human-handoff-consent",
    cover: "headsetDim",
    title: "Voice AI: getting human handoff and consent right",
    description:
      "Voice agents work when callers know what they're talking to, can reach a human, and the recording and outbound rules are designed in — not patched on.",
    date: "2026-10-29",
      intro: [
      "The difference between a voice agent callers tolerate and one they hang up on is rarely the speech model. It is whether the system was honest from the first second, and whether reaching a human was designed as a core path rather than an afterthought.",
      "Two disciplines make or break a voice deployment: handoff design and consent handling. Both are engineering problems with legal edges, and both deserve attention before the first call is placed.",
    ],
    sections: [
      {
        heading: "Disclose automation at the start, every time",
        paragraphs: [
          "A voice agent should identify itself as automated within its first sentence. This is partly a legal matter in many jurisdictions and mostly a trust matter: callers who discover mid-call that they have been talking to a machine feel deceived even if the conversation went well.",
          "Disclosure done well costs little: a plain statement — 'I'm Lamdix's automated assistant' — sets honest expectations from the first second. Designing an agent to pass as human is a liability we advise against entirely.",
        ],
      },
      {
        heading: "Treat 'speak to a person' as a first-class intent",
        paragraphs: [
          "Callers ask for a human in many ways: 'agent', 'person', 'this isn't working', silence, or three failed attempts at the same request. All of these should trigger the same designed path — not a loop back to the main menu.",
          "A good handoff carries context. The person receiving the call should see what the caller wanted, what was already collected, and what went wrong. A transfer that forces the caller to repeat everything converts a salvageable moment into a lost customer.",
          "Define what happens when no human is available: a callback offer, a captured message with a real follow-up process, or honest after-hours information. 'Please hold' into a void is the worst outcome — design the fallback explicitly.",
        ],
      },
      {
        heading: "Recording and transcription have rules",
        paragraphs: [
          "Call recording laws vary: some jurisdictions require all-party consent, others one-party. Recording announcements are cheap insurance and often legally necessary — build them in by default rather than checking afterwards.",
          "Decide retention deliberately. Transcripts and recordings contain personal data; keeping them forever 'just in case' is a liability, not an asset. Set retention periods, restrict access, and document who can listen and why.",
        ],
        checklist: [
          "Automated disclosure within the first sentence of every call",
          "Multiple escalation triggers: explicit requests, repeated failure, frustration signals",
          "Warm handoff that passes collected context to the human",
          "A designed fallback when no human is available",
          "Recording disclosure and a written retention policy",
          "Consent verification and opt-out handling for any outbound calling",
        ],
      },
      {
        heading: "Outbound is a different discipline",
        paragraphs: [
          "An inbound call does not by itself establish consent to recording, marketing, or every use of personal data. Define the purpose and obtain the notices or permissions required for each use. Outbound adds more: a lawful basis to dial, quiet hours, do-not-call registries, and automated-dialing consent rules that differ sharply by country and sometimes by state.",
          "We design outbound systems to check consent status and suppression lists before every dial, not as a batch cleanup. But be clear about the boundary: engineering can enforce the rules; determining which rules apply to your campaign is legal advice, and it is worth getting.",
        ],
      },
    ],
  },
  {
    slug: "custom-software-vs-saas",
    cover: "coderDesk",
    title: "Custom software vs. SaaS: an honest decision guide",
    description:
      "When to buy, when to build, and how to tell the difference — a decision framework based on where your process is the product.",
    date: "2026-10-29",
      intro: [
      "'Should we build this or buy it?' is usually asked too late — after the spreadsheet workaround has calcified into process, or after a custom build is halfway to recreating a commodity tool. The question deserves a framework, not a gut call.",
      "Here is the one we use. It is not complicated, and its honest application frequently recommends not building software — which is exactly why it works.",
    ],
    sections: [
      {
        heading: "The core question: is this process a differentiator?",
        paragraphs: [
          "If the way you handle this function is roughly how everyone handles it — payroll, email marketing, standard invoicing — buy. SaaS vendors have amortized the cost of getting the common case right across thousands of customers; you will not out-build that economics, and you should not try.",
          "If the process is how you win — your pricing logic, your matching algorithm, a customer experience competitors cannot copy with available tools — custom starts to make sense. The test: does the software encode something a competitor would have to discover independently? If yes, owning it has value beyond the license fees you save.",
        ],
      },
      {
        heading: "Count the real cost of each path",
        paragraphs: [
          "SaaS pricing understates its cost when the tool only covers part of the need. Add the integration work, the per-seat pricing as you grow, the manual bridge processes, and the cost of contorting your workflow to fit the tool's model. Sometimes that total still beats building — but count all of it.",
          "Custom software's hidden cost is permanence: you own every future change, dependency update, and security patch. A realistic comparison includes maintenance, not just build cost — typically a meaningful annual percentage of the initial build. If nobody will own the software after launch, that is an argument for SaaS.",
        ],
        checklist: [
          "Does this process differentiate you, or is it a solved common problem?",
          "What does the SaaS path really cost including workarounds and integration?",
          "What does the custom path really cost including maintenance and ownership?",
          "Will you still be served by this in three years of growth?",
          "Do you have someone — internal or retained — to own the software long-term?",
          "Is a hybrid viable: SaaS for the commodity core, custom for the differentiating layer?",
        ],
      },
      {
        heading: "The hybrid answer is often the right one",
        paragraphs: [
          "The cleanest outcomes are frequently neither extreme: a SaaS platform handles the commodity 80% — commerce engine, helpdesk, CRM — while custom code provides the connective layer that makes it yours. APIs exist precisely for this; a well-built integration layer can be the difference between five tools that coexist and one system.",
          "This is also the lowest-risk path. You can add custom increments where they demonstrably pay off, rather than betting a whole build on an untested hypothesis.",
        ],
      },
      {
        heading: "Signals you are choosing wrong",
        paragraphs: [
          "Building because 'we're unique' when the uniqueness lives in one spreadsheet formula is a common expensive error — replicate the formula in the SaaS tool's automation layer first. Buying an enterprise platform for a ten-person team's workflow is the opposite one: you inherit complexity priced for an organization ten times your size.",
          "If the honest analysis says buy, buy — then spend the engineering budget on the integration that makes the tools act like one system. If it says build, scope the smallest version that carries the differentiating value, and resist the urge to rebuild the commodity parts around it.",
        ],
      },
    ],
  },
  {
    slug: "connecting-support-to-crm",
    cover: "cableNetwork",
    title: "Connecting customer support to your CRM: a practical guide",
    description:
      "Support conversations hold valuable customer data — if it reaches the CRM. How to wire support and CRM so the data is structured, consented, and usable.",
    date: "2026-10-29",
      intro: [
      "Every support conversation contains information sales wants and product needs: what broke, what confused, what almost churned. Too often that data dies in a ticket queue — summarized by nobody and visible nowhere.",
      "Connecting support to the CRM sounds like an integration task. It is mostly a data-design task — deciding what is worth recording, in what structure, under whose rules — with a modest amount of plumbing on top.",
    ],
    sections: [
      {
        heading: "Decide what 'connected' means before touching APIs",
        paragraphs: [
          "A common failure mode is syncing everything: every ticket creates CRM noise until the record is useless. Define instead which events matter — a complaint about a specific feature, a renewal risk signal, a request that maps to a sales opportunity — and give each a defined destination field or object.",
          "The discipline question: who consumes this data? If sales never looks at the synced notes, the sync is decoration. Design backwards from a consumer with a real job to do.",
        ],
      },
      {
        heading: "Structure beats volume",
        paragraphs: [
          "Free-text notes attached to contacts are better than nothing, but they don't aggregate. Structured outcomes — reason codes, resolution categories, product-area tags — turn support volume into reporting. A chart of 'top contact drivers this quarter' requires that someone, or some AI layer, classified the contacts consistently.",
          "This is one place AI earns its keep reliably: classification and summarization of conversations into a fixed taxonomy, with human review on a sample. It is a bounded task with checkable output — unlike an agent with open-ended authority.",
        ],
        checklist: [
          "Named consumers for every class of synced data",
          "A short, enforced taxonomy for contact reasons and outcomes",
          "Direction of sync defined per field — who owns the truth",
          "Consent and retention rules applied to conversation data in the CRM",
          "A feedback route from support trends to the product roadmap",
        ],
      },
      {
        heading: "Mind the ownership and consent edges",
        paragraphs: [
          "Two systems holding customer data means two places it can go stale and two places a deletion request must reach. Define per field which system owns the truth, and make sure your data-subject-request process — access, correction, deletion — spans both.",
          "Support conversations also carry a different consent texture than marketing data: a customer describing a problem has not agreed to be profiled. Sensible access controls and a documented purpose for the shared data keep this honest.",
        ],
      },
      {
        heading: "Close the loop back to product",
        paragraphs: [
          "The highest-value output of this integration is not in the CRM at all — it is the aggregated signal that tells the product team what to fix. A monthly digest of top contact drivers, tied to revenue-weighted accounts, is more actionable than any real-time dashboard nobody opens.",
          "Start small: sync one event type well, review whether the consumer actually uses it, then expand. Integrations built incrementally get used; integrations built comprehensively get abandoned.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
