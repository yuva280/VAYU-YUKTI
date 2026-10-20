VAYU-YUKTI — Dynamic Air Operations & Resource Optimisation

Permanent Operational Safety Notice:
Synthetic data · advisory only · not connected to any real system

⸻

1. Overview & Problem Addressed

Aerospace logistics, disaster-relief airlift, medical evacuation, and aerial survey planning require rapid, mathematically validated resource coordination across dispersed operating bases. Operational planning frequently contends with:

* Disparate, Partially Stale Telemetry Feeds: Conflicting maintenance records, expired inspections, or missing payload/crew qualifications.
* Dynamic Disruptions: Unscheduled mechanical grounding of airframes or localized adverse weather windows that compromise scheduled missions.
* Cascading Schedule Ripples: Ad-hoc manual reassignments that inadvertently trigger collateral delays, crew duty overruns, or unfulfilled high-priority sorties.

VAYU-YUKTI is an aerospace resource-planning command centre prototype designed to ingest synthetic operational data, gate defective feeds through automated integrity checks, evaluate candidate resource allocations under hard operational constraints, and provide deterministic before/after plan stability diffs for authorized human review.

The current implementation demonstrates these workflows through a browser-based frontend, synthetic fixtures, and deterministic client-side simulation. Backend optimisation and persistent data services remain planned integration work.

⸻

2. Project Objectives & Intended Users

Core Objectives

1. Unified Operational Picture: Provide a consolidated aerospace command centre interface visualizing airbases, mission corridors, fleet serviceability, and weather restrictions.
2. Automated Data-Quality Safeguards: Prevent defective, stale, or conflicting maintenance telemetry from contaminating optimization models.
3. Transparent Reassessment Loop: When an airframe becomes unserviceable, demonstrate a four-stage reassessment progression evaluating eligible replacement airframes under a strict plan-stability objective.
4. Human-in-the-Loop Governance: Enforce role-based separation of duties—Planners can formulate change scenarios and inspect diffs, but only authorized Reviewers can approve or reject plans into the active operational ledger.
5. Cryptographic Provenance Demonstration: Maintain an append-only, verifiable audit-chain simulation of ingestion, solving, and sign-off events.

Intended Users

* Air Operations Planners: Responsible for drafting flight manifests, monitoring maintenance availability, and evaluating contingency reassessments.
* Operations Reviewers / Directors: Responsible for reviewing feasibility verifications, examining impact summaries, and providing mandatory approval.
* Maintenance & Logistics Officers: Field operators managing aircraft turnaround times, scheduled inspections, and capacity tracking.

⸻

3. Key Implemented Features

3.1 Interactive Synthetic Airspace Schematic Centerpiece

Component: AirOperationsMap.tsx

* Handcrafted SVG coordinate grid (960 × 440) featuring three fictional operational hubs: Base Alpha, Base Bravo, and Base Charlie.
* Fourteen distinct mission flight corridors modeled with quadratic Bézier curves and animated aircraft tokens.
* Interactive corridor and destination selection with an embedded quick-inspector drawer revealing mission payloads, assigned crew, and serviceability.
* Visual hazard overlay for CW-01 Bravo Ridge Winds (12:00–15:00 UTC), depicting simulated rotary-flight restriction windows.
* Mission category filters: All, P1 Urgent, Relief & Medical, Logistics, Survey & Training.

3.2 Fleet Coordination Experience

Component: Resources.tsx

* Toggle between Fleet Command Board and Sortie Data Table.
* Airframe readiness cards displaying payload-capacity meters, maintenance hours remaining, crew qualifications, and assigned missions.
* Flight-crew qualification tracking, including type certifications, rest intervals, and duty limits.
* Embedded Sortie Scheduling Matrix visualizing aircraft utilization across the 24-hour mission window.

3.3 Data Quality Ingestion Gate

Component: DataQuality.tsx

Automated detection and demonstration of three telemetry defect categories:

* STALE — Observation timestamp exceeds the configured freshness threshold.
* CONFLICT — Divergent readiness and maintenance statuses.
* MISSING_FIELD — Required operational information is absent.

Unverified assets are quarantined from the simulated allocation workflow to demonstrate how defective data can be prevented from contaminating planning decisions.

3.4 Multi-Stage Simulated Reassessment Progression

Component: ReassessmentStepperModal.tsx

A four-stage modal sequence demonstrates the end-to-end reassessment workflow:

