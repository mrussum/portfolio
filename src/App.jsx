import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  ShieldCheck,
  Activity,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  Layers,
  Database,
  Code2,
  Award,
  Mail,
  Moon,
  Sun,
  Gauge,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const EVAL_VERSIONS = [
  {
    id: 'v0.1',
    label: 'v0.1 Naive Vector',
    strategy: 'Naive 512-token chunks + Dense Vector (ChromaDB)',
    recall: 0.64,
    mrr: 0.48,
    faithfulness: 74.0,
    latency: 1120,
    cost: '$0.0018',
    notes: 'High hallucination rate on multi-column VO2 max and lactate threshold tables.',
  },
  {
    id: 'v0.2',
    label: 'v0.2 Hybrid BM25+Dense',
    strategy: 'Section-aware chunks + BM25/Dense Reciprocal Rank Fusion',
    recall: 0.81,
    mrr: 0.67,
    faithfulness: 84.5,
    latency: 1340,
    cost: '$0.0021',
    notes: 'Recovered exact physiological terminology & dosing acronyms missed by dense embeddings.',
  },
  {
    id: 'v1.0',
    label: 'v1.0 Production Hybrid + Rerank',
    strategy: 'Hybrid RRF + Cross-Encoder Reranker + Pydantic Citation Guardrails',
    recall: 0.92,
    mrr: 0.83,
    faithfulness: 91.0,
    latency: 1680,
    cost: '$0.0026',
    notes: 'Production SLA met (<2.5s p95). Abstention threshold (<0.35 logit) eliminated unsupported claims.',
  },
];

