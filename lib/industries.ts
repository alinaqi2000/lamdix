import type { ImageKey } from "./images";

export type Industry = {
  slug: string;
  title: string;
  short: string;
  image: ImageKey;
  intro: string[];
  challenges: { icon: string; title: string; body: string }[];
  build: { title: string; body: string; service: string }[];
  considerations: string[];
};

export const industries: Industry[] = [
  {
    slug: "ecommerce-retail",
    title: "Ecommerce & Retail",
    short: "Storefronts, order operations, and support that scale with demand spikes.",
    image: "storeNight",
    intro: [
      "Retail runs on thin margins and spiky demand — the stack has to hold through launches and seasons without a matching ops headcount.",
      "We build the storefront and integrations, then the support and outreach layer that keeps customers answered when volume lands.",
    ],
    challenges: [
      { icon: "Cart1Solid", title: "Conversion friction", body: "Checkout, search, and merchandising flows where every dropped step is measurable revenue." },
      { icon: "ChatBubble2Solid", title: "Seasonal support spikes", body: "Ticket volume doubles around launches and holidays while the team stays the same size." },
      { icon: "Share1Solid", title: "Disconnected systems", body: "Shop, warehouse, CRM, and helpdesk each holding a partial picture of the customer." },
    ],
    build: [
      { title: "Storefront & order systems", body: "Custom storefronts, checkout flows, and integrations between shop, stock, and CRM.", service: "custom-software-development" },
      { title: "Order-status agents", body: "AI assistants that answer 'where is my order' from live data, with human handoff for exceptions.", service: "ai-agents-and-chatbots" },
      { title: "Support operations", body: "Multichannel support tuned for seasonal peaks and product questions.", service: "customer-support" },
    ],
    considerations: [
      "Payment and customer data fall under PCI and privacy rules — we design for least data held, not most.",
      "Peak-load behavior should be load-tested before the season, not discovered during it.",
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    short: "Patient-facing scheduling and communication built with privacy designed in.",
    image: "hospitalHall",
    intro: [
      "Healthcare software earns trust slowly and loses it in one bad flow. The bar is not just uptime — it is consent, privacy, and knowing exactly when a human must take over.",
      "We build patient-facing booking, reminder, and communication systems with that discipline from the start.",
    ],
    challenges: [
      { icon: "Shield2Solid", title: "Sensitive data by default", body: "Nearly every field can be health-adjacent; minimization and access control are design inputs, not afterthoughts." },
      { icon: "Telephone1Solid", title: "Phones still dominate", body: "Appointments, reminders, and follow-ups run on calls — where coverage and tone both matter." },
      { icon: "User4Solid", title: "Escalation without failure", body: "A confused or distressed caller must reach a person fast — handoff paths are clinical-safety relevant." },
    ],
    build: [
      { title: "Scheduling & reminders", body: "Voice and messaging agents that book, confirm, and remind with disclosed automation and clean opt-outs.", service: "voice-ai-and-calling-agents" },
      { title: "Patient portals & tools", body: "Accessible booking and intake software integrated with existing systems.", service: "custom-software-development" },
      { title: "Front-desk augmentation", body: "AI first-line for routine questions, humans for anything sensitive.", service: "customer-support" },
    ],
    considerations: [
      "Health-data rules vary by jurisdiction (HIPAA, GDPR, local equivalents). We design for privacy and disclosure; legal review of your obligations stays with you.",
      "Voice agents in healthcare contexts should always disclose automation and offer a human path — we will not build otherwise.",
    ],
  },
  {
    slug: "fintech",
    title: "Fintech",
    short: "Secure product engineering and support for trust-critical financial products.",
    image: "skyscraperNight",
    intro: [
      "In financial products, a wrong answer or a leaked field is not a UX bug — it is a trust event. Engineering has to be conservative where it counts and fast where it can.",
      "We build secure product surfaces, integrations, and support operations that treat auditability as a feature.",
    ],
    challenges: [
      { icon: "Locked1Solid", title: "Security & auditability", body: "Access control, logging, and least-privilege tooling need to be provable, not assumed." },
      { icon: "Calculator1Solid", title: "Accuracy-critical answers", body: "An AI agent that improvises a financial figure is worse than no agent; evaluation sets the bar." },
      { icon: "Locked2Solid", title: "Fraud & abuse surface", body: "Voice and chat channels are attack surfaces — verification and rate limits are part of the design." },
    ],
    build: [
      { title: "Secure application builds", body: "Account portals, onboarding flows, and API integrations with testable security posture.", service: "custom-software-development" },
      { title: "Bounded support agents", body: "AI that answers within a verified scope and hands anything financial to a person.", service: "ai-agents-and-chatbots" },
      { title: "Hardened infrastructure", body: "Pipelines, environments, and monitoring that stand up to review.", service: "cloud-and-product-engineering" },
    ],
    considerations: [
      "Regulatory scope (KYC, PSD2, local rules) defines what automation may touch — we flag boundaries, your compliance team decides them.",
      "We do not build agents that make or imply financial decisions without human review.",
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    short: "Tracking, dispatch, and exception handling for operations that never stop.",
    image: "portCranes",
    intro: [
      "Logistics software is judged at 3 AM during a disruption, not in the demo. Tracking, dispatch, and exception workflows have to stay legible under pressure.",
      "We build the operational systems and the communication layer that keeps shippers, carriers, and customers aligned.",
    ],
    challenges: [
      { icon: "MapPin5Solid", title: "Fragmented data", body: "Status lives across carriers, telematics, and spreadsheets — one view is the whole product." },
      { icon: "Alarm1Solid", title: "Exception handling", body: "Delays and missed windows generate calls; most are answerable automatically if the data is connected." },
      { icon: "Code1Solid", title: "Legacy under load", body: "Core systems are old, load-bearing, and cannot be swapped mid-operation." },
    ],
    build: [
      { title: "Tracking & dispatch tooling", body: "Unified status views, exception queues, and integrations across carrier systems.", service: "custom-software-development" },
      { title: "Status calls & notifications", body: "Voice and message agents that answer ETAs and capture proof-of-delivery details.", service: "voice-ai-and-calling-agents" },
      { title: "Legacy modernization", body: "Incrementally replacing fragile systems without stopping the operation.", service: "cloud-and-product-engineering" },
    ],
    considerations: [
      "Carrier API quality varies wildly — integration scope depends on what partners actually expose.",
      "Automated outbound calls to drivers and customers need the same consent discipline as any outbound program.",
    ],
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    short: "Listing platforms, lead qualification, and viewing coordination that responds instantly.",
    image: "houseNight",
    intro: [
      "Property leads decay in minutes, and half of them arrive after hours. The businesses that respond first win the viewing — that is a software problem.",
      "We build listing and CRM tooling plus the response layer that captures and qualifies inquiries around the clock.",
    ],
    challenges: [
      { icon: "Alarm1Solid", title: "Lead decay", body: "Inquiries answered hours late convert at a fraction of instant responses — and most arrive evenings." },
      { icon: "TargetUserSolid", title: "Qualification at volume", body: "Agents' time goes to the same first five questions; buyers' details still need capturing accurately." },
      { icon: "Home2Solid", title: "Listing data chaos", body: "Feeds from portals, CRMs, and spreadsheets disagree on price, status, and availability." },
    ],
    build: [
      { title: "Inquiry response agents", body: "Voice and chat agents that capture requirements, answer listing questions, and book viewings.", service: "voice-ai-and-calling-agents" },
      { title: "Lead qualification campaigns", body: "Structured outreach that qualifies and schedules while your agents close.", service: "calling-campaigns" },
      { title: "Listing & CRM systems", body: "Platforms that reconcile listing data and keep every inquiry attached to a record.", service: "custom-software-development" },
    ],
    considerations: [
      "Automated calls and messages to leads require a lawful basis and working opt-outs — we design for it, you confirm the rules for your market.",
      "Listing data from third-party portals comes with terms of use; integrations are scoped to what is permitted.",
    ],
  },
  {
    slug: "saas-startups",
    title: "SaaS & Startups",
    short: "Product engineering and customer operations for teams shipping fast.",
    image: "deskNight",
    intro: [
      "Early teams need senior engineering without a senior headcount — and the moment growth lands, support becomes a second product nobody staffed.",
      "We act as the product-engineering layer: building features, hardening the platform, and standing up support systems that scale with signups.",
    ],
    challenges: [
      { icon: "Rocket5Solid", title: "Velocity vs. stability", body: "Shipping fast while the foundation quietly accumulates risk — tests, deploys, and monitoring decide which wins." },
      { icon: "UserMultiple4Solid", title: "Support debt", body: "Founders answering tickets at midnight is a phase, not a plan — the system has to take over." },
      { icon: "Cloud2Solid", title: "Cost & complexity creep", body: "Cloud bills and service sprawl grow faster than the product they support." },
    ],
    build: [
      { title: "Feature engineering", body: "Product development in visible increments, from first MVP to scaling work.", service: "custom-software-development" },
      { title: "Platform hardening", body: "CI/CD, testing strategy, and infrastructure that lets a small team move safely.", service: "cloud-and-product-engineering" },
      { title: "Support from day one", body: "AI-first-line support with human paths, built before volume forces the issue.", service: "customer-support" },
    ],
    considerations: [
      "We recommend boring, well-supported technology for early products — the stack should outlive the hype cycle.",
      "AI features get the same evaluation discipline as agents: grounded in your data, tested before customers see them.",
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