1. Data Ingestion & Integrity Gate: Detect and quarantine defective feeds.
2. Hard Constraint & Boundary Verification: Evaluate range, base collocation, payload capacity, and weather-window constraints.
3. Candidate Allocation & Stability Evaluation: Score eligible replacement candidates.
4. Snapshot Sealing & Version 2 Generation: Create the proposed plan snapshot.

The current reassessment flow is a deterministic client-side simulation, not a connected backend optimisation service.

3.5 Plan Timeline & Mathematical Explanation

Components: Plan.tsx, ExplanationDrawer.tsx

* Custom Gantt timeline mapping sorties across bases.
* Explanation drawer presenting allocation reason codes, rejected alternatives, and constraint checks.
* Reason-code examples:
    * R_ELIGIBLE
    * R_PRIORITY_COVERED
    * R_CAPACITY_CONFLICT

3.6 Before/After Plan Comparison

Component: Compare.tsx

* Operational Impact & Root-Cause Summary detailing the simulated grounding event, retasked sortie, and ripple verification.
* Synchronized stacked timelines comparing Version 1 (Baseline) and Version 2 (Proposed) on identical time axes.
* Retask highlights and a task-by-task difference table showing previous versus proposed airframes and stability indices.
* Demonstration of a 100% Plan Stability Index when the single intended reassignment leaves the other 13 tasks unchanged.

3.7 Role-Separated Human Sign-Off Workspace

Components: Review.tsx, ReviewPanel.tsx

* Dedicated reviewer panel requiring written operational comments before approval.
* Demonstration of role-based authorization through Planner and Reviewer roles.
* Planner approval and rejection controls are disabled in the demonstration interface.
* Reviewer workflow supports approving or rejecting the proposed plan.

Important: The current role separation is implemented in the client-side prototype. It demonstrates governance workflows but is not a substitute for server-side authorization in a production system.

3.8 Simulated Cryptographic Audit Ledger

Component: Audit.tsx

* Vertical hash-chain timeline linking ingestion, scenario creation, solve, and sign-off events with previous-hash digests.
* Action filters for examining the simulated event history.
* One-click demo reset to restore the deterministic baseline seed state.

The audit ledger demonstrates provenance concepts using simulated, in-memory data. It is not a production-grade immutable audit system.

⸻

4. How the Prototype Works

graph TD
    A[Synthetic Telemetry Feeds] --> B[Data Quality Gate]
    B -->|Filter Defects: AC-09, AC-11, C-18| C[Eligible Resource Pool]
    C --> D[Baseline Optimization Plan v1]
    D --> E[Interactive Command Center]
    E --> F[Scenario: AC-03 Unserviceable]
    F --> G[4-Stage Reassessment Stepper]
    G --> H[Proposed Version 2: T-04 Retasked to AC-06]
    H --> I[Before / After Comparison]
    I --> J{Human Governance Review}
    J -->|Planner| K[Inspection Only]
    J -->|Reviewer| L[Approve or Reject]
    L --> M[Plan Status and Simulated Audit Ledger]

End-to-End Demonstration

1. Baseline State — Version 1
    The application initializes with 12 synthetic airframes, 18 flight-crew members, and 14 support sorties across three fictional bases. Three seeded data-quality issues (AC-09, AC-11, and C-18) are quarantined.
    Mission T-04, a P1-priority relief sortie, is initially assigned to AC-03 at Base Alpha.
2. Disruption Injection
    On the Scenario & Changes screen, the user triggers the preset event:
    AC-03 → UNSERVICEABLE
    This simulates pre-flight hydraulic degradation.
3. Reassessment Loop
    The application executes the simulated four-stage reassessment pipeline. Candidate airframes at Base Alpha are evaluated, and reserve transport AC-06 is selected.
    The demonstration data specifies an 8,000 kg payload capacity and qualified crew C-07 and C-08 for the replacement assignment.
4. Difference Verification
    On the Compare & Diff screen, the user verifies that T-04 has been reassigned to AC-06.
    The displayed 100% Plan Stability Index represents the unchanged allocation of the other 13 tasks in this seeded scenario.
5. Human Governance Sign-Off
    On the Review & Sign-Off screen, the user switches from Planner to Reviewer, enters an operational justification, and selects Approve Operational Plan.
6. Simulated Audit Entry
    The approval event is appended to the simulated SHA-256 audit log. Version 2 becomes active in the demonstration state, and Version 1 is marked as superseded.

Implementation note: These outcomes describe the deterministic demo path. The current application uses client-side simulation logic rather than a live operational data feed or a connected mathematical optimisation backend.

⸻