const CASE_STUDIES = [
  {
    id: 'ffs',
    badge: 'Flagship Production AI & Telemetry',
    title: 'Citation-Grounded Sports Science RAG & Digital-Twin Platform',
    client: 'Future Faster Sports (Sole Technical Lead & AI Engineer)',
    metrics: [
      { label: 'Lookup Time', value: '30m → <1m', sub: '96% reduction' },
      { label: 'Answer Accuracy', value: '~90%', sub: '100-Q golden set' },
      { label: 'Telemetry Ingestion', value: '~2M pts/day', sub: '<300ms p95 refresh' },
      { label: 'Commercial Impact', value: '£400K', sub: 'Investor & B2B pipeline' },
    ],
    problem:
      'Sports scientists and biomechanics analysts spent ~30 minutes per query manually cross-referencing 1,200+ dense PDFs to validate equine training protocols. Standard LLM tools hallucinated physiological dosages—unacceptable in commercial performance environments.',
    architecture: [
      'Layout-aware PDF parsing with section-header chunking across 1,200 sports-science papers',
      'Hybrid retrieval combining dense vector similarity with BM25 lexical matching via Reciprocal Rank Fusion',
      'Cross-Encoder reranker narrowing Top-25 candidates down to Top-5 high-precision evidence blocks',
      'Strict Pydantic JSON schema enforcement + FastAPI streaming to React analyst UI with inline page citations',
    ],
    guardrails: [
      'Abstention over Hallucination: Reranker logit threshold (<0.35) bypasses LLM generation and returns "Insufficient literature evidence".',
      'Deterministic Citation Verification: Post-generation AST/regex verifier checks every [DocID, Page] tag against retrieved chunks before streaming.',
    ],
    retrospective: [
      'Replace general PDF text extractors with Vision-Language Model (VLM) table extraction upfront—mangled multi-column lactate tables caused half of early retrieval misses.',
      'Instrument explicit analyst thumbs-up/down telemetry from day one to automatically feed edge cases into the CI regression suite.',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'LangChain', 'ChromaDB', 'OpenAI API', 'React', 'TypeScript', 'Docker'],
  },
  {
    id: 'shaw',
    badge: 'Forward-Deployed Enterprise AI',
    title: 'Enterprise CRM Reconciliation & Claude Enterprise Rollout',
    client: 'Shaw & Co Corporate Finance (UK M&A Advisory)',
    metrics: [
      { label: 'Weekly Active Adoption', value: '~70%', sub: '120 staff in 6 weeks' },
      { label: 'Manual Admin Saved', value: '~25 hrs/wk', sub: '14 automated workflows' },
      { label: 'CRM Deduplication', value: '22% removed', sub: '15,000 contact records' },
      { label: 'Release Incidents', value: '0', sub: '4-env CI/CD governance' },
    ],
    problem:
      'A 60-person corporate finance advisory operated on a fragmented Dynamics 365 CRM with ~15,000 duplicate/stale records and manual deal-origination workflows. Leadership required an enterprise generative AI rollout across deal teams with strict confidentiality boundaries.',
    architecture: [
      'Entity-resolution pipeline (normalized domain matching + token-sort fuzzy matching) cleaning 15,000 records while preserving deal lineage',
      'Canonical firm-wide taxonomy (12 practice areas, 48 services) powering an opportunity-scoring model across 340 live M&A mandates',
      '14 automated Power Automate / Dataverse workflows integrating SharePoint & M365 across 4 isolated environments (Dev, Test, UAT, Prod)',
      'Zero-data-retention Claude Enterprise deployment with role-specific M&A prompt workflows for 120 staff',
    ],
    guardrails: [
      'Managed-solution CI/CD pipelines across 4 Power Platform environments prevented untested schema changes from touching live deal data.',
      'Strict data-boundary scoping and confidential M&A deal-team permissions configured prior to LLM onboarding.',
    ],
    retrospective: [
      'Instrument downstream deal-velocity telemetry earlier to directly correlate ML opportunity scores with mandate close rates.',
      'Launch a version-controlled internal M&A prompt & skill library on week one—adoption surged once analysts shared teaser-drafting templates.',
    ],
    stack: ['Dynamics 365', 'Dataverse', 'Power Automate', 'Claude Enterprise', 'Anthropic API', 'SharePoint / M365'],
  },
  {
    id: 'tenzing',
    badge: 'Multi-Tenant ML + LLM Action Layer',
    title: 'Cross-Portfolio SaaS Churn Intelligence & Retention Engine',
    client: 'Tenzing Private Equity (AI Sherpa Programme)',
    metrics: [
      { label: 'ARR Exposure Flagged', value: '£1.1M', sub: '420 at-risk accounts' },
      { label: 'Model Performance', value: '0.84 AUC', sub: '18,000 SaaS accounts' },
      { label: 'Portfolio Scale', value: '7 Companies', sub: 'Unified schema pipeline' },
      { label: 'Time to Production', value: '8 Weeks', sub: 'Concept to live CSM tool' },
    ],
    problem:
      'Customer Success Managers across 7 B2B SaaS portfolio companies lacked unified early-warning visibility into account churn and spent hours manually synthesizing product usage logs before outreach.',
    architecture: [
      'Multi-tenant behavioral feature engineering pipeline normalizing telemetry across 7 distinct SaaS databases (18,000 accounts)',
      'Gradient-boosted classifier (XGBoost) predicting 60-day churn probability with SHAP feature-importance attribution per account',
      'Guardrail-constrained LLM action layer translating top SHAP risk drivers into tailored CSM outreach drafts',
    ],
    guardrails: [
      'Human-in-the-loop (HITL) approval workflow: LLM drafts are surfaced as editable CRM tasks rather than auto-sent emails.',
      'Structured output constraints prevent the LLM from referencing metrics not explicitly present in the account SHAP payload.',
    ],
    retrospective: [
      'Standardize webhook event ingestion across portfolio companies using a shared dbt transformation layer to cut onboarding time for new acquisitions.',
    ],
    stack: ['Python', 'XGBoost', 'FastAPI', 'SHAP', 'LLM Structured Outputs', 'Vercel'],
  },
  {
    id: 'sensebridge',
    badge: 'End-to-End Consumer AI Product',
    title: 'SenseBridge: Real-Time Edge/Cloud Sound Recognition',
    client: 'Founder & Solo Engineer (200+ Beta Users, £15K Seed)',
    metrics: [
      { label: 'End-to-End Latency', value: '<300ms', sub: 'Real-time audio stream' },
      { label: 'Classification Accuracy', value: '~92%', sub: '14 critical sound classes' },
      { label: 'User Traction', value: '200+ Users', sub: '4.6★ rating / 38% W4 ret.' },
      { label: 'Funding Raised', value: '£15K', sub: 'Competitive seed grant' },
    ],
    problem:
      'Deaf and hard-of-hearing users need immediate, reliable visual/haptic alerts for critical environmental sounds (alarms, doorbells, sirens, crying) without battery drain or high cloud latency.',
    architecture: [
      'React Native (Expo) mobile client streaming windowed mel-spectrogram audio frames over low-latency WebSockets',
      'Custom PyTorch audio classification backend deployed on AWS with quantized inference optimization and GitHub Actions CI/CD',
    ],
    guardrails: [
      'Adaptive confidence thresholding and temporal smoothing across consecutive audio windows to eliminate false-positive haptic fatigue.',
    ],
    retrospective: [
      'Move primary inference on-device via CoreML / ExecuTorch to eliminate network dependency in underground/offline environments.',
    ],
    stack: ['PyTorch', 'Python', 'AWS', 'React Native (Expo)', 'TypeScript', 'GitHub Actions CI/CD'],
  },
];

