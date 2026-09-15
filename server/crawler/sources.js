/**
 * Curated In-App High-Signal Lesson Vault.
 * Contains comprehensive, in-depth technical lessons, architectural patterns, and templates.
 * These are completely self-contained within LevelUp without requiring any external redirects.
 */
export const IN_APP_LESSONS_VAULT = [
  // RAID & Risk
  {
    keywords: ['raid', 'risk', 'governance', 'dependency', 'mitigation', 'escalation'],
    title: 'The Proactive TPM: Trigger-Based Risk Escalations in Enterprise Platforms',
    skillset: 'Program Management',
    skillset_priority: 'P0 - Core TPM Discipline',
    domain: 'Internal Architecture Vault',
    summary: 'A step-by-step breakdown of managing engineering uncertainty, scoring qualitative vs quantitative risks, and establishing trigger-based escalation paths to Directors and VPs.',
    readTime: '7 min read',
    key_takeaways: [
      'Risk escalations must never be surprise fire-drills; they should be pre-announced when quantitative trigger thresholds are breached.',
      'Always present 3 distinct trade-off options (Scope Reduction, Date Postponement, or Architecture Fallback) with estimated costs.',
      'Separate team-internal impediments from program-level cross-functional risks.'
    ],
    content_body: `### Why High-Stakes Risk Escalations Fail
In enterprise delivery, escalations often get delayed because project managers fear appearing incapable. By the time leadership is informed, the delay is irreversible.

### The Trigger Date Protocol
1. **Define the Trigger Point**: When an unvalidated assumption or third-party dependency passes a specific calendar deadline without resolution.
2. **The 3-Option Rule**:
   - *Option 1 (Recommended)*: Technical mitigation or fallback (e.g. degrade to cached data).
   - *Option 2*: De-scope non-critical features to preserve launch date.
   - *Option 3*: Shift the hard launch date (calculate exact financial / client SLA impact).

### Executive Escalation Cadence
- Level 1: Weekly Sync with Tech Lead.
- Level 2: Bi-weekly Director Briefing when Risk Score >= 15.
- Level 3: Steering Committee escalation when Trigger Date is within 7 days.`,
    actionable_template: `### Risk Escalation Email / Memo Template

**Subject**: [DECISION REQUIRED by Friday 3PM] OEM Integration API Gateway Risk Escalation

**1. Executive Summary**:
The third-party vehicle parts inventory API failed our 1,200 req/sec stress test, posing a Critical (Red) launch risk for Nov 15th.

**2. Proposed Options**:
- **Option A (Recommended)**: Enable asynchronous Redis cache fallback (Cost: 3 dev days. Launch on time).
- **Option B**: Postpone platform launch by 4 weeks until OEM upgrades infrastructure.

**3. Action Required**:
Steering approval on Option A engineering allocation by Friday 3:00 PM.`
  },

  // Requirements & Architecture
  {
    keywords: ['requirements', 'prd', 'spec', 'invest', 'acceptance criteria', 'edge case'],
    title: 'Deconstructing Complex Enterprise Workflows into INVEST Specifications',
    skillset: 'Program Management',
    skillset_priority: 'P0 - Core TPM Discipline',
    domain: 'Internal Architecture Vault',
    summary: 'How to decompose complex automotive workshop journeys into Independent, Negotiable, Valuable, Estimable, Small, and Testable increments.',
    readTime: '8 min read',
    key_takeaways: [
      'Vertical Slices beat Horizontal Layers: Always deliver end-to-end user value across DB, API, and UI in a single increment rather than building "just the database" first.',
      'Explicit boundary between business rules and engineering design in PRDs.',
      'Formulate Gherkin scenarios for both happy paths and edge cases (e.g. offline mobile device sync).'
    ],
    content_body: `### The Vertical Slice Principle in Platform Engineering
When building a dealer workshop feature (e.g. Digital Vehicle Check-in), traditional teams build the database tables in Sprint 1, backend APIs in Sprint 2, and UI in Sprint 3. The customer tests nothing until Sprint 4.

A modern TPM enforces vertical slices:
- *Slice 1*: Manually lookup vehicle VIN and display customer name end-to-end.
- *Slice 2*: Add bay allocation conflict checks.
- *Slice 3*: Add offline-mode local queueing.`,
    actionable_template: `### Vertical Slice User Story Template

**Title**: [Workshop Intake] Instant Bay Assignment on Vehicle Arrival
**User Story**:
As a Dealership Service Advisor,
I want to assign arriving vehicles directly to an open technician bay with automatic conflict detection,
So that customer wait time at check-in is kept under 4 minutes.

**Acceptance Criteria (Gherkin)**:
\`\`\`gherkin
Scenario: Automated bay assignment succeeds
  Given Technician Bay #4 is marked "Available"
  When Advisor confirms Intake for Vehicle "VIN-8841"
  Then Assign Bay #4 to Repair Order "RO-102"
  And Emit event "bay.assigned.v1" with timestamp
\`\`\``
  },

  // Metrics & Flow
  {
    keywords: ['metrics', 'velocity', 'cycle time', 'cfd', 'flow', 'throughput', 'dora'],
    title: 'Flow Diagnostics: Identifying Delivery Starvation with Cumulative Flow Diagrams',
    skillset: 'Program Management',
    skillset_priority: 'P0 - Core TPM Discipline',
    domain: 'Internal Architecture Vault',
    summary: 'A visual diagnostic guide to reading Cumulative Flow Diagrams (CFD), spotting testing bottlenecks, and applying Little’s Law to accelerate software delivery.',
    readTime: '7 min read',
    key_takeaways: [
      'Expanding horizontal distance on a CFD indicates lengthening cycle times and delayed customer feedback.',
      'Expanding vertical bands indicate work accumulating in a bottleneck stage (most frequently Code Review or QA Staging).',
      'The fastest way to accelerate delivery is not adding developers, but imposing strict Work-in-Progress (WIP) limits.'
    ],
    content_body: `### The 4 Warning Signs on a Cumulative Flow Diagram
1. **The Expanding Middle (WIP Ballooning)**: The band between "In Dev" and "Done" grows wider every sprint. Tickets are being started before previous ones are verified.
2. **The Staircase of Batch Delivery**: The "Done" line remains flat for 2 weeks, then leaps upward on release day. Indicates risky big-bang releases instead of continuous flow.
3. **Flat Top Line (Starvation)**: Product specifications are delayed, leaving developers idling or working on unrefined low-priority pet tasks.
4. **Constricted QA Band**: QA engineers are overwhelmed with testing 25 tickets dumped on the final day of the sprint.`,
    actionable_template: `### Team Flow Optimization Action Plan

- [ ] **Establish WIP Limit**: Max 2 active tickets per developer at any time.
- [ ] **Daily Standup Focus**: Walk the board from Right to Left (focus on moving tickets across "Done" before starting new ones).
- [ ] **Track Cycle Time Percentiles**: Automate weekly calculation of P50, P85, and P95 cycle times in JIRA / delivery dashboard.
- [ ] **Decompose Large Epics**: Any ticket estimated > 3 days of cycle time must be broken into smaller testable vertical slices.`
  },

  // System Design & APIs
  {
    keywords: ['api', 'rest', 'idempotency', 'webhooks', 'caching', 'redis', 'contracts'],
    title: 'Idempotency and Resilience Patterns in High-Throughput APIs',
    skillset: 'Technical Architecture',
    skillset_priority: 'P0 - Core TPM Discipline',
    domain: 'Internal Architecture Vault',
    summary: 'Comprehensive guide to designing idempotent REST contracts, handling network retry jitter, and structuring distributed webhook deliveries.',
    readTime: '9 min read',
    key_takeaways: [
      'Network timeouts are uncertain: the server may have processed the request, but the client never received the 200 OK.',
      'Idempotency keys uniquely identify state mutations and guarantee that duplicate retries produce exactly one side effect.',
      'Always use Exponential Backoff with Jitter for API retries to avoid hammering degraded backend services.'
    ],
    content_body: `### The Two Generals Problem in Platform APIs
When a mobile app sends a request to book a workshop service bay and the connection drops, did the booking succeed or fail?

If the client retries blindly without an idempotency key:
- Risk: Bay is booked twice, two confirmation SMS are sent, parts inventory is decremented twice.

### The Idempotent Request Lifecycle
1. Client generates UUID: \`Idempotency-Key: e82f3a41-...\`.
2. API Gateway inspects cache with distributed lock.
3. If processed: Cached response returned immediately with header \`X-Cache-Lookup: HIT\`.
4. If currently processing: Return HTTP 409 or wait for lock.
5. If new: Execute business logic, commit DB transaction, store result in Redis with 24-hour TTL.`,
    actionable_template: `### Distributed Idempotency Specification

\`\`\`javascript
// Express/Node.js Idempotency Middleware Pattern
async function idempotencyMiddleware(req, res, next) {
  const key = req.headers['idempotency-key'];
  if (!key) return res.status(400).json({ error: 'Missing Idempotency-Key header' });

  const cached = await redis.get(\`idempotency:\${key}\`);
  if (cached) {
    const { status, body } = JSON.parse(cached);
    return res.status(status).json(body);
  }

  // Intercept response
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    redis.set(\`idempotency:\${key}\`, JSON.stringify({ status: res.statusCode, body }), 'EX', 86400);
    return originalJson(body);
  };

  next();
}
\`\`\``
  },

  // Architecture & Microservices
  {
    keywords: ['system design', 'architecture', 'scalability', 'microservices', 'kafka', 'c4'],
    title: 'System Design for TPMs: Deconstructing Distributed Monoliths vs Event-Driven Services',
    skillset: 'Technical Architecture',
    skillset_priority: 'P0 - Core TPM Discipline',
    domain: 'Internal Architecture Vault',
    summary: 'Evaluating monoliths vs microservices, avoiding distributed monolith anti-patterns, and leveraging Apache Kafka for decoupled asynchronous telemetry streams.',
    readTime: '10 min read',
    key_takeaways: [
      'A Distributed Monolith has all the operational complexity of microservices with all the tight coupling of a monolith.',
      'Event-Driven Architecture (EDA) decouples producers and consumers: the workshop intake service emits an event without knowing who consumes it.',
      'Partition keys in Kafka ensure strict in-order message delivery per entity (e.g. per VIN or dealership).'
    ],
    content_body: `### The Distributed Monolith Trap
Teams often break a single application into 12 microservices that synchronously call each other over HTTP. If Service A calls Service B, which calls Service C, which calls Service D:
- **Availability = A × B × C × D**: If each has 99.5% uptime, system availability drops to 98.0%.
- **Cascading Latency**: Cumulative latency spikes on every hop.

### The Event-Driven Decoupling Remedy
Instead of synchronous HTTP chaining, publish immutable events to Kafka:
- Event: \`VehicleArrivedAtWorkshop\`
- Subscribed consumers:
  - Inventory Service allocates parts.
  - Telematics Service initiates diagnostic scan.
  - Notification Service sends WhatsApp update to vehicle owner.`,
    actionable_template: `### Architectural Decision Record (ADR) Template

# ADR-042: Event-Driven Kafka Telemetry for Workshop Ingestion
**Status**: Approved | **Deciders**: Principal TPM, Backend Architect, Tech Leads

## Context & Problem
Direct synchronous REST calls between Workshop Intake and Parts Inventory cause 504 Gateway Timeouts during morning intake surges (08:00 - 09:30 AM).

## Decision
Adopt Apache Kafka topic \`dealer.workshop.events.v1\` with \`dealership_id\` as partition key.
Service intake API immediately responds with \`202 Accepted\` and enqueues event.

## Consequences
- **Positive**: Intake API P95 latency reduced from 840ms to 65ms.
- **Trade-off**: Eventual consistency (inventory allocation occurs within 1.5 seconds rather than synchronously).`
  },

  // Prioritization & Product
  {
    keywords: ['prioritization', 'rice', 'cost of delay', 'wsjf', 'roadmap', 'product'],
    title: 'Mathematical Product Prioritization: Defending Roadmaps with Cost of Delay and RICE',
    skillset: 'Product Strategy',
    skillset_priority: 'P0 - Core TPM Discipline',
    domain: 'Internal Architecture Vault',
    summary: 'How to calculate Cost of Delay ($/week) and calibrate RICE scoring to eliminate subjective bias and defend roadmap trade-offs in front of executive sponsors.',
    readTime: '8 min read',
    key_takeaways: [
      'Prioritization based on loudest client voice leads to technical debt and missed enterprise deadlines.',
      'Cost of Delay translates urgency into cold business currency ($/week).',
      'WSJF = Cost of Delay / Effort. High-value, low-effort features must ship first.'
    ],
    content_body: `### RICE Scoring Calibration Rules
- **Reach**: Number of real users / transactions impacted per quarter (e.g. 8,500 workshop appointments).
- **Impact**: 3 = Massive, 2 = High, 1 = Medium, 0.5 = Low, 0.25 = Minimal.
- **Confidence**: 100% (High - backed by analytics & user tests), 80% (Medium - qualitative client feedback), 50% (Low - gut feel).
- **Effort**: Total developer/engineering weeks required.

\`\`\`
RICE Score = (Reach × Impact × Confidence) / Effort
\`\`\``,
    actionable_template: `### RICE Roadmap Scoring Calculator

| Feature Initiative | Reach (Qtr) | Impact (0.25-3) | Conf (50-100%) | Effort (Weeks) | RICE Score | Rank |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| License Plate OCR VIN Scanner | 12,000 | 2.0 | 80% | 4 | **4,800** | #1 |
| Automated Service Bay Conflict Check | 18,000 | 1.0 | 90% | 5 | **3,240** | #2 |
| Custom Color Themes for Dealership UI | 2,500 | 0.5 | 50% | 2 | **312** | Deprioritized |`
  },

  // Executive Communication
  {
    keywords: ['pyramid principle', 'executive communication', 'memo', 'minto', 'scqa', 'briefing'],
    title: 'The Minto Pyramid Principle: Structuring Executive Memos That Win Rapid Approvals',
    skillset: 'Executive Communication',
    skillset_priority: 'P0 - Core TPM Discipline',
    domain: 'Internal Architecture Vault',
    summary: 'Barbara Minto’s framework for technical leaders: structuring communication top-down (Answer First) using Situation-Complication-Question-Answer narrative architecture.',
    readTime: '8 min read',
    key_takeaways: [
      'Executives do not have time to read chronological backstory; give the conclusion and bottom-line recommendation in Sentence 1.',
      'The SCQA structure anchors the reader with familiar context before introducing the challenge.',
      'Supporting arguments must be MECE: Mutually Exclusive, Collectively Exhaustive.'
    ],
    content_body: `### Bottom-Up vs Top-Down Communication
Engineers are trained to think bottom-up:
*Data -> Method -> Analysis -> Complications -> Conclusion*

Executives operate in a rapid decision environment:
*Recommendation -> Cost/Impact -> Supporting Proof -> Trade-offs*

### The SCQA Architecture
1. **Situation**: A truth everyone agrees on.
2. **Complication**: What broke, what changed, or what external deadline emerged.
3. **Question**: The core decision we must make today.
4. **Answer**: Our unambiguous, actionable recommendation.`,
    actionable_template: `### SCQA Executive Escalation Memo Template

**TO**: VP of Engineering & Client Delivery Director
**FROM**: Technical Program Manager
**SUBJECT**: Recommendation: Platform Rollout Strategy for Nov 15th

**1. Recommendation (Answer First)**:
We recommend maintaining the scheduled Nov 15th platform rollout by activating the pre-built Redis cache fallback for parts inventory. This protects our SLA commitment and avoids a $45k client penalty.

**2. Context (SCQA)**:
- **Situation**: Pilot rollout across 20 workshops completed with a 94% customer satisfaction rating.
- **Complication**: Yesterday's 1,200 req/sec stress test revealed that the client's legacy ERP API rate-limits at 450 req/sec.
- **Question**: Do we postpone the launch or deploy the caching layer?
- **Answer**: Deploying the Redis cache-aside layer requires 3 developer days, which we have verified fits into current Sprint capacity.`
  }
];