5. Technology Stack

5.1 Current Implementation

The current prototype is a browser-based frontend using synthetic fixtures and deterministic client-side simulation.

Component	Technology	Purpose
UI Framework	React 18 (react, react-dom)	Component-based interface
Language & Compiler	TypeScript 5.7	Strictly typed application logic
Bundler & Build Tool	Vite 6 (vite, @vitejs/plugin-react)	Development server and production builds
Styling	Tailwind CSS 3	Interface styling and design tokens
CSS Processing	PostCSS, Autoprefixer	CSS processing and compatibility
Routing	React Router DOM v6	Client-side navigation
Icons	Lucide React (lucide-react)	Interface iconography
Testing	Vitest 2, jsdom	Unit and integration testing
UI Testing	React Testing Library	Component and interaction testing
WASM Compatibility	@rollup/wasm-node	WebAssembly-compatible Rollup fallback

5.2 Proposed Technology Stack

The following technologies are proposed for future backend integration, data persistence, and mathematical optimisation.

Component	Technology	Intended Purpose
Interface	React + TypeScript	Interactive operational planning interface
Spatial Visualisation	SVG; Three.js / React Three Fiber (optional)	Advanced spatial and scenario visualisation
Backend API	Python + FastAPI	Backend endpoints for simulation and optimisation
Data Validation	Pydantic	Structured request and operational data validation
Database	PostgreSQL	Persistent operational records and plan snapshots
Optimisation Engine	Google OR-Tools	Constraint-based resource allocation and scheduling
Optional Analytics	Scikit-learn	Additional analytical and predictive capabilities
Deployment	Docker	Reproducible deployment environment

5.3 Technology Integration Status

The current implementation uses React, TypeScript, Vite, Tailwind CSS, and the other frontend dependencies listed above.

The following are proposed rather than currently integrated: Python, FastAPI, PostgreSQL, Pydantic, Google OR-Tools, Scikit-learn, and Docker.

The current optimisation demonstration uses deterministic client-side mock logic to simulate reassessment and plan comparison. It does not currently execute a connected OR-Tools CP-SAT solver.

Three.js / React Three Fiber is an optional proposed extension, not a current dependency of the documented implementation.

⸻

6. Architecture & Repository Structure

VAYU-YUKTI/
├── .gitignore
├── package.json
├── README.md
└── frontend/
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── index.css
        ├── main.tsx
        ├── api/
        │   ├── mockFixtures.ts
        │   ├── mockService.ts
        │   └── mockTypes.ts
        ├── app/
        │   ├── App.tsx
        │   ├── Layout.tsx
        │   ├── RoleContext.tsx
        │   └── routes.tsx
        ├── components/
        │   ├── AirOperationsMap.tsx
        │   ├── ChangeForm.tsx
        │   ├── DiffTable.tsx
        │   ├── ExplanationDrawer.tsx
        │   ├── FlightRouteVisual.tsx
        │   ├── FreshnessBadge.tsx
        │   ├── KpiTile.tsx
        │   ├── RadarWidget.tsx
        │   ├── ReasonChip.tsx
        │   ├── ReassessmentStepperModal.tsx
        │   ├── ReviewPanel.tsx
        │   ├── StatusBadge.tsx
        │   └── Timeline.tsx
        ├── lib/
        │   ├── format.ts
        │   └── reasonCodes.ts
        ├── pages/
        │   ├── Audit.tsx
        │   ├── Compare.tsx
        │   ├── Dashboard.tsx
        │   ├── DataQuality.tsx
        │   ├── Plan.tsx
        │   ├── Resources.tsx
        │   ├── Review.tsx
        │   └── Scenario.tsx
        └── test/
            ├── mockService.test.ts
            ├── setup.ts
            └── shell.test.tsx

Architecture Notes

* mockFixtures.ts provides the seeded synthetic airframes, crew, sorties, bases, and weather data.
* mockService.ts handles client-side state, snapshot creation, deterministic solve logic, and the simulated audit log.
* mockTypes.ts defines the TypeScript domain models and interfaces.
* RoleContext.tsx provides the demonstration role context for Planner and Reviewer.
* AirOperationsMap.tsx renders the synthetic airspace schematic.
* ReassessmentStepperModal.tsx demonstrates the reassessment stages.
* Compare.tsx presents the proposed plan against the baseline.
* Review.tsx and ReviewPanel.tsx demonstrate human review and sign-off.
* Audit.tsx presents the simulated hash-chain event history.

