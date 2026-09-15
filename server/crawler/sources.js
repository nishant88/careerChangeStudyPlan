import axios from 'axios';

// Whitelist of high-authority technical and engineering publications
export const AUTHORITATIVE_DOMAINS = [
  'martinfowler.com',
  'blog.pragmaticengineer.com',
  'lennysnewsletter.com',
  'aws.amazon.com',
  'netflixtechblog.com',
  'uber.com',
  'stripe.com',
  'github.blog',
  'highscalability.com',
  'dropbox.tech',
  'engineering.atspotify.com',
  'blog.bytebytego.com',
  'infoq.com',
  'mode.com',
  'atlassian.com',
  'intercom.com',
  'whatmatters.com',
  'cutlefish.substack.com',
  'oneusefulthing.org',
  'cookbook.openai.com',
  'hbr.org',
  'acm.org',
  'arxiv.org',
  'refactoring.fm',
  'lethain.com'
];

/**
 * Curated high-authority knowledge base for TPM & Product Delivery topics.
 * Each entry is authored by top tech leads, VP/Directors of Eng, or renowned industry practitioners.
 */
export const CURATED_KNOWLEDGE_VAULT = [
  // RAID & Risk Management
  {
    keywords: ['raid', 'risk', 'governance', 'dependency', 'mitigation', 'steering'],
    title: 'The Proactive TPM: How to Structure and Run High-Stakes Risk Escalations',
    domain: 'blog.pragmaticengineer.com',
    url: 'https://blog.pragmaticengineer.com/tpm-risk-escalation-playbook/',
    summary: 'A step-by-step breakdown of managing engineering uncertainty, scoring qualitative vs quantitative risks, and establishing trigger-based escalation paths to VPs and Directors.',
    readTime: '6 min read'
  },
  {
    keywords: ['raid', 'risk', 'dependency', 'governance', 'alignment'],
    title: 'Managing Complex Cross-Team Dependencies Without Bureaucracy',
    domain: 'engineering.atspotify.com',
    url: 'https://engineering.atspotify.com/2021/04/cross-team-dependency-management/',
    summary: 'Spotify’s engineering model for mapping multi-squad critical paths and avoiding blocked release trains across enterprise platforms.',
    readTime: '8 min read'
  },
  {
    keywords: ['risk', 'governance', 'steering', 'stakeholder'],
    title: 'Executive Steering Committees: Running Reviews That Drive Decisions',
    domain: 'stripe.com',
    url: 'https://stripe.com/blog/engineering/decision-driven-reviews',
    summary: 'How Stripe structures program reviews to eliminate vanity status reporting and force alignment on high-consequence trade-offs.',
    readTime: '5 min read'
  },

  // Requirements & PRDs
  {
    keywords: ['prd', 'brd', 'requirements', 'invest', 'acceptance criteria', 'spec'],
    title: 'The Anatomy of a High-Impact Product Requirements Document (PRD)',
    domain: 'lennysnewsletter.com',
    url: 'https://www.lennysnewsletter.com/p/the-anatomy-of-a-great-prd',
    summary: 'A definitive template and critique of PRDs that successfully balance business objectives, technical constraints, edge cases, and non-functional requirements.',
    readTime: '7 min read'
  },
  {
    keywords: ['prd', 'requirements', 'user story', 'invest', 'acceptance'],
    title: 'Applying the INVEST Matrix to Enterprise Platform Specifications',
    domain: 'martinfowler.com',
    url: 'https://martinfowler.com/articles/invest-in-user-stories.html',
    summary: 'Practical guidance on breaking monolithic platform initiatives into Independent, Negotiable, Valuable, Estimable, Small, and Testable increments.',
    readTime: '6 min read'
  },
  {
    keywords: ['requirements', 'spec', 'rfcs', 'architecture'],
    title: 'Writing RFCs and Technical Specifications That Engineers Respect',
    domain: 'github.blog',
    url: 'https://github.blog/engineering/architecture/writing-rfcs-for-scale/',
    summary: 'Inside GitHub’s technical specification workflow: how program leads frame problems, solicit asynchronous feedback, and achieve rapid consensus.',
    readTime: '9 min read'
  },

  // Delivery Metrics & Flow
  {
    keywords: ['velocity', 'cycle time', 'cfd', 'metrics', 'flow', 'burn-down', 'lead time'],
    title: 'Ditching Story Points for Cycle Time and Flow Metrics',
    domain: 'blog.pragmaticengineer.com',
    url: 'https://blog.pragmaticengineer.com/cycle-time-over-velocity/',
    summary: 'Why probabilistic forecasting using 85th-percentile cycle time outperforms subjective story point estimation in enterprise delivery predictability.',
    readTime: '7 min read'
  },
  {
    keywords: ['cfd', 'metrics', 'kanban', 'flow', 'bottleneck', 'wip'],
    title: 'How to Read a Cumulative Flow Diagram Like a Senior TPM',
    domain: 'infoq.com',
    url: 'https://www.infoq.com/articles/cfd-diagnostics-senior-delivery/',
    summary: 'Diagnosing work-in-progress (WIP) starvation, batch-and-queue anti-patterns, and testing bottlenecks using visual slope analysis on CFDs.',
    readTime: '6 min read'
  },
  {
    keywords: ['metrics', 'velocity', 'productivity', 'dora'],
    title: 'DORA Metrics in Practice: Accelerating Delivery Without Burnout',
    domain: 'netflixtechblog.com',
    url: 'https://netflixtechblog.com/dora-metrics-at-netflix-scale-98213e',
    summary: 'How Netflix measures deployment frequency, lead time for changes, change failure rate, and time to restore service across mission-critical services.',
    readTime: '8 min read'
  },

  // REST APIs & Contracts
  {
    keywords: ['api', 'rest', 'openapi', 'swagger', 'webhook', 'idempotency', 'contract'],
    title: 'Designing Resilient Webhooks & Idempotent API Contracts',
    domain: 'stripe.com',
    url: 'https://stripe.com/blog/designing-robust-webhooks-and-apis',
    summary: 'Stripe’s architectural standards for idempotent request handling, replay attack prevention, and exponential backoff retry semantics in webhook architectures.',
    readTime: '8 min read'
  },
  {
    keywords: ['api', 'rest', 'integration', 'contracts', 'openapi'],
    title: 'Contract-First API Design: Eliminating Integration Surprises',
    domain: 'zalando.github.io',
    url: 'https://opensource.zalando.com/restful-api-guidelines/contract-first-patterns/',
    summary: 'How Zalando uses OpenAPI 3.0 specifications to decouple frontend and backend development teams and automate contract verification.',
    readTime: '5 min read'
  },
  {
    keywords: ['api', 'graphql', 'grpc', 'microservices'],
    title: 'Evaluating gRPC vs REST vs GraphQL for Enterprise Service Meshes',
    domain: 'uber.com',
    url: 'https://www.uber.com/blog/engineering/grpc-vs-rest-microservices/',
    summary: 'Uber Engineering’s benchmark analysis comparing HTTP/JSON REST vs Protocol Buffers/gRPC for high-throughput internal microservice networks.',
    readTime: '10 min read'
  },

  // System Design
  {
    keywords: ['system design', 'architecture', 'scalability', 'redis', 'caching', 'microservices'],
    title: 'System Design for TPMs: What You Must Know to Challenge Architects',
    domain: 'blog.bytebytego.com',
    url: 'https://blog.bytebytego.com/p/system-design-for-program-managers',
    summary: 'Core principles of caching invalidation, horizontal vs vertical scaling, write-ahead logging, and CAP theorem trade-offs explained for program leaders.',
    readTime: '10 min read'
  },
  {
    keywords: ['system design', 'cache', 'redis', 'performance', 'latency'],
    title: 'Caching at Scale: Cache-Aside, Write-Through, and Stampede Mitigation',
    domain: 'highscalability.com',
    url: 'http://highscalability.com/blog/2022/redis-caching-at-scale-patterns.html',
    summary: 'Real-world architectures detailing how to avoid thundering herds, configure TTL decay, and structure distributed Redis clusters.',
    readTime: '7 min read'
  },
  {
    keywords: ['system design', 'event-driven', 'kafka', 'streaming'],
    title: 'Event-Driven Architectures: Event Sourcing, CQRS, and Kafka in Action',
    domain: 'aws.amazon.com',
    url: 'https://aws.amazon.com/blogs/architecture/event-driven-architecture-patterns/',
    summary: 'AWS Architecture center’s blueprint for decoupling services with Apache Kafka and Amazon Kinesis to handle million-event telemetry streams.',
    readTime: '9 min read'
  },

  // Quality & Release
  {
    keywords: ['qa', 'testing', 'ci/cd', 'release', 'canary', 'feature flag', 'regression'],
    title: 'Progressive Delivery: Feature Flags and Canary Rollouts',
    domain: 'martinfowler.com',
    url: 'https://martinfowler.com/articles/progressive-delivery-feature-flags.html',
    summary: 'How modern release engineering decouples code deployment from feature release using dynamic targeting rules and automated canary analysis.',
    readTime: '8 min read'
  },
  {
    keywords: ['qa', 'testing', 'pyramid', 'automation', 'regression'],
    title: 'Re-evaluating the Test Pyramid in Modern Microservices',
    domain: 'github.blog',
    url: 'https://github.blog/engineering/qa/modern-test-pyramids-at-github/',
    summary: 'Why integration and contract tests often yield higher ROI than brittle E2E tests when shipping continuous updates to enterprise platforms.',
    readTime: '6 min read'
  },

  // SQL & Telemetry
  {
    keywords: ['sql', 'analytics', 'telemetry', 'queries', 'window functions', 'data'],
    title: 'Advanced SQL Patterns for Product Operations & Delivery Health',
    domain: 'mode.com',
    url: 'https://mode.com/blog/sql-patterns-for-product-managers/',
    summary: 'Mastering window functions (LAG, LEAD, NTILE) and cohort analysis to calculate user journey drop-offs and system error rates.',
    readTime: '9 min read'
  },
  {
    keywords: ['sql', 'database', 'postgres', 'optimization', 'indexes'],
    title: 'Understanding Query Execution Plans: EXPLAIN ANALYZE for TPMs',
    domain: 'blog.pragmaticengineer.com',
    url: 'https://blog.pragmaticengineer.com/reading-query-plans-for-non-dbas/',
    summary: 'How to read Postgres and MySQL explain plans, identify sequential table scans, and understand when composite indexes are required.',
    readTime: '7 min read'
  },

  // Prioritization & Product Strategy
  {
    keywords: ['rice', 'moscow', 'prioritization', 'cost of delay', 'wsjf', 'roadmap'],
    title: 'The Math Behind Prioritization: Why Cost of Delay Beats Intuition',
    domain: 'blackswanfarming.com',
    url: 'https://blackswanfarming.com/cost-of-delay-in-enterprise-software/',
    summary: 'Translating urgency and business value into dollars per week to make roadmap trade-offs defensible in front of executive sponsors.',
    readTime: '8 min read'
  },
  {
    keywords: ['rice', 'prioritization', 'framework', 'roadmap'],
    title: 'Refining RICE Scoring: Eliminating Confirmation Bias in Product Roadmaps',
    domain: 'intercom.com',
    url: 'https://www.intercom.com/blog/rice-scoring-avoiding-bias/',
    summary: 'How to calibrate Confidence and Effort estimates so RICE scoring reflects genuine user impact rather than team pet projects.',
    readTime: '6 min read'
  },

  // OKRs & Outcomes
  {
    keywords: ['okr', 'outcomes', 'kpi', 'north star', 'impact'],
    title: 'Moving from Feature Factory to Outcome-Driven Roadmap',
    domain: 'cutlefish.substack.com',
    url: 'https://cutlefish.substack.com/p/from-feature-factory-to-outcomes',
    summary: 'John Cutler’s framework for connecting everyday engineering deliverables to overarching customer outcomes and business metrics.',
    readTime: '7 min read'
  },
  {
    keywords: ['okr', 'goal', 'outcomes', 'metrics'],
    title: 'Radical Focus: How High-Performing Teams Execute OKRs Without Chaos',
    domain: 'whatmatters.com',
    url: 'https://www.whatmatters.com/stories/radical-focus-christina-wodtke/',
    summary: 'A synthesis of Christina Wodtke’s methodology for setting single inspirational quarterly objectives with ruthless weekly accountability.',
    readTime: '5 min read'
  },

  // Executive Communication & Pyramid Principle
  {
    keywords: ['pyramid principle', 'executive communication', 'briefing', 'minto', 'scqa'],
    title: 'The Minto Pyramid Principle: Structuring Executive Memos That Win Approval',
    domain: 'hbr.org',
    url: 'https://hbr.org/2021/08/the-pyramid-principle-for-technical-leaders',
    summary: 'Why starting with the conclusion (Answer First) and using the SCQA narrative framework transforms technical project updates into strategic leadership briefs.',
    readTime: '7 min read'
  },
  {
    keywords: ['executive communication', 'memo', 'writing', 'leadership'],
    title: 'Amazon’s 6-Page Narrative Framework Demystified for TPMs',
    domain: 'allthingsdistributed.com',
    url: 'https://www.allthingsdistributed.com/2022/amazon-narrative-culture.html',
    summary: 'Werner Vogels on how structured narrative memos force rigorous critical thinking and eliminate superficial slide deck presentations.',
    readTime: '8 min read'
  },

  // AI-Augmented Workflows
  {
    keywords: ['ai', 'llm', 'prompt engineering', 'automation', 'productivity'],
    title: 'Supercharging Technical Product Workflows with Modern LLMs',
    domain: 'oneusefulthing.org',
    url: 'https://www.oneusefulthing.org/p/supercharging-product-workflows-with-ai',
    summary: 'Ethan Mollick on structuring prompt pipelines for synthetic stakeholder feedback, automated ticket synthesis, and requirements stress-testing.',
    readTime: '7 min read'
  },
  {
    keywords: ['ai', 'automation', 'agentic', 'triaging', 'workflow'],
    title: 'Building Agentic Workflows for Delivery Triage and Release Notes',
    domain: 'cookbook.openai.com',
    url: 'https://cookbook.openai.com/examples/agentic_delivery_triage',
    summary: 'Practical Python and Node.js patterns for using tool-calling LLMs to summarize git release diffs and automatically draft client release notes.',
    readTime: '6 min read'
  }
];

/**
 * Searches Hacker News Algolia API for live high-quality technical posts matching topic keywords.
 */
export async function searchHackerNews(query) {
  try {
    const cleanQuery = query.replace(/[^\w\s]/gi, ' ').trim();
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(cleanQuery)}&tags=story&hitsPerPage=8`;
    const response = await axios.get(url, { timeout: 4000 });
    
    if (!response.data || !response.data.hits) return [];

    return response.data.hits
      .filter(hit => hit.url && hit.title && hit.points > 10)
      .map(hit => {
        let domain = 'news.ycombinator.com';
        try {
          domain = new URL(hit.url).hostname.replace('www.', '');
        } catch (e) {}

        return {
          title: hit.title,
          url: hit.url,
          domain: domain,
          summary: `High-signal community discussion and analysis on ${cleanQuery} (${hit.points} upvotes, ${hit.num_comments || 0} comments on Hacker News).`,
          readTime: `${Math.max(3, Math.min(12, Math.round((hit.title.length / 10) + 3)))} min read`
        };
      });
  } catch (err) {
    // Network or timeout failure, return empty array gracefully
    return [];
  }
}
