export const phasesData = [
  {
    phase_number: 1,
    title: 'Phase 1: Program Management Rigor',
    description: 'Master core TPM discipline: structured requirements, quantitative risk governance, delivery flow metrics, and cross-functional dependency management.'
  },
  {
    phase_number: 2,
    title: 'Phase 2: Technical Fluency',
    description: 'Deepen system-level engineering judgment: RESTful contracts, distributed system fundamentals, quality engineering, and SQL telemetry analytics.'
  },
  {
    phase_number: 3,
    title: 'Phase 3: Product Strategy & Executive Communication',
    description: 'Elevate strategic impact: mathematical prioritization frameworks, outcome-based OKRs, top-down Pyramid Principle briefing, and AI-augmented PM workflows.'
  }
];

export const weeksData = [
  // ==========================================
  // PHASE 1: PROGRAM MANAGEMENT RIGOR
  // ==========================================
  {
    week_number: 1,
    phase_number: 1,
    title: 'RAID Logs & Proactive Risk Governance',
    skillset: 'Program Management',
    skillset_priority: 'P0 - Core TPM Discipline',
    learning_goal: 'Construct an executive-grade RAID log (Risks, Assumptions, Issues, Dependencies) with qualitative & quantitative severity scoring, trigger dates, and automated escalation thresholds.',
    action_item: 'Audit your active automotive dealer-workshop platform delivery: identify top 3 unmitigated technical risks and present a 1-page risk heatmap with mitigation owners at the next sync.',
    read_time: '8 min read',
    key_takeaways: [
      'A Risk is a potential future event with a probability and impact; an Issue is a risk that has already materialized and requires immediate triage.',
      'Always separate Assumptions from Facts. An unvalidated assumption regarding third-party dealer API response time is a ticking time bomb.',
      'Quantify risk exposure: Risk Score = Probability (1–5) × Impact (1–5). Any risk with a score >= 15 must have a named executive sponsor and bi-weekly review cadence.',
      'Establish trigger dates: the exact calendar date by which a fallback mitigation must be enacted before the primary path is irreversibly delayed.'
    ],
    content_body: `### Why RAID Logs Fail in Typical IT Delivery
Most delivery managers maintain RAID logs as static compliance spreadsheets submitted to PMOs that nobody reads. For a Technical Program Manager (TPM) driving high-consequence enterprise platforms, your RAID log is your primary steering instrument.

### The Four Pillars
1. **Risks (Future Potential Blockers)**: E.g., *"Third-party OEM telematics gateway API may not support 1,500 concurrent workshop appointment bookings during morning peaks."*
2. **Assumptions (Unvalidated Hypotheses)**: E.g., *"We assume the client dealer network will provide staging access with production-like vehicle telemetry data by Sprint 3."*
3. **Issues (Active Blockers)**: E.g., *"Integration test environment for dealer billing microservice has been down for 48 hours, blocking end-to-end regression."*
4. **Dependencies (Cross-Team Deliverables)**: E.g., *"Vehicle Parts Catalog API (Team Alpha) must deliver schema v2.1 before our Workshop Booking frontend can render stock availability."*

### Quantitative Risk Scoring Matrix
- **Probability (1–5)**: 1 = Rare (<10%), 2 = Unlikely (10-30%), 3 = Moderate (30-60%), 4 = Likely (60-85%), 5 = Almost Certain (>85%).
- **Impact (1–5)**: 1 = Negligible, 2 = Minor local delay, 3 = Sprint goal compromised, 4 = Client milestone delayed, 5 = Platform outage / revenue loss.
- **Exposure Severity**:
  - **16–25 (Critical / Red)**: Requires VP / Executive steering review, dedicated daily burn-down, and approved fallback path.
  - **9–15 (Major / Amber)**: Handled at Tech Lead / Program Lead level; mitigation actively funded in sprint backlog.
  - **1–8 (Minor / Green)**: Monitored in weekly backlog grooming.`,
    actionable_template: `### Executive RAID Log Template (Markdown / Sheet)

| ID | Type | Description | Owner | Prob (1-5) | Imp (1-5) | Score | Trigger Date | Mitigation Strategy | Fallback Plan | Status |
|:---|:---|:---|:---|:---:|:---:|:---:|:---|:---|:---|:---:|
| R-01 | Risk | OEM parts catalog API rate-limited under peak load | N. Guleria | 4 | 4 | 16 (Red) | Oct 15 | Implement Redis cache with 15m TTL | Degrade gracefully to last-known cached stock | Active |
| A-01 | Assumption | Dealerships have stable Wi-Fi in workshop bays | Tech Lead | 3 | 4 | 12 (Amber) | Oct 20 | Run network latency audit across 5 pilot workshops | Implement offline-first local queue in PWA | In Review |
| D-01 | Dependency | Security Team OAuth2 token endpoint migration | Sec Lead | 4 | 5 | 20 (Red) | Nov 01 | Bi-weekly integration sync with SecOps | Keep legacy HMAC auth enabled for 30-day grace | Blocked |
| I-01 | Issue | Staging database schema mismatch on parts inventory | Backend Lead | - | - | Critical | Immediate | Hotfix migration script deployed to staging | Roll back staging DB snapshot | Open |`
  },
  {
    week_number: 2,
    phase_number: 1,
    title: 'Structured Requirements Architecture (PRD / BRD / INVEST)',
    skillset: 'Program Management',
    skillset_priority: 'P0 - Core TPM Discipline',
    learning_goal: 'Master crisp specification writing: business intent vs engineering constraints, INVEST user stories, edge-case modeling, and unambiguous acceptance criteria.',
    action_item: 'Write a comprehensive 2-page PRD for an upcoming workshop booking or parts-inventory microservice feature, complete with happy-path and fallback scenarios.',
    read_time: '9 min read',
    key_takeaways: [
      'A Product Requirements Document (PRD) describes the *What* and the *Why*; it must never dictate the internal technical *How* unless an architectural constraint exists.',
      'The INVEST standard: Stories must be Independent, Negotiable, Valuable, Estimable, Small, and Testable.',
      'Never write acceptance criteria as vague sentences. Use Given-When-Then (Gherkin format) to eliminate developer-QA ambiguity.',
      'Edge cases and Non-Functional Requirements (latency budgets, concurrency, error states) belong directly in the PRD, not as afterthoughts.'
    ],
    content_body: `### The Transition from Delivery Manager to TPM Requirements Architect
Delivery managers often relay business requirements as loose bullets from client meetings. A Technical Program Manager structures requirements as an architectural contract that bridges executive business goals with distributed engineering systems.

### PRD Core Sections
1. **Problem Statement & North Star Metric**: Quantify the current pain (e.g. *"Dealership service advisors lose 8.4 minutes per vehicle intake due to manual VIN lookup and disconnected inventory databases"*).
2. **Target Persona & Core Use Cases**: Workshop Service Advisor, Technician, and Fleet Manager.
3. **In-Scope vs Out-of-Scope (Ruthless Boundary)**: Explicitly state what is NOT being built in v1.0.
4. **Functional Requirements & Gherkin Acceptance Criteria**:
   - *Scenario*: Workshop bay double-booking prevention.
   - *Given* a service bay is reserved from 10:00 to 11:30 AM,
   - *When* another advisor submits a reservation overlapping by >= 1 minute,
   - *Then* the system rejects the booking with HTTP 409 Conflict and surfaces the next 3 available slot recommendations.
5. **Non-Functional Requirements (NFRs)**:
   - P95 response time < 350ms at 1,200 requests/sec.
   - Idempotent booking submission (duplicate clicks must not create duplicate repair orders).`,
    actionable_template: `### Executive PRD Template: Workshop Digital Intake

# PRD: Digital Workshop Vehicle Intake & Bay Allocation
**Author**: Technical Program Lead | **Target Release**: Q4 Sprint 4 | **Status**: In Review

## 1. Problem & Business Objective
- **Problem**: 28% of customer appointments experience intake delays exceeding 15 minutes due to manual vehicle lookup.
- **Objective**: Reduce intake turnaround from 14.2 min to < 4.0 min across 120 dealer locations.

## 2. In-Scope vs Out-of-Scope
- **In-Scope**: Automated license plate VIN decoding, real-time bay availability lookup, digital customer signature.
- **Out-of-Scope**: Payment processing (deferred to v2.0), automated tire tread depth computer vision.

## 3. Key User Scenarios (Given-When-Then)
\`\`\`gherkin
Scenario: Real-Time Bay Conflict Prevention
  Given Bay #3 is allocated to Repair Order #4092 from 09:00 to 11:00 AM
  When Advisor attempts to assign Vehicle #8812 to Bay #3 at 10:15 AM
  Then Return HTTP 409 Conflict with code "BAY_OCCUPIED"
  And Provide available bay recommendations within a 30-minute window
\`\`\`

## 4. Technical Constraints & NFRs
- API Payload: RESTful JSON over TLS 1.3 with Idempotency-Key header.
- Latency SLA: P99 < 500ms; P50 < 120ms under 500 requests/second.
- Telemetry: Emit Prometheus counter \`workshop_intake_completed_total\` tagged by dealership_id.`
  },
  {
    week_number: 3,
    phase_number: 1,
    title: 'Delivery Metrics & Team Predictability (Velocity, Cycle Time, CFD)',
    skillset: 'Program Management',
    skillset_priority: 'P0 - Core TPM Discipline',
    learning_goal: 'Shift from subjective estimation to empirical predictability using Cycle Time distributions, Lead Time, Sprint Velocity, and Cumulative Flow Diagrams (CFD).',
    action_item: 'Extract the last 30 days of JIRA/tracker data for your delivery team. Plot Cycle Time percentiles (p50, p85, p95) and isolate the top bottleneck stage.',
    read_time: '8 min read',
    key_takeaways: [
      'Story points are relative and team-specific; they cannot be averaged across teams or used for executive milestone commitments.',
      'Cycle Time (time elapsed from "In Progress" to "Production") is a real-world clock metric that follows a Weibull or log-normal distribution, not a Gaussian bell curve.',
      'Commit to dates using the 85th percentile (p85) Cycle Time: "85% of our work items finish in <= 6.2 days."',
      'Cumulative Flow Diagrams (CFD): Parallel bands mean smooth flow; expanding bands indicate ballooning Work in Progress (WIP) and upstream starvation.'
    ],
    content_body: `### The Flaw of Story Point Velocity
When executives ask *"When will the automotive dealer portal release ship?"*, saying *"Our velocity is 42 points"* is meaningless. Velocity is easily gamed by point inflation. Modern TPMs use empirical flow metrics:

### 1. The Four Fundamental Flow Metrics
- **Lead Time**: From customer request creation to production delivery.
- **Cycle Time**: From developer first committing code or moving ticket to "In Dev" until production deployment.
- **Throughput**: Count of discrete, verified work items delivered per unit time (e.g. 14 tickets / week).
- **Work in Progress (WIP)**: Number of items started but not yet completed.

### 2. Little's Law
\`\`\`
Average Cycle Time = Average WIP / Average Throughput
\`\`\`
To deliver faster, you do NOT push developers to work longer hours. You **lower WIP**. Halving WIP immediately halves Cycle Time and reduces context switching.

### 3. Reading Cumulative Flow Diagrams (CFD)
- **Flat Top Line**: Team is not pulling new work.
- **Widening "In Review / QA" Band**: Testing or code review bottleneck. Tickets are stacking up waiting for verification.
- **Steep "Done" Slope**: High throughput.`
  },
  {
    week_number: 4,
    phase_number: 1,
    title: 'Cross-Functional Dependency Mapping & Steering Governance',
    skillset: 'Program Management',
    skillset_priority: 'P1 - High-Value Differentiator',
    learning_goal: 'Map multi-team critical path dependencies, align cross-functional tech leads, and run high-cadence steering committee reviews without administrative bloat.',
    action_item: 'Create a visual dependency matrix linking the dealer portal frontend, integration middleware, and client OEM ERP endpoints with clear SLA expectations.',
    read_time: '7 min read',
    key_takeaways: [
      'Most program failures occur at organizational seams (where Team A depends on an API from Team B that was deprioritized by Team B’s PM).',
      'Establish a formal Dependency Contract: Producer team, Consumer team, Contract Spec URL, Promised Delivery Sprint, and Integration Test Harness.',
      'Calculate Critical Path: the sequence of dependent tasks that determines the absolute minimum duration of the program.',
      'Run Steering Committees focused purely on Decisions and Escalations, never chronological status readouts.'
    ],
    content_body: `### Navigating Organizational Seams
As a Delivery Manager, you track your team’s internal deliverables. As a TPM, you manage the *connective tissue* across frontend apps, core backend microservices, OEM legacy mainframes, and third-party SaaS vendors.

### The Dependency Handshake Protocol
Whenever your platform requires an API or service from another squad:
1. **Producer & Consumer Agreement**: Shared PRD snippet defining request/response contract.
2. **Mock Server by Week 2**: Producer publishes a mock endpoint so consumer frontend engineers aren't blocked waiting for backend database implementation.
3. **SLA & Escalation Gate**: If the upstream dependency slips past the Trigger Date, the pre-agreed fallback path is enacted immediately.`
  },

  // ==========================================
  // PHASE 2: TECHNICAL FLUENCY
  // ==========================================
  {
    week_number: 5,
    phase_number: 2,
    title: 'REST APIs, Contracts & Integration Architecture',
    skillset: 'Technical Architecture',
    skillset_priority: 'P0 - Core TPM Discipline',
    learning_goal: 'Understand OpenAPI/Swagger specs, HTTP methods and status codes, payload design, idempotency keys, rate limiting, and webhook resilience patterns.',
    action_item: 'Inspect one core API payload between the workshop booking service and inventory backend; document contract invariants and draft an OpenAPI 3.0 snippet.',
    read_time: '9 min read',
    key_takeaways: [
      'HTTP Methods: GET is safe and idempotent; POST is neither; PUT is idempotent replacement; PATCH is partial modification; DELETE is idempotent removal.',
      'Always implement Idempotency Keys for state-mutating requests (e.g. creating bookings or payments) to prevent duplicate transactions on network timeouts.',
      'Rate Limiting & Throttling: Use Token Bucket or Leaky Bucket algorithms with HTTP 429 Too Many Requests and \`Retry-After\` response headers.',
      'Webhooks require asynchronous worker queues, HMAC signature verification (\`X-Hub-Signature-256\`), and exponential backoff retry policies.'
    ],
    content_body: `### The TPM’s Role in API Architecture
A TPM does not need to write production Go or Java controllers, but you must be able to review API payloads, challenge non-idempotent designs, and ensure cross-system contracts prevent data corruption.

### Idempotency Key Architecture
When a dealer mobile app submits a vehicle repair order:
1. Client generates UUIDv4: \`Idempotency-Key: 8a7c6b5e-4f3a-...\`
2. API Gateway checks Redis: Has this key been processed in the last 24 hours?
3. If yes: Return the cached response immediately without re-executing business logic or charging parts inventory twice.
4. If no: Acquire distributed lock, execute transaction, cache result in Redis with 24h TTL, release lock.`,
    actionable_template: `### OpenAPI 3.0 Contract Snippet (YAML)

\`\`\`yaml
openapi: 3.0.3
info:
  title: Workshop Booking Service API
  version: 1.0.0
paths:
  /api/v1/appointments:
    post:
      summary: Create new vehicle service appointment
      headers:
        Idempotency-Key:
          schema:
            type: string
            format: uuid
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [dealership_id, vin, scheduled_time, bay_id]
              properties:
                dealership_id: { type: string, example: "DLR-908" }
                vin: { type: string, example: "1HGCR2F83HA120934" }
                scheduled_time: { type: string, format: date-time }
                bay_id: { type: integer, example: 4 }
      responses:
        '201':
          description: Appointment successfully confirmed
        '409':
          description: Conflict - Bay or Technician already allocated
        '429':
          description: Rate limit exceeded - Retry after specified header
\`\`\``
  },
  {
    week_number: 6,
    phase_number: 2,
    title: 'System Design Fundamentals for TPMs',
    skillset: 'Technical Architecture',
    skillset_priority: 'P0 - Core TPM Discipline',
    learning_goal: 'Master technical architecture trade-offs: monolith vs microservices, Redis caching patterns, load balancers, database scaling, CAP theorem, and message queues.',
    action_item: 'Produce a clean C4 architectural diagram of your platform service illustrating load balancers, caching layer, primary DB, and external dealer ERP interfaces.',
    read_time: '10 min read',
    key_takeaways: [
      'CAP Theorem: In a distributed system with network partition (P), you must choose between Consistency (all nodes see latest data) or Availability (every request gets a non-error response).',
      'Cache-Aside Pattern: Application queries Redis first. On miss, queries DB, populates Redis with TTL, and returns data. Beware of Cache Stampede (thundering herd).',
      'Database Scaling: Read Replicas scale query reads; Sharding partitions data horizontally across multiple DB instances by partition key (e.g. dealership_id).',
      'Asynchronous Decoupling: Use message queues (Kafka / RabbitMQ / SQS) to smooth out traffic spikes and decouple real-time UI from heavy backend processing.'
    ],
    content_body: `### How to Evaluate Architectural Trade-offs Like a Senior TPM
When software architects propose replacing a monolith with 20 microservices, a senior TPM must ask:
1. *What is our network boundary overhead?* (Each network hop adds 5–25ms latency).
2. *How do we maintain transaction consistency?* (Distributed two-phase commits vs Saga pattern).
3. *What is our blast radius?* (If the Dealer Auth service fails, does the entire workshop bay scheduling app crash?).

### Caching Strategy: Cache-Aside vs Write-Through
- **Cache-Aside**: Read heavy. App checks Redis. If missing, reads DB, writes to Redis with TTL.
- **Write-Through**: Data written simultaneously to cache and DB. Prevents stale reads at cost of higher write latency.
- **Cache Stampede Mitigation**: Use probabilistic early expiration or mutex locks when popular cache keys expire.`,
    actionable_template: `### C4 Architecture Component Checklist

- [ ] **Load Balancers**: Multi-AZ Application Load Balancer with round-robin / least-outstanding-requests routing and health check endpoints (\`/healthz\`).
- [ ] **Application Tier**: Stateless containerized microservices (Kubernetes / ECS) with horizontal pod autoscaling (HPA) triggered at 70% CPU/Memory.
- [ ] **Caching Layer**: Redis Cluster with cache-aside pattern, 15-minute TTL, and automated failover replicas.
- [ ] **Data Tier**: Primary relational DB (PostgreSQL / Aurora) with automated multi-AZ failover and 2 Read Replicas for reporting queries.
- [ ] **Event Streaming**: Apache Kafka topic \`dealer.appointments.events\` partitioned by \`dealership_id\` to preserve strict temporal order.`
  },
  {
    week_number: 7,
    phase_number: 2,
    title: 'Quality Engineering, Mobile & CI/CD Pipelines',
    skillset: 'Technical Architecture',
    skillset_priority: 'P1 - High-Value Differentiator',
    learning_goal: 'Internalize the testing pyramid (unit, integration, contract, E2E), mobile release management, automated regression gates, feature flags, and canary deployments.',
    action_item: 'Audit your current release pipeline: draft a feature flag rollout strategy that limits blast radius to 5% of dealer workshops on day one.',
    read_time: '8 min read',
    key_takeaways: [
      'The Testing Pyramid: 70% fast unit tests, 20% integration & contract tests, 10% end-to-end UI tests. Inverted pyramids lead to brittle, flaky 3-hour CI runs.',
      'Contract Testing (Pact / OpenAPI): Verifies that client and server adhere to the same schema without running expensive end-to-end environments.',
      'Feature Flags (LaunchDarkly / Unleash): Decouple deployment (putting code on server) from release (enabling user visibility).',
      'Canary Deployment: Route 5% of production traffic to the new container version; monitor Prometheus error rate and latency; auto-rollback if error rate > 0.5%.'
    ],
    content_body: `### Progressive Delivery in Enterprise Platforms
Traditional IT platforms release big-bang updates at midnight on weekends. Modern TPMs mandate Progressive Delivery: release continuously during business hours with zero downtime and automated blast radius containment.

### Canary Deployment Workflow
1. CI passes unit, contract, and automated regression suite.
2. Deploy v2.0 containers alongside v1.0.
3. Service Mesh / Ingress routes 5% of requests to v2.0.
4. Telemetry evaluates DORA metrics: HTTP 5xx rate, P99 latency.
5. If clean after 30 minutes, promote to 25% -> 50% -> 100%.
6. If 5xx error rate spikes above 0.5%, traffic automatically switches back to v1.0 in < 3 seconds.`
  },
  {
    week_number: 8,
    phase_number: 2,
    title: 'SQL Fundamentals & Data-Driven Delivery Telemetry',
    skillset: 'Data & SQL Analytics',
    skillset_priority: 'P1 - High-Value Differentiator',
    learning_goal: 'Master multi-table JOINs, GROUP BY aggregations, window functions (ROW_NUMBER, LAG/LEAD), and querying system telemetry logs directly from production replicas.',
    action_item: 'Write and execute a SQL query against platform test/staging logs to identify peak workshop booking hours and average service turnaround time by dealer location.',
    read_time: '9 min read',
    key_takeaways: [
      'Inner JOIN matches rows in both tables; LEFT JOIN preserves all rows from left table (crucial for finding orphaned records or unbooked bays).',
      'Window functions (\`OVER (PARTITION BY ... ORDER BY ...)\`) perform calculations across sets of table rows without collapsing them into a single row.',
      '\`LAG()\` and \`LEAD()\` let you calculate delta time between successive events (e.g. time elapsed between vehicle bay entry and exit).',
      'Always check \`EXPLAIN ANALYZE\` to ensure queries use indexed B-Trees rather than catastrophic full table scans (\`Seq Scan\`).'
    ],
    content_body: `### Why TPMs Must Write SQL
A TPM who relies on business analysts or developers to run database queries is flying blind. Direct SQL fluency lets you audit real delivery performance, verify telemetry invariants, and diagnose production bottlenecks independently.

### Practical Window Functions
- **\`ROW_NUMBER()\`**: Deduplicate event logs by ordering by timestamp descending.
- **\`LAG(timestamp, 1)\`**: Compute duration between status transitions (e.g. from \`INTAKE_START\` to \`TECHNICIAN_ASSIGNED\`).`,
    actionable_template: `### Production SQL Telemetry Queries

\`\`\`sql
-- 1. Calculate P50, P85, P95 Vehicle Turnaround Time by Dealership
SELECT 
  dealership_id,
  COUNT(*) as total_services,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY turnaround_minutes) as p50_turnaround_min,
  PERCENTILE_CONT(0.85) WITHIN GROUP (ORDER BY turnaround_minutes) as p85_turnaround_min,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY turnaround_minutes) as p95_turnaround_min
FROM (
  SELECT 
    dealership_id,
    repair_order_id,
    ROUND(EXTRACT(EPOCH FROM (completed_at - intake_at)) / 60, 2) as turnaround_minutes
  FROM workshop_repair_orders
  WHERE status = 'COMPLETED' 
    AND completed_at >= CURRENT_DATE - INTERVAL '30 days'
) sub
GROUP BY dealership_id
HAVING COUNT(*) >= 50
ORDER BY p85_turnaround_min DESC;

-- 2. Detect Concurrent Bay Booking Overlaps (Integrity Check)
SELECT 
  a1.dealership_id,
  a1.bay_id,
  a1.id as appointment_1,
  a2.id as appointment_2,
  a1.start_time,
  a1.end_time
FROM appointments a1
JOIN appointments a2 
  ON a1.dealership_id = a2.dealership_id
  AND a1.bay_id = a2.bay_id
  AND a1.id != a2.id
  AND a1.start_time < a2.end_time
  AND a1.end_time > a2.start_time;
\`\`\``
  },

  // ==========================================
  // PHASE 3: PRODUCT & EXECUTIVE COMMUNICATION
  // ==========================================
  {
    week_number: 9,
    phase_number: 3,
    title: 'Prioritization Frameworks (RICE, MoSCoW, Cost of Delay / WSJF)',
    skillset: 'Product Strategy',
    skillset_priority: 'P0 - Core TPM Discipline',
    learning_goal: 'Defend roadmap decisions objectively: weigh Reach, Impact, Confidence, and Effort; master Weighted Shortest Job First (WSJF) and economic Cost of Delay.',
    action_item: 'Score the next 10 feature requests from dealer workshop managers using RICE; present the ranked matrix to your business product sponsor.',
    read_time: '8 min read',
    key_takeaways: [
      'Subjective prioritization ("the loudest client executive gets their feature") destroys platform velocity. Mathematical frameworks depersonalize trade-offs.',
      'RICE Formula: (Reach × Impact × Confidence) / Effort. Impact is scored on a logarithmic scale (3 = Massive, 2 = High, 1 = Medium, 0.5 = Low, 0.25 = Minimal).',
      'Confidence is the antidote to optimistic speculation: 100% = user research + data; 80% = qualitative feedback; 50% = gut feel.',
      'Cost of Delay (CoD): How much revenue, SLA penalty, or competitive ground is lost for every week this feature does NOT ship.'
    ],
    content_body: `### Economic Decision-Making for Technical Roadmaps
A common trap in enterprise delivery is treating all backlog requests as equal priority. When everything is "High Priority", nothing is prioritized.

### Weighted Shortest Job First (WSJF)
Adopted from Lean manufacturing and SAFe:
\`\`\`
WSJF = Cost of Delay / Job Duration (Effort)
\`\`\`
A small feature that takes 1 sprint to ship with a $50k/month savings yield beats a 6-month monster initiative with questionable adoption. Always deliver the shortest job that delivers outsized economic relief first.`
  },
  {
    week_number: 10,
    phase_number: 3,
    title: 'Outcome-Based Thinking & OKR Architecture',
    skillset: 'Product Strategy',
    skillset_priority: 'P1 - High-Value Differentiator',
    learning_goal: 'Decouple outputs (shipping features) from outcomes (measurable customer & business value); build structured KPI trees and resilient quarterly OKRs.',
    action_item: 'Define 1 strategic Objective and 3 measurable Key Results for the dealer platform that tie directly to workshop throughput and customer turnaround reduction.',
    read_time: '7 min read',
    key_takeaways: [
      'Output = what you build (e.g. "Shipped Bluetooth OBD-II scanner integration"). Outcome = how customer behavior or business value changes (e.g. "Intake diagnostic time decreased by 35%").',
      'An Objective must be qualitative, ambitious, and memorable. A Key Result must be quantitative, measurable, and verifiable.',
      'Good Key Results measure either: baseline to target ("from 12% to 4%"), rate of change, or milestone quality gates.',
      'Avoid binary Key Results ("Launch feature X"). If you launch feature X and nobody uses it, your OKR failed.'
    ],
    content_body: `### Shifting from Feature Factory to Business Value
In services companies and enterprise IT, teams often celebrate "We delivered 18 user stories this sprint!" But if workshop throughput did not increase, the client received zero ROI.

### Anatomy of an Executive OKR
- **Objective**: Establish the dealer platform as the benchmark for rapid, zero-friction automotive workshop intake.
- **KR 1**: Reduce median vehicle check-in turnaround time from 14.5 min to < 5.0 min across 80 pilot dealerships.
- **KR 2**: Increase digital customer pre-authorization rate from 18% to 65% prior to vehicle bay entry.
- **KR 3**: Maintain platform uptime of 99.95% during morning peak rush (07:30 to 10:00 AM local time).`
  },
  {
    week_number: 11,
    phase_number: 3,
    title: 'Executive Communication & The Minto Pyramid Principle',
    skillset: 'Executive Communication',
    skillset_priority: 'P0 - Core TPM Discipline',
    learning_goal: 'Communicate top-down: state the Answer/Recommendation first, structure supporting arguments via SCQA (Situation, Complication, Question, Answer), and master 1-page executive memos.',
    action_item: 'Rewrite an upcoming milestone delay or architecture decision memo into a crisp, 1-page executive brief structured strictly according to the Minto Pyramid Principle.',
    read_time: '8 min read',
    key_takeaways: [
      'Engineers communicate bottom-up (Context -> Experiment -> Data -> Conclusion). Executives think top-down (Recommendation -> Impact -> Supporting Logic).',
      'The Minto Pyramid Principle: State your Answer/Recommendation in the first sentence. Supporting arguments must be MECE (Mutually Exclusive, Collectively Exhaustive).',
      'The SCQA Framework: Situation (undisputed context), Complication (what changed / what broke), Question (what must we decide?), Answer (our concrete recommendation).',
      'Never send an escalation email without a proposed recommendation and trade-off comparison.'
    ],
    content_body: `### The Pyramid Principle in Technical Leadership
Developed by Barbara Minto at McKinsey, this framework transforms technical program managers from tactical coordinators into trusted strategic advisors.

### SCQA Executive Memo Breakdown
1. **Situation**: *"The Dealer Platform v2.0 rollout is scheduled across 120 dealer locations on November 15th."*
2. **Complication**: *"During high-concurrency load testing yesterday, the third-party OEM parts inventory API failed at 450 requests/sec, causing timeout cascades."*
3. **Question**: *"Should we delay the launch or proceed with a cached fallback architecture?"*
4. **Answer (Recommendation First)**: *"We recommend launching on schedule on Nov 15th with an asynchronous Redis cache fallback. This preserves the launch date while eliminating OEM API dependency risk."*`,
    actionable_template: `### Executive 1-Page Decision Memo Template

**TO**: Executive Steering Committee
**FROM**: Technical Program Lead
**DATE**: Current Date
**SUBJECT**: Recommendation on Workshop Intake v2.0 Rollout & OEM API Resilience

---

### Executive Summary (Answer First)
We recommend launching Platform v2.0 on November 15th as planned by enabling an asynchronous Redis cache-aside fallback for OEM parts inventory. This protects the committed launch date, guarantees < 250ms UI latency, and limits external dependency failure impact.

### Context (Situation & Complication)
- **Situation**: Intake v2.0 is validated across 15 pilot workshops with a 65% reduction in intake turnaround time.
- **Complication**: Load testing exposed that the OEM parts catalog API throttles at 400 req/sec, failing our target peak threshold of 1,200 req/sec.

### Options Evaluated

| Option | Launch Date | Engineering Effort | Risk Profile | Recommendation |
|:---|:---:|:---:|:---|:---:|
| **Option A: Deploy Redis Cache Fallback** | Nov 15 (On Schedule) | 3 Developer Days | Low (uses proven caching layer) | **RECOMMENDED** |
| **Option B: Delay Rollout until OEM Upgrades** | Dec 15 (+30 Days) | 0 Days | High (OEM roadmap uncertain) | Rejected |
| **Option C: Disable Parts Inventory in v1** | Nov 15 (On Schedule) | 1 Developer Day | Medium (degrades advisor UX) | Fallback |

### Next Steps & Action Required
1. Approve 3 developer days to finalize Redis cache-aside TTL.
2. Sign-off from OEM integration lead by Friday 5:00 PM.`
  },
  {
    week_number: 12,
    phase_number: 3,
    title: 'AI-Augmented PM & TPM Workflows',
    skillset: 'Executive Communication',
    skillset_priority: 'P2 - Growth Skillset',
    learning_goal: 'Harness LLMs for PRD generation, meeting transcription synthesis, synthetic user testing, automated test case drafting, and agentic delivery triage.',
    action_item: 'Construct a reusable system prompt workflow that ingests messy client meeting notes and generates an initial PRD draft with edge cases and acceptance criteria.',
    read_time: '7 min read',
    key_takeaways: [
      'LLMs are not replacements for product strategy; they are reasoning engines that compress synthesis time from hours to minutes.',
      'Use structured system prompts with few-shot examples to convert meeting audio transcripts into RAID logs and Jira tickets.',
      'Prompt chaining: Step 1 extracts raw decisions; Step 2 stress-tests assumptions; Step 3 formats into Jira markdown.',
      'Synthetic user testing: Instruct models to roleplay skeptical workshop advisors or strict security compliance reviewers to identify edge cases before sprint planning.'
    ],
    content_body: `### The Modern AI-Augmented Program Leader
The future TPM does not spend 4 hours typing meeting minutes or formatting ticket backlogs. You leverage LLM pipelines to accelerate administrative overhead so you can focus on stakeholder negotiation, architectural trade-offs, and critical path governance.

### Production TPM Prompt Pipeline
\`\`\`
Role: Principal Technical Program Manager
Task: Ingest the attached raw transcript of a client workshop review.
Outputs:
1. Decision Log (What was definitively agreed upon)
2. Open Blockers with named owners
3. Three unstated architectural risks or edge cases
4. Gherkin acceptance criteria for the top feature request
\`\`\``
  }
];

export const initialBacklogTopics = [
  {
    title: 'Kafka Event Streaming for Automotive IoT',
    description: 'Understand event-driven architecture, partition keys, consumer groups, and ordering guarantees for workshop telematics.',
    skillset: 'Technical Architecture',
    priority: 'high',
    skillset_priority: 'P1 - High-Value Differentiator',
    status: 'next',
    tags: ['Architecture', 'Streaming', 'Automotive']
  },
  {
    title: 'GraphQL vs gRPC for Microservices',
    description: 'Evaluate protocol buffers and binary serialization for high-throughput internal service communication.',
    skillset: 'Technical Architecture',
    priority: 'medium',
    skillset_priority: 'P1 - High-Value Differentiator',
    status: 'someday',
    tags: ['APIs', 'Backend']
  },
  {
    title: 'FinOps & Cloud Cost Optimization for TPMs',
    description: 'Learn AWS/Azure compute cost allocation, reserved instances, auto-scaling thresholds, and unit economics.',
    skillset: 'Program Management',
    priority: 'low',
    skillset_priority: 'P2 - Growth Skillset',
    status: 'someday',
    tags: ['Cloud', 'Operations']
  }
];