This structure documents the current frontend prototype. A separate backend service and database are planned and are not represented as existing directories in this repository structure.

⸻

7. Prerequisites & Installation

Prerequisites

* Node.js: Version 18.x or 20.x and compatible later versions.
* npm: Version 9.x or later.

Installation Steps

1. Clone the repository

git clone https://github.com/yuva280/VAYU-YUKTI.git
cd VAYU-YUKTI

2. Install frontend dependencies

cd frontend
npm install

⸻

8. Local Development & Verification Commands

Run the following commands from the frontend directory.

cd frontend

8.1 Start the Development Server

npm run dev

Open http://localhost:5173 in your browser.

8.2 Run the TypeScript Static Type Check

npx tsc --noEmit

Performs a TypeScript type-check without generating compiled output.

8.3 Run the Automated Test Suite

npm test -- --run

Runs the configured Vitest test suite. The documented test coverage includes synthetic banner rendering, navigation links, role-switcher behaviour, data-quality defect quarantine, version snapshot immutability, stability calculations, and audit chaining.

The actual number of passing tests should be verified by running the test suite.

8.4 Build the Production Bundle

npm run build

Executes the configured production build, documented as tsc && vite build, and generates optimized frontend assets in frontend/dist/.

⸻

9. Walkthrough & Demo Guide

Follow this five-minute evaluation script to demonstrate the prototype.

Step 1 — Dashboard (/)

* Review the persistent safety banner:
    Synthetic data · advisory only · not connected to any real system
* Inspect the interactive Synthetic Air Operations Airspace Schematic.
* Click flight corridor T-04 or destination Sector-4 Relief Lifeline to inspect its embedded sector card.
* Review the operational KPI tiles, radar-status widget, and Recent Decision Activity feed.

Step 2 — Resources & Fleet Coordination (/resources)

* Toggle between Fleet Command Board and Data Table.
* Inspect airframe AC-03 at Base Alpha.
* Check payload-capacity meters and remaining maintenance hours.
* View the Sortie Scheduling Matrix showing mission allocations across the timeline.

Step 3 — Data Quality Gate (/data-quality)

Inspect the three seeded telemetry defects:

* AC-09: STALE — Observation is more than 24 hours old and the asset is excluded from allocation.
* AC-11: CONFLICT — Divergent telemetry reports cause the asset to be quarantined.
* C-18: MISSING_FIELD — Missing qualification information causes the record to be quarantined.

Click each defect to inspect its raw JSON telemetry evidence.

Step 4 — Scenario & Retasking (/scenario)

* Trigger the preset event:
    AC-03 → UNSERVICEABLE
* Observe the four-stage reassessment sequence:
    1. Data Ingestion Gate.
    2. Hard Constraint Verification.
    3. Candidate Evaluation.
    4. Snapshot Sealing.
* Inspect the generated Version 2 plan and proceed to the comparison view.

Step 5 — Compare & Diff (/compare)

* Review the Operational Impact & Root-Cause Summary.
* Inspect the stacked timelines comparing Version 1 and Version 2.
* Observe the highlighted reassignment of T-04 to AC-06.
* Check the displayed Plan Stability Index: 100%, representing the unchanged allocation of the other 13 sorties in the seeded scenario.

Step 6 — Human Governance Sign-Off (/review)

* In the Planner role, inspect the disabled approval controls and the associated security notice.
* Switch to Reviewer using the top-bar role selector.
* Enter an operational review rationale.
* Select Approve Operational Plan.

The demonstration state marks Version 2 as APPROVED and Version 1 as SUPERSEDED.

Step 7 — Simulated Audit Ledger (/audit)

* Review the chronological audit chain and previous-hash digests.
* Filter events by action type.
* Use Reset Demo to Baseline to restore the deterministic seed state.

Demonstration reminder: The interface illustrates operational planning and governance concepts using synthetic data. It does not control aircraft or perform live operational dispatch.

⸻

10. Synthetic Data & Simulation Details

All operational entities within VAYU-YUKTI are synthetic.

* Bases: Fictional logistics hubs — Base Alpha, Base Bravo, and Base Charlie.
* Airframes: Fictional inventory from AC-01 through AC-12, covering Heavy Transport, Utility Rotary, and Light Cargo categories.
* Crew: Fictional personnel from C-01 through C-18, with synthetic flight hours, duty times, and qualification tags.
* Missions: Support operations including Logistics Lift, Disaster Relief Supplies, Medical Transfer, Aerial Survey, and Instrument Check.
* Telemetry Defects: Three seeded examples demonstrating stale data, conflicting statuses, and missing fields.
* Optimisation Model: The current demonstration uses a deterministic client-side mock optimisation service to simulate reassessment and lexicographic multi-objective CP-SAT-style solving behaviour. It does not execute an integrated Google OR-Tools solver.
* Plan Stability: The displayed stability index is derived from the simulated allocation comparison for the seeded scenario.
* Audit Hashes: The hash-chain timeline uses simulated SHA-256 digest strings linked consecutively to demonstrate provenance architecture.