/**
 * Intelligent in-app topic lesson synthesizer.
 * Generates structured, high-value in-app study lessons for any custom topic.
 */
export function synthesizeInAppLesson(topicTitle, description, priority = 'medium', skillset = 'Technical Architecture') {
  const cleanTitle = topicTitle.trim();
  const readTime = priority === 'high' ? '9 min read' : '6 min read';
  const skillsetPriority = priority === 'high' ? 'P0 - Core TPM Discipline' : (priority === 'medium' ? 'P1 - High-Value Differentiator' : 'P2 - Growth Skillset');

  return {
    title: `In-App Study Module: ${cleanTitle}`,
    domain: 'Internal Master Lesson',
    skillset: skillset,
    skillset_priority: skillsetPriority,
    summary: description ? `${description.slice(0, 160)}...` : `Executive technical program management briefing and architectural blueprint for ${cleanTitle}.`,
    read_time: readTime,
    key_takeaways: [
      `Deep conceptual mastery of ${cleanTitle} for senior technical program management and delivery leadership.`,
      `Key architectural trade-offs, scalability boundaries, and failure modes when deploying ${cleanTitle} in enterprise systems.`,
      `Practical workplace governance: how to audit, instrument telemetry, and present ${cleanTitle} decisions to executive sponsors.`
    ],
    content_body: `### Executive Overview: ${cleanTitle}
${description || `Comprehensive in-depth technical module exploring ${cleanTitle} in the context of enterprise software delivery and platform engineering.`}

### 1. Core Engineering Fundamentals & Architecture
When delivering scalable distributed platforms, **${cleanTitle}** forms a critical link between system reliability, client business outcomes, and developer velocity.
- **Architecture Invariants**: Evaluate data consistency models, operational network boundaries, and resilience against cascading failures.
- **Integration Seams**: How this capability interfaces with upstream services, event streams, and downstream client user interfaces.

### 2. Trade-off Analysis & Failure Modes
Every architectural decision involves compromises:
- *Latency vs Consistency*: How synchronous guarantees impact end-to-end response times under peak load.
- *Operational Complexity*: What telemetry, alerting, and automated runbooks are required for production operations.

### 3. Workplace Application & TPM Delivery Strategy
As a Technical Program Manager or Product Owner:
1. Establish unambiguous Gherkin acceptance criteria for engineering squads.
2. Define non-functional requirements (P95 latency, error budgets, concurrent transaction limits).
3. Validate business impact with quantitative telemetry dashboards rather than subjective status reports.`,
    actionable_template: `### Technical Decision & Delivery Template: ${cleanTitle}

- [ ] **Contract Definition**: Establish unambiguous API/Interface schema and error handling contracts.
- [ ] **Non-Functional SLAs**: Verify P95 latency < 350ms and error budget allocation < 0.1%.
- [ ] **Telemetry Invariants**: Instrument Prometheus counters and OpenTelemetry distributed tracing spans.
- [ ] **Executive Sign-off**: Present 1-page SCQA decision brief outlining mitigation strategies and rollback criteria.`
  };
}
