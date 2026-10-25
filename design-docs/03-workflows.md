# 03 — Workflows

This document captures the business process flows the demo simulates, expressed
as mermaid diagrams. It fills in the `TODO: Process flowchart` placeholder in the
[README Workflow](../README.md#workflow) section and the demo's
[workflow reference](./demo-design.md#workflow).

Actors: **Procurement Lead**, **Procurement Officer**, **Vendor**. See
[Data Model](./02-data-model.md) for the entities referenced here.

## 1. End-to-end process overview

```mermaid
flowchart TD
    Start([Start]) --> Setup

    subgraph Setup["System & Project Setup"]
        L1[Lead: create Project Areas] --> L2[Lead: create shared Artifacts]
        L2 --> O1[Officer: create Project]
        O1 --> O2[Officer: add standard + specific Artifacts]
        O2 --> O3[Officer: add Project Segments]
        O3 --> O4[Officer: activate project - public]
        O4 --> O5[Officer: send Vendor solicitations]
    end

    O5 --> Prop

    subgraph Prop["Proposal Process"]
        V1[Vendor: view available Projects] --> V2{Sign up?}
        V2 -- No --> NI[Move to Not Interested]
        V2 -- Yes --> V3[Vendor: sign up]
        V3 --> V4[Vendor: optional additional docs]
        V4 --> V5[Vendor: complete required Artifacts]
        V5 --> F1[Officer: review + filter at solicitation close]
        F1 --> AP1{Lead approves 1st round?}
        AP1 -- Declined --> End1([Vendor process ends])
        AP1 -- Approved --> V6[Vendor: complete follow-up Artifacts]
        V6 --> F2[Officer: review follow-up + rank finalists]
        F2 --> AP2{Lead approves finals?}
        AP2 -- Declined --> End2([Vendor process ends])
        AP2 -- Approved --> Legal[Send top Vendor to Legal]
    end

    Legal --> Done([Contract drafting - out of scope])
    NI --> Reconsider{Reconsider later?}
    Reconsider -- Yes --> V1
    Reconsider -- No --> Done
```

## 2. System setup — Procurement Lead

```mermaid
flowchart LR
    A[Start] --> B[Create Project Area<br/>e.g. Facilities Maintenance]
    B --> C{More areas?}
    C -- Yes --> B
    C -- No --> D[Create shared Artifact]
    D --> E{Form or Document?}
    E -- Form --> F[Build form in MUI survey builder<br/>text, radio, checkbox, select]
    E -- Document --> G[Define document requirement]
    F --> H{More artifacts?}
    G --> H
    H -- Yes --> D
    H -- No --> I[Done]
```

## 3. Project setup — Procurement Officer

```mermaid
flowchart TD
    A[Create new Project] --> B[Set Area, Name, Outline,<br/>Scope, Value, Dates, Lead]
    B --> C[Add standard Artifacts<br/>from shared templates]
    C --> D[Add project-specific Artifacts]
    D --> E[Add Project Segments<br/>solicitation, submission, filtering,<br/>follow-up, final selection]
    E --> F{Ready?}
    F -- No --> B
    F -- Yes --> G[Activate project - public viewing]
    G --> H[Setup fields lock]
    H --> I[Send Vendor solicitations]
```

> **Edit lock:** Once a project is public (`isPublic = true`), setup fields are
> read-only in the UI (demo spec, Project Setup tab). Artifacts can still be added;
> removals are soft deletes.

## 4. Proposal lifecycle — Vendor perspective

```mermaid
flowchart TD
    A[Browse available Projects] --> B{Interested?}
    B -- No --> NI[Not Interested list]
    NI --> A
    B -- Yes --> C[Sign up - creates Proposal]
    C --> D[Optional: add additional items]
    D --> E[Complete required Artifacts]
    E --> F[Submitted - awaits filtering]
    F --> G{Officer filter + Lead approve}
    G -- Declined --> X1([Ended])
    G -- Passed --> H[Complete follow-up Artifacts]
    H --> I{Final selection + Lead approve}
    I -- Declined --> X2([Ended])
    I -- Selected --> J([Won - sent to legal])
```

## 5. Review & selection — Procurement Officer and Lead

```mermaid
flowchart TD
    subgraph Officer["Procurement Officer"]
        O1[At solicitation close:<br/>review Vendor list] --> O2[Review Vendor Artifacts]
        O2 --> O3[Filter proposals<br/>decline those not meeting needs]
        O3 --> O4[Send follow-up Artifacts<br/>to remaining Vendors]
        O4 --> O5[Review follow-up Artifacts]
        O5 --> O6[Rank finalists]
    end

    subgraph Lead["Procurement Lead"]
        L1[Approve 1st-round filtered Vendors]
        L2[Review finalized Vendor list]
        L3[Approve finals, send to legal]
    end

    O3 --> L1
    L1 --> O4
    O6 --> L2
    L2 --> L3
    L3 --> End([Legal: contracts])
```

## 6. Proposal state machine

This is the authoritative state model for `Proposal.status`
(see [Data Model §3](./02-data-model.md)). The demo's resolvers and UI actions
only permit the transitions shown.

```mermaid
stateDiagram-v2
    [*] --> SignedUp: Vendor signs up
    SignedUp --> Submitted: Vendor completes required artifacts
    Submitted --> Filtered: Officer passes in filtering
    Submitted --> Declined: Officer declines
    Filtered --> FollowUp: Lead approves 1st round
    Filtered --> Declined: Lead rejects
    FollowUp --> Finalized: Officer ranks + Lead reviews
    FollowUp --> Declined: Officer/Lead declines
    Finalized --> Won: Lead approves final, sent to legal
    Finalized --> Declined: Lead declines
    Declined --> [*]
    Won --> [*]
```

| Transition | Trigger | Actor | Guard |
|---|---|---|---|
| → SignedUp | Sign up | Vendor | project is public & within open window |
| SignedUp → Submitted | Submit proposal | Vendor | all active required artifacts submitted |
| Submitted → Filtered | Pass filter | Officer | — |
| Submitted → Declined | Decline | Officer | — |
| Filtered → FollowUp | Approve round 1 | Lead | — |
| Filtered → Declined | Reject round 1 | Lead | — |
| FollowUp → Finalized | Rank finalist | Officer | follow-up artifacts reviewed |
| Finalized → Won | Approve final | Lead | ranked top / selected |
| any (pre-Won) → Declined | Decline | Officer/Lead | ends vendor process |

## 7. Role interaction sequence (happy path)

```mermaid
sequenceDiagram
    participant Lead
    participant Officer
    participant Vendor
    participant System as Demo App

    Lead->>System: Create areas + shared artifacts
    Officer->>System: Create project, add artifacts & segments
    Officer->>System: Activate (public) + solicit vendors
    Vendor->>System: Sign up + submit artifacts
    Officer->>System: Filter proposals
    System-->>Lead: Request 1st-round approval
    Lead->>System: Approve subset
    Officer->>System: Request follow-up artifacts
    Vendor->>System: Submit follow-up artifacts
    Officer->>System: Rank finalists
    System-->>Lead: Request final approval
    Lead->>System: Approve top vendor
    System-->>Vendor: Won (to legal)
```

## 8. Artifact fulfillment flow

How a required project artifact becomes a vendor submission:

```mermaid
flowchart LR
    T[Shared Artifact Template] -->|Officer adds| PA[Project Artifact]
    PA -->|type = Form| SJ[SurveyJS schema<br/>built via MUI builder, rendered by runtime]
    PA -->|type = Document| DOC[Document upload requirement]
    SJ -->|Vendor fills| SUB1[Artifact Submission<br/>SurveyJS responses]
    DOC -->|Vendor provides| SUB2[Artifact Submission<br/>document name]
    SUB1 --> Prop[Attached to Proposal]
    SUB2 --> Prop
```

> **Shared artifact pre-fill:** From the Vendor *Shared Artifacts* page, a vendor
> can complete shared artifacts once; these responses apply to any project they
> later sign up for (demo spec). In the demo this copies responses into the new
> proposal's submissions.