No live aircraft telemetry, real airbase coordinates, real crew records, or classified operational data are required by the prototype.

⸻

11. Security, Limitations & Future Roadmap

11.1 Current Prototype Limitations

* Client-Side Simulation: The current prototype operates entirely in the browser using mock fixtures. There is no connected backend server, PostgreSQL database, or remote OR-Tools service.
* Pre-Seeded Disruption Path: The primary dynamic reassessment path is deterministically calibrated around AC-03 → UNSERVICEABLE.
* Simulated Cryptography: Audit event hashes are generated in memory for demonstration purposes and do not constitute a production-grade immutable ledger.
* Client-Side Role Enforcement: Planner and Reviewer separation demonstrates the intended governance workflow but does not provide independent server-side access control.
* Synthetic Telemetry: All data is generated for demonstration and is not connected to live telemetry feeds.
* Optimisation Validation: The current plan-selection logic is mock logic. Its outputs must not be interpreted as results from a connected mathematical solver or validated real-world flight-planning system.

11.2 Future Development Roadmap

1. FastAPI & OR-Tools Backend Integration: Connect the frontend to a Python FastAPI backend running Google OR-Tools CP-SAT for constraint-based resource allocation and dynamic reassessment.
2. Persistent Data Storage: Integrate PostgreSQL for structured data, plan snapshots, scenario history, and audit-event persistence.
3. Structured Data Validation: Use Pydantic models to validate API requests and operational data before optimisation.
4. Server-Side Governance: Implement authenticated roles, server-side approval checks, and controlled transitions between proposed and approved plan versions.
5. Tamper-Evident Audit Architecture: Replace simulated digests with a properly implemented server-side hash chain or Merkle-tree-based audit design, with suitable access controls and persistence.
6. Synthetic Telemetry Streaming: Evaluate simulated MQTT or Kafka streams and configurable freshness thresholds before considering any external integrations.
7. Enhanced Crew Rostering: Model crew-rest rules, duty-time limitations, qualifications, and multi-leg sortie scheduling.
8. Advanced Spatial Visualisation: Explore Three.js or React Three Fiber for a more immersive spatial representation of resources and scenario changes.
9. Testing & Validation: Add backend tests, optimisation constraint tests, scenario regression tests, and validation of infeasible or conflicting inputs.
10. Containerised Deployment: Use Docker to package and deploy the application components in a reproducible environment.

All future integrations should retain synthetic-data testing, explicit feasibility checks, human approval, and clear operational limitations.

⸻

12. Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch:

git checkout -b feature/enhancement-name

2. Follow the existing TypeScript standards and coding conventions.
3. Run the TypeScript check:

npx tsc --noEmit

4. Run the configured test suite:

npm test -- --run

5. Verify the production build:

npm run build

6. Preserve the permanent synthetic-data safety disclaimer.
7. Do not introduce real operational telemetry, live aircraft-control functionality, military targeting, or tactical routing capabilities.
8. Submit a pull request with a clear description of the changes and relevant test results.

⸻

13. License

This project is licensed under the MIT License. See the repository’s license file for the applicable terms.

⸻

14. Project Status & Acknowledgements

* Project: VAYU-YUKTI — Dynamic Air Operations & Resource Optimisation.
* Status: Functional Frontend Prototype (Phases F0–F4 complete, as reported by the project).
* Implementation: React + TypeScript frontend with synthetic fixtures, deterministic client-side reassessment, plan comparison, role-separated review workflow, and simulated audit-chain visualisation.
* Planned Extensions: FastAPI, PostgreSQL, Pydantic, Google OR-Tools, optional Scikit-learn, and Docker.
* Purpose: Educational, research, and demonstration use.

Permanent Safety Disclaimer

All assets, airbases, tail numbers, crew identities, operational events, and scenarios are synthetic and advisory-only.

VAYU-YUKTI is not connected to any real operational system. It does not provide live flight dispatch, aircraft control, or real-world operational authorisation. Human review remains central to the proposed planning workflow.