const PROMPTFOO_CODE = `description: "Sports Science RAG - Groundedness, Citation Accuracy & Latency Benchmark"

prompts:
  - file://prompts/grounded_qa_v2.txt

providers:
  - id: python:rag_pipeline.py
    label: "Hybrid-RAG + CrossEncoder Rerank (v1.0)"
    config:
      top_k: 5
      rerank: true
      temperature: 0.0

defaultTest:
  options:
    provider: openai:gpt-4o-mini
  assert:
    # 1. Strict JSON Schema & Non-Empty Citations
    - type: is-json
    - type: javascript
      value: |
        const parsed = JSON.parse(output);
        return Array.isArray(parsed.citations) && parsed.citations.length > 0;
    # 2. Anti-Hallucination Faithfulness Rubric
    - type: llm-rubric
      value: >
        Every factual claim in 'answer' MUST be directly supported by 'retrieved_context'.
        Fail immediately if external physiological claims or ungrounded dosages appear.
    # 3. Production Latency SLA (< 2.5s)
    - type: latency
      threshold: 2500

tests: file://datasets/sports_science_golden_100.yaml`;

const PYTHON_EVAL_CODE = `def evaluate_pipeline(pipeline, golden_dataset: list[dict]) -> dict:
    recalls, mrrs, latencies, costs = [], [], [], []

    for item in golden_dataset:
        t0 = time.perf_counter()
        result = pipeline.query(item["question"])
        latency_ms = (time.perf_counter() - t0) * 1000

        retrieved_ids = [doc["doc_id"] for doc in result["chunks"]]
        recalls.append(calculate_recall_at_k(retrieved_ids, item["expected_doc_ids"], k=5))
        mrrs.append(calculate_mrr(retrieved_ids, item["expected_doc_ids"]))
        latencies.append(latency_ms)
        costs.append(result["usage"]["estimated_cost_usd"])

    return {
        "Recall@5": round(float(np.mean(recalls)), 3),       # -> 0.920
        "MRR": round(float(np.mean(mrrs)), 3),               # -> 0.830
        "p95_latency_ms": round(float(np.percentile(latencies, 95)), 1), # -> 1680.0
        "avg_cost_usd": round(float(np.mean(costs)), 5),     # -> 0.00260
    }`;

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeCaseId, setActiveCaseId] = useState('ffs');
  const [selectedEvalIdx, setSelectedEvalIdx] = useState(2);
  const [codeTab, setCodeTab] = useState('promptfoo');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const activeCase = CASE_STUDIES.find((c) => c.id === activeCaseId) || CASE_STUDIES[0];
  const activeEval = EVAL_VERSIONS[selectedEvalIdx];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mmmrussum@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeTab === 'promptfoo' ? PROMPTFOO_CODE : PYTHON_EVAL_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const bgMain = dark ? 'bg-[#0A0C10] text-slate-100' : 'bg-slate-50 text-slate-900';
  const borderCol = dark ? 'border-slate-800/90' : 'border-slate-200';
  const cardBg = dark ? 'bg-[#11151C]/90' : 'bg-white';
  const subText = dark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${bgMain}`}>
      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${borderCol} ${
          dark ? 'bg-[#0A0C10]/85' : 'bg-slate-50/85'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-sm font-bold">
              MR
            </div>
            <div>
              <span className="font-semibold tracking-tight">Michael Russum</span>
              <span className={`hidden sm:inline-block ml-2 text-xs font-mono ${subText}`}>
                / Applied AI & Forward Deployed Engineer
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#evals" className="hover:text-emerald-400 transition-colors">
              Eval Harness
            </a>
            <a href="#case-studies" className="hover:text-emerald-400 transition-colors">
              Case Studies
            </a>
            <a href="#experience" className="hover:text-emerald-400 transition-colors">
              Experience
            </a>
            <a href="#credentials" className="hover:text-emerald-400 transition-colors">
              Credentials
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className={`rounded-lg border p-2 transition-colors ${borderCol} ${
                dark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href="https://github.com/mrussum"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono font-medium transition-colors ${borderCol} ${
                dark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
              }`}
            >
              <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-24">
        {/* Hero Section */}
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for Applied AI & Forward Deployed Engineering Roles (Cambridge / London / Remote)
          </div>

          <div className="max-w-4xl space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Shipping production AI systems that survive{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                messy enterprise data.
              </span>
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed max-w-3xl ${subText}`}>
              Applied AI & Full-Stack Engineer (MSc AI, Distinction). I take LLM/RAG pipelines, ML models, and
              agentic workflows from zero to commercial production—backed by automated evaluation harnesses, strict
              citation guardrails, and measurable business ROI.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#case-studies"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Inspect Production Case Studies
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#evals"
              className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ${borderCol} ${
                dark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-100'
              }`}
            >
              <Terminal className="h-4 w-4 text-emerald-400" />
              View RAG Eval Harness
            </a>
            <button
              onClick={handleCopyEmail}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-mono transition-colors ${borderCol} ${
                dark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              {copiedEmail ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  Copied mmmrussum@gmail.com
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 text-slate-400" />
                  mmmrussum@gmail.com
                  <Copy className="h-3.5 w-3.5 opacity-60" />
                </>
              )}
            </button>
          </div>

          {/* Key Proof-of-Work Metrics Strip */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4`}>
            {[
              {
                metric: '£150K Contract',
                label: 'Sole engineer taking digital-twin & RAG platform 0→1 in 9 mos',
              },
              {
                metric: '91% Faithfulness',
                label: 'Citation-grounded RAG across 1,200 docs (30m → <1m lookup)',
              },
              {
                metric: '70% WAU Adoption',
                label: 'Claude Enterprise rollout to 120 M&A staff in 6 weeks',
              },
              {
                metric: '200+ Beta Users',
                label: 'SenseBridge PyTorch real-time audio app (<300ms latency)',
              },
            ].map((item, idx) => (
              <div key={idx} className={`rounded-xl border p-4 ${borderCol} ${cardBg}`}>
                <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">{item.metric}</div>
                <div className={`mt-1 text-xs leading-snug ${subText}`}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 1: Interactive Evaluation Suite & Benchmarks */}
        <section id="evals" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                <Gauge className="h-4 w-4" />
                Evaluation Rigor & CI Benchmarking
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Automated RAG Evaluation Harness
              </h2>
              <p className={`mt-1.5 max-w-2xl text-sm sm:text-base ${subText}`}>
                Every retrieval and prompt change is gated by a 100-question golden dataset measuring Recall@5, MRR,
                LLM-judge faithfulness, and p95 latency before deployment.
              </p>
            </div>

            <a
              href="https://github.com/mrussum"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 self-start rounded-lg border px-3.5 py-2 text-xs font-mono font-medium transition-colors ${borderCol} ${
                dark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-100'
              }`}
            >
              <Code2 className="h-4 w-4 text-emerald-400" />
              github.com/mrussum/sports-rag-evals
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left: Interactive Iteration Comparison */}
            <div className={`lg:col-span-6 rounded-2xl border p-6 flex flex-col justify-between ${borderCol} ${cardBg}`}>
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {EVAL_VERSIONS.map((ver, idx) => (
                    <button
                      key={ver.id}
                      onClick={() => setSelectedEvalIdx(idx)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                        selectedEvalIdx === idx
                          ? 'bg-emerald-500 text-slate-950 font-semibold'
                          : dark
                          ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {ver.label}
                    </button>
                  ))}
                </div>

                <div className={`rounded-xl border p-4 ${borderCol} ${dark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                  <div className="text-xs font-mono text-emerald-400">ACTIVE ARCHITECTURE</div>
                  <div className="mt-1 font-medium text-sm">{activeEval.strategy}</div>
                  <p className={`mt-2 text-xs leading-relaxed ${subText}`}>{activeEval.notes}</p>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4 pt-1">
                  {[
                    { label: 'Retrieval Recall@5', value: `${(activeEval.recall * 100).toFixed(0)}%`, pct: activeEval.recall * 100 },
                    { label: 'Mean Reciprocal Rank (MRR)', value: activeEval.mrr.toFixed(2), pct: activeEval.mrr * 100 },
                    { label: 'Answer Faithfulness (Grounded)', value: `${activeEval.faithfulness.toFixed(1)}%`, pct: activeEval.faithfulness },
                  ].map((bar) => (
                    <div key={bar.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className={subText}>{bar.label}</span>
                        <span className="font-semibold text-emerald-400">{bar.value}</span>
                      </div>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t grid grid-cols-2 gap-4 ${borderCol}`}>
                <div>
                  <div className={`text-xs font-mono ${subText}`}>p95 END-TO-END LATENCY</div>
                  <div className="text-lg font-mono font-bold mt-0.5">{activeEval.latency} ms</div>
                </div>
                <div>
                  <div className={`text-xs font-mono ${subText}`}>AVG COST / QUERY</div>
                  <div className="text-lg font-mono font-bold mt-0.5">{activeEval.cost}</div>
                </div>
              </div>
            </div>

            {/* Right: Code Inspector */}
            <div className={`lg:col-span-6 rounded-2xl border overflow-hidden flex flex-col ${borderCol} ${cardBg}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${borderCol} ${dark ? 'bg-slate-900/90' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCodeTab('promptfoo')}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors ${
                      codeTab === 'promptfoo'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : subText
                    }`}
                  >
                    promptfooconfig.yaml
                  </button>
                  <button
                    onClick={() => setCodeTab('python')}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors ${
                      codeTab === 'python'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : subText
                    }`}
                  >
                    run_retrieval_metrics.py
                  </button>
                </div>

                <button
                  onClick={handleCopyCode}
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-mono ${subText} hover:text-emerald-400`}
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy'}
                </button>
              </div>

              <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-300 bg-[#0D1017] flex-1">
                <code>{codeTab === 'promptfoo' ? PROMPTFOO_CODE : PYTHON_EVAL_CODE}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Section 2: Deep-Dive Case Studies */}
        <section id="case-studies" className="space-y-6 scroll-mt-24">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
              <Layers className="h-4 w-4" />
              Production Systems & FDE Execution
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Selected Engineering Case Studies</h2>
            <p className={`mt-1.5 max-w-2xl text-sm sm:text-base ${subText}`}>
              Architectural decisions, failure-mode guardrails, quantified outcomes, and post-launch retrospectives
              across commercial AI deployments.
            </p>
          </div>

          {/* Case Study Selector Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CASE_STUDIES.map((cs) => {
              const isSelected = cs.id === activeCaseId;
              return (
                <button
                  key={cs.id}
                  onClick={() => setActiveCaseId(cs.id)}
                  className={`text-left rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : `${borderCol} ${cardBg} hover:border-slate-600`
                  }`}
                >
                  <div className="text-[11px] font-mono text-emerald-400 truncate">{cs.badge}</div>
                  <div className="mt-1 font-semibold text-sm line-clamp-2">{cs.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Case Study Detail Card */}
          <div className={`rounded-2xl border p-6 sm:p-8 space-y-8 ${borderCol} ${cardBg}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-6 border-slate-800">
              <div>
                <span className="inline-block rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono text-emerald-400">
                  {activeCase.badge}
                </span>
                <h3 className="mt-2 text-2xl font-bold">{activeCase.title}</h3>
                <p className={`text-sm mt-1 ${subText}`}>{activeCase.client}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 max-w-md lg:justify-end">
                {activeCase.stack.map((tech) => (
                  <span
                    key={tech}
                    className={`rounded-md border px-2.5 py-1 text-xs font-mono ${borderCol} ${
                      dark ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantified Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {activeCase.metrics.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${borderCol} ${dark ? 'bg-slate-900/60' : 'bg-slate-50'}`}
                >
                  <div className={`text-xs font-mono ${subText}`}>{m.label}</div>
                  <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-emerald-400">{m.value}</div>
                  <div className={`text-xs mt-0.5 ${subText}`}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Visual System Architecture Diagram for Flagship FFS */}
            {activeCase.id === 'ffs' && (
              <div className={`rounded-xl border p-5 ${borderCol} bg-[#0D1017] text-slate-200`}>
                <div className="text-xs font-mono text-emerald-400 mb-3 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  PRODUCTION RAG & GUARDRAIL TOPOLOGY
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <div className="text-emerald-400 font-semibold">1. Ingestion & Chunking</div>
                    <div className="text-slate-400 mt-1">1,200 PDFs → Layout-aware section parser + metadata tags</div>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <div className="text-cyan-400 font-semibold">2. Hybrid Retrieval</div>
                    <div className="text-slate-400 mt-1">Dense Vector + BM25 lexical search via RRF (Top-25)</div>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <div className="text-amber-400 font-semibold">3. Rerank & Abstain</div>
                    <div className="text-slate-400 mt-1">Cross-Encoder Top-5; logit &lt;0.35 triggers safe abstention</div>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <div className="text-purple-400 font-semibold">4. Verified Streaming</div>
                    <div className="text-slate-400 mt-1">Pydantic JSON schema + AST citation check → React UI</div>
                  </div>
                </div>
              </div>
            )}

            {/* Problem & System Architecture */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-sm font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Business Problem & Context
                </h4>
                <p className={`text-sm leading-relaxed ${subText}`}>{activeCase.problem}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Technical Execution
                </h4>
                <ul className="space-y-2">
                  {activeCase.architecture.map((step, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-sm ${subText}`}>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Guardrails & What I Would Change */}
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className={`rounded-xl border p-5 space-y-3 ${borderCol} ${dark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Failure Modes & Production Guardrails
                </h4>
                <ul className="space-y-2">
                  {activeCase.guardrails.map((g, i) => (
                    <li key={i} className={`text-xs sm:text-sm leading-relaxed ${subText}`}>
                      • {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`rounded-xl border p-5 space-y-3 ${borderCol} ${dark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  What I Would Change If Starting Over
                </h4>
                <ul className="space-y-2">
                  {activeCase.retrospective.map((r, i) => (
                    <li key={i} className={`text-xs sm:text-sm leading-relaxed ${subText}`}>
                      • {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Experience Timeline & Education */}
        <section id="experience" className="grid lg:grid-cols-12 gap-10 scroll-mt-24">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                <Activity className="h-4 w-4" />
                Commercial Track Record
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
            </div>

            <div className={`space-y-6 border-l-2 pl-6 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
              {[
                {
                  role: 'AI & Automation Associate',
                  org: 'Shaw & Co Corporate Finance • UK M&A Advisory',
                  period: 'May 2026 – Aug 2026',
                  desc: 'Rebuilt Dynamics 365 CRM across 15,000 contacts (22% duplicates removed), shipped deal-scoring ML across 340 mandates, automated 14 workflows (~25 hrs/wk saved), and led Claude Enterprise rollout to 120 staff (70% WAU).',
                },
                {
                  role: 'Technical Lead & AI Engineer',
                  org: 'Future Faster Sports • Cambridge Equine-Performance AI',
                  period: 'Jan 2024 – May 2026',
                  desc: 'Sole engineer on a £150K 24-month contract. Built digital-twin telemetry (~2M data points/day, <300ms refresh) and citation-grounded RAG over 1,200 papers (~90% accuracy), underpinning £400K in investor/B2B negotiations.',
                },
                {
                  role: 'AI Strategy Consultant (Project)',
                  org: 'Tenzing Private Equity • AI Sherpa Programme',
                  period: 'Nov 2025 – Jan 2026',
                  desc: 'Shipped multi-tenant XGBoost + LLM churn intelligence across 7 portfolio companies and 18,000 SaaS accounts (0.84 AUC), flagging 420 at-risk accounts (£1.1M ARR exposure).',
                },
                {
                  role: 'AI & Systems Consultant',
                  org: 'City Farm Charity • Bristol',
                  period: 'Sep 2024 – May 2025',
                  desc: 'Consolidated 4 websites and 3 databases into one unified platform processing 1,100 online orders and 6,500 ticket sales in 3 months (~10 hrs/wk admin saved).',
                },
              ].map((job, idx) => (
                <div key={idx} className="relative space-y-1.5">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-emerald-400 bg-[#0A0C10]" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-base">{job.role}</h3>
                    <span className="text-xs font-mono text-emerald-400">{job.period}</span>
                  </div>
                  <div className={`text-xs font-medium ${subText}`}>{job.org}</div>
                  <p className={`text-sm leading-relaxed pt-1 ${subText}`}>{job.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Education & Certifications */}
          <div id="credentials" className="lg:col-span-5 space-y-6 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                <Award className="h-4 w-4" />
                Academic & Cloud Verification
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Education & Certifications</h2>
            </div>

            <div className={`rounded-2xl border p-5 space-y-4 ${borderCol} ${cardBg}`}>
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-sm">MSc Artificial Intelligence (Distinction)</h3>
                  <span className="text-xs font-mono text-emerald-400">2024–2025</span>
                </div>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  University of the West of England (UWE Bristol) • NLP, Transformers, MLOps & AI Systems Design
                </p>
              </div>

              <div className={`border-t pt-4 ${borderCol}`}>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-sm">BSc (Hons) Software Engineering for Business (2:1)</h3>
                  <span className="text-xs font-mono text-emerald-400">2020–2023</span>
                </div>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  University of the West of England (UWE Bristol) • Distributed Systems, Databases & ML
                </p>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 space-y-3 ${borderCol} ${cardBg}`}>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Verified Cloud & AI Certifications
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  'AWS Certified Machine Learning Engineer – Associate (MLA-C01)',
                  'Microsoft Certified: Azure AI Engineer Associate (AI-102)',
                  'Microsoft Certified: Power Platform Developer Associate (PL-400)',
                  'TensorFlow Developer Certificate & AWS Cloud Practitioner',
                ].map((cert, idx) => (
                  <li key={idx} className={`flex items-start gap-2 text-xs sm:text-sm ${subText}`}>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 mt-12 ${borderCol}`}>
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className={subText}>
            © {new Date().getFullYear()} Michael Russum • Built with React, Vite & Tailwind CSS
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/mrussum"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/michael-russum"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              LinkedIn
            </a>
            <a href="mailto:mmmrussum@gmail.com" className="hover:text-emerald-400 transition-colors">
              mmmrussum@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
