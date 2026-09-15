export const phasesData = [
  {
    phase_number: 1,
    title: 'Phase 1: Program Management Rigor',
    description: 'Master core TPM discipline: structured requirements, quantitative risk governance, delivery velocity, and cross-functional dependency management.'
  },
  {
    phase_number: 2,
    title: 'Phase 2: Technical Fluency',
    description: 'Deepen system-level engineering judgment: RESTful contracts, distributed system fundamentals, quality engineering, and SQL telemetry analytics.'
  },
  {
    phase_number: 3,
    title: 'Phase 3: Product & Executive Communication',
    description: 'Elevate strategic impact: mathematical prioritization frameworks, outcome-based OKRs, top-down Pyramid Principle briefing, and AI-augmented PM workflows.'
  }
];

export const weeksData = [
  // --- PHASE 1 ---
  {
    week_number: 1,
    phase_number: 1,
    title: 'RAID Logs & Proactive Risk Governance',
    learning_goal: 'Construct an executive-grade RAID log (Risks, Assumptions, Issues, Dependencies) with qualitative & quantitative severity scoring and automated escalation triggers.',
    action_item: 'Audit your active automotive dealer-workshop platform delivery: identify top 3 unmitigated technical risks and present a 1-page risk heatmap with mitigation owners at the next sync.',
    resources: [
      {
        title: 'Project Risk Management & Proactive Governance',
        url: 'https://martinfowler.com/articles/work-breakdown-structure.html',
        domain: 'martinfowler.com'
      },
      {
        title: 'How High-Performing TPMs Manage Technical Risk',
        url: 'https://blog.pragmaticengineer.com/tpm-role-in-tech/',
        domain: 'blog.pragmaticengineer.com'
      }
    ]
  },
  {
    week_number: 2,
    phase_number: 1,
    title: 'Structured Requirements Architecture (PRD / BRD / INVEST)',
    learning_goal: 'Master crisp specification writing: business intent vs engineering constraints, INVEST user stories, edge-case modeling, and unambiguous acceptance criteria.',
    action_item: 'Write a comprehensive 2-page PRD for an upcoming workshop booking or parts-inventory microservice feature, complete with happy-path and fallback scenarios.',
    resources: [
      {
        title: 'How to Write a Crisp, Actionable PRD',
        url: 'https://www.lennysnewsletter.com/p/how-to-write-a-great-prd',
        domain: 'lennysnewsletter.com'
      },
      {
        title: 'Atlassian Agile Coach: Writing Bulletproof Acceptance Criteria',
        url: 'https://www.atlassian.com/agile/project-management/user-stories',
        domain: 'atlassian.com'
      }
    ]
  },
  {
    week_number: 3,
    phase_number: 1,
    title: 'Delivery Metrics & Team Predictability (Velocity, Cycle Time, CFD)',
    learning_goal: 'Shift from subjective estimation to empirical predictability using Cycle Time distributions, Lead Time, Sprint Velocity, and Cumulative Flow Diagrams (CFD).',
    action_item: 'Extract the last 30 days of JIRA/tracker data for your delivery team. Plot Cycle Time percentiles (p50, p85, p95) and isolate the top bottleneck stage.',
    resources: [
      {
        title: 'Measuring Engineering Productivity & Delivery Flow',
        url: 'https://blog.pragmaticengineer.com/engineering-productivity/',
        domain: 'blog.pragmaticengineer.com'
      },
      {
        title: 'Actionable Agile Metrics for Predictability (Daniel Vacanti)',
        url: 'https://actionableagile.com/resources/cumulative-flow-diagram/',
        domain: 'actionableagile.com'
      }
    ]
  },
  {
    week_number: 4,
    phase_number: 1,
    title: 'Cross-Functional Dependency Mapping & Steering Governance',
    learning_goal: 'Map multi-team critical path dependencies, align cross-functional tech leads, and run high-cadence steering committee reviews without administrative bloat.',
    action_item: 'Create a visual dependency matrix linking the dealer portal frontend, integration middleware, and client OEM ERP endpoints with clear SLA expectations.',
    resources: [
      {
        title: 'Spotify Engineering: Managing Cross-Team Dependencies at Scale',
        url: 'https://engineering.atspotify.com/',
        domain: 'engineering.atspotify.com'
      },
      {
        title: 'Executive Steering Committees: Running Reviews That Drive Decisions',
        url: 'https://stripe.com/blog/engineering',
        domain: 'stripe.com'
      }
    ]
  },

  // --- PHASE 2 ---
  {
    week_number: 5,
    phase_number: 2,
    title: 'REST APIs, Contracts & Integration Architecture',
    learning_goal: 'Understand OpenAPI/Swagger specs, HTTP methods and status codes, payload design, idempotency keys, rate limiting, and webhook resilience patterns.',
    action_item: 'Inspect one core API payload between the workshop booking service and inventory backend; document contract invariants and draft an OpenAPI 3.0 snippet.',
    resources: [
      {
        title: 'Zalando RESTful API Guidelines & Best Practices',
        url: 'https://opensource.zalando.com/restful-api-guidelines/',
        domain: 'opensource.zalando.com'
      },
      {
        title: 'Designing Robust Webhooks & Idempotent APIs (Stripe Engineering)',
        url: 'https://stripe.com/blog/designing-robust-apis',
        domain: 'stripe.com'
      }
    ]
  },
  {
    week_number: 6,
    phase_number: 2,
    title: 'System Design Fundamentals for TPMs',
    learning_goal: 'Master technical architecture trade-offs: monolith vs microservices, Redis caching patterns, load balancers, database scaling, CAP theorem, and message queues.',
    action_item: 'Produce a clean C4 architectural diagram of your platform service illustrating load balancers, caching layer, primary DB, and external dealer ERP interfaces.',
    resources: [
      {
        title: 'System Design Primer for Technical Program Managers',
        url: 'https://github.com/donnemartin/system-design-primer',
        domain: 'github.com'
      },
      {
        title: 'High Scalability: Architecture Patterns of High-Throughput Services',
        url: 'http://highscalability.com/',
        domain: 'highscalability.com'
      }
    ]
  },
  {
    week_number: 7,
    phase_number: 2,
    title: 'Quality Engineering, Mobile & CI/CD Pipelines',
    learning_goal: 'Internalize the testing pyramid (unit, integration, contract, E2E), mobile release management, automated regression gates, feature flags, and canary deployments.',
    action_item: 'Audit your current release pipeline: draft a feature flag rollout strategy that limits blast radius to 5% of dealer workshops on day one.',
    resources: [
      {
        title: 'Martin Fowler: Feature Toggles (Feature Flags) Architecture',
        url: 'https://martinfowler.com/articles/feature-toggles.html',
        domain: 'martinfowler.com'
      },
      {
        title: 'Google Testing Blog: Practical Test Pyramids in Production',
        url: 'https://testing.googleblog.com/',
        domain: 'testing.googleblog.com'
      }
    ]
  },
  {
    week_number: 8,
    phase_number: 2,
    title: 'SQL Fundamentals & Data-Driven Delivery Telemetry',
    learning_goal: 'Master multi-table JOINs, GROUP BY aggregations, window functions (ROW_NUMBER, LAG/LEAD), and querying system telemetry logs directly from production replicas.',
    action_item: 'Write and execute a SQL query against platform test/staging logs to identify peak workshop booking hours and average service turnaround time by dealer location.',
    resources: [
      {
        title: 'Mode Analytics: Advanced SQL Guide for Product & Tech Leaders',
        url: 'https://mode.com/sql-tutorial/',
        domain: 'mode.com'
      },
      {
        title: 'PostgreSQL Window Functions Explained Visually',
        url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
        domain: 'postgresql.org'
      }
    ]
  },

  // --- PHASE 3 ---
  {
    week_number: 9,
    phase_number: 3,
    title: 'Prioritization Frameworks (RICE, MoSCoW, Cost of Delay / WSJF)',
    learning_goal: 'Defend roadmap decisions objectively: weigh Reach, Impact, Confidence, and Effort; master Weighted Shortest Job First (WSJF) and economic Cost of Delay.',
    action_item: 'Score the next 10 feature requests from dealer workshop managers using RICE; present the ranked matrix to your business product sponsor.',
    resources: [
      {
        title: 'Intercom on Product: Mastering Prioritization with RICE',
        url: 'https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/',
        domain: 'intercom.com'
      },
      {
        title: 'Black Swan Farming: Understanding and Calculating Cost of Delay',
        url: 'https://blackswanfarming.com/cost-of-delay/',
        domain: 'blackswanfarming.com'
      }
    ]
  },
  {
    week_number: 10,
    phase_number: 3,
    title: 'Outcome-Based Thinking & OKR Architecture',
    learning_goal: 'Decouple outputs (shipping features) from outcomes (measurable customer & business value); build structured KPI trees and resilient quarterly OKRs.',
    action_item: 'Define 1 strategic Objective and 3 measurable Key Results for the dealer platform that tie directly to workshop throughput and customer turnaround reduction.',
    resources: [
      {
        title: 'John Doerr & Christina Wodtke: Designing High-Impact OKRs',
        url: 'https://www.whatmatters.com/get-started',
        domain: 'whatmatters.com'
      },
      {
        title: 'Outcome-Driven Roadmaps vs Feature Factories (John Cutler)',
        url: 'https://cutlefish.substack.com/',
        domain: 'cutlefish.substack.com'
      }
    ]
  },
  {
    week_number: 11,
    phase_number: 3,
    title: 'Executive Communication & The Minto Pyramid Principle',
    learning_goal: 'Communicate top-down: state the Answer/Recommendation first, structure supporting arguments via SCQA (Situation, Complication, Question, Answer), and master 1-page executive memos.',
    action_item: 'Rewrite an upcoming milestone delay or architecture decision memo into a crisp, 1-page executive brief structured strictly according to the Minto Pyramid Principle.',
    resources: [
      {
        title: 'McKinsey & Barbara Minto: The Pyramid Principle in Practice',
        url: 'https://medium.com/lessons-from-mckinsey/the-pyramid-principle-f0085dd60ec3',
        domain: 'medium.com'
      },
      {
        title: 'Amazon 1-Pager & 6-Pager Writing Culture for Program Leaders',
        url: 'https://www.allthingsdistributed.com/',
        domain: 'allthingsdistributed.com'
      }
    ]
  },
  {
    week_number: 12,
    phase_number: 3,
    title: 'AI-Augmented PM & TPM Workflows',
    learning_goal: 'Harness LLMs for PRD generation, meeting transcription synthesis, synthetic user testing, automated test case drafting, and agentic delivery triage.',
    action_item: 'Construct a reusable system prompt workflow that ingests messy client meeting notes and generates an initial PRD draft with edge cases and acceptance criteria.',
    resources: [
      {
        title: 'Ethan Mollick: Co-Intelligence — AI Workflows for Knowledge Leaders',
        url: 'https://www.oneusefulthing.org/',
        domain: 'oneusefulthing.org'
      },
      {
        title: 'OpenAI Cookbook: Practical Engineering & Product Automation',
        url: 'https://cookbook.openai.com/',
        domain: 'cookbook.openai.com'
      }
    ]
  }
];

export const initialBacklogTopics = [
  {
    title: 'Kafka Event Streaming for Automotive IoT',
    description: 'Understand event-driven architecture, partition keys, consumer groups, and ordering guarantees for workshop telematics.',
    priority: 'high',
    status: 'next',
    tags: ['Architecture', 'Streaming', 'Automotive']
  },
  {
    title: 'GraphQL vs gRPC for Microservices',
    description: 'Evaluate protocol buffers and binary serialization for high-throughput internal service communication.',
    priority: 'medium',
    status: 'someday',
    tags: ['APIs', 'Backend']
  },
  {
    title: 'FinOps & Cloud Cost Optimization for TPMs',
    description: 'Learn AWS/Azure compute cost allocation, reserved instances, auto-scaling thresholds, and unit economics.',
    priority: 'low',
    status: 'someday',
    tags: ['Cloud', 'Operations']
  }
];
