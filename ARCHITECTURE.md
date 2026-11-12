# SchoolOS — System Architecture & Technical Design (STAGE 0)
## European Education Management Platform Architecture

**Document Version:** 3.1.0  
**Backend Architecture:** Modular Monolith (NestJS + PostgreSQL + Prisma)  
**Frontend Architecture:** Feature-Driven Clean Architecture (React + TypeScript + Vite + Tailwind CSS)  
**Educational Levels:** Primary and Secondary Education  
**Status:** Approved in Principle — Final Review Adjustments Applied  
**Role:** Senior Software Architect, Education Technology Product Architect, Business Analyst & Technical Lead  

---

## 1. Architectural Philosophy & Principles

SchoolOS is architected as a **Modular Monolith**. It delivers the clean domain boundaries and autonomy of service-oriented architectures while avoiding the premature complexity, network overhead, distributed transaction failures, and operational maintenance burdens of microservices.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SchoolOS Frontend (React + TypeScript + Vite)               │
│        (Feature-Driven, Service Interfaces, UI Primitives, i18n Engine)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON REST API
                                       │ HttpOnly Secure Cookie (JWT)
                                       │ Context Headers (X-Tenant-ID, X-Campus-ID)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SchoolOS Modular Monolith Backend (NestJS)               │
│                                                                             │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐ │
│  │ Identity & Access     │ │ Organizations/Campuses│ │ Academic Structure │ │
│  └───────────────────────┘ └───────────────────────┘ └────────────────────┘ │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐ │
│  │ Students & Guardians  │ │ Admissions & Enroll   │ │ Staff & HR         │ │
│  └───────────────────────┘ └───────────────────────┘ └────────────────────┘ │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐ │
│  │ Attendance            │ │ Assessment & Grading  │ │ Timetable/Resources│ │
│  └───────────────────────┘ └───────────────────────┘ └────────────────────┘ │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐ │
│  │ Finance & Billing     │ │ Communication         │ │ Documents          │ │
│  └───────────────────────┘ └───────────────────────┘ └────────────────────┘ │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐ │
│  │ Reporting & Analytics │ │ Integration/Localize  │ │ Privacy & Retention│ │
│  └───────────────────────┘ └───────────────────────┘ └────────────────────┘ │
│                                                                             │
│  ─────────────────── Cross-Cutting Shared Kernel ─────────────────────────  │
│      Tenant Guard • Entitlement Guard • Audit Logger • Legal Hold Engine    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 Prisma ORM Client (Multi-Tenant Scoped Queries)             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│           PostgreSQL Database (EU Data Residency, Row-Level Isolation)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Core Architectural Principles
1. **Separation of Concerns:** Strict layer demarcation across Presentation (UI components, routes), Application (use cases, feature hooks, entitlement evaluation), Domain (entities, value objects, business invariants, strategies), and Infrastructure (HTTP client, storage, Prisma ORM).
2. **Modular Encapsulation:** Modules interact exclusively via public service interfaces or internal domain events. Direct database cross-table joins between loosely related domains are forbidden.
3. **Frontend-First Service Abstraction:** UI components depend on abstract service contracts (`IStudentService`, `IGradeService`, `IAttendanceService`, `IFinanceService`). In-memory mock adapters allow complete frontend feature development; Stage L swaps these for HTTP adapters with zero component modifications.
4. **Subscription Entitlements Architecture:** Modules such as Finance, HR, Documents, and Portals are core product domains. Access is evaluated via a centralized `EntitlementGuard` that checks institutional subscription tiers and feature flags, allowing dynamic module enabling per tenant.
5. **Dynamic ISO 4217 Currency Handling:** Currency codes are dynamic strings adhering to ISO 4217. The frontend formatting utility renders any valid 3-letter currency code using ECMAScript `Intl.NumberFormat`.

---

## 2. Multi-Tenancy, Hierarchy & Security Model

A secure multi-tenant architecture must clearly distinguish operational entities from security boundaries:

```
[ Platform ]
     │
     └── [ Organization ] (Tenant / Legal Entity / School Group / Municipality)
              │
              ├── [ Campus ] (Physical site: e.g., Primary Campus, High School Campus)
              │        │
              │        └── [ Academic Year ] (Temporal boundary: 2026/2027)
              │                 │
              │                 └── [ Classes / Cohorts / Timetables ]
              │
              └── [ Tenant Membership ] ◄────────── [ User ] (Global Identity)
                        │
                        └── [ Assigned Roles & Permissions ]
```

### 2.1 Entity Model Distinctions
- **Platform:** The overarching SaaS deployment, global billing, system monitoring, and platform configuration.
- **Organization (Tenant):** The primary data isolation boundary. Represents the legal educational entity, private school corporation, multi-academy trust, or municipal board. All tenant data is hard-scoped to `organization_id`.
- **Campus:** A physical or organizational operational site under an organization (e.g., *"Campus Primaire Victor Hugo"*, *"Campus Secondaire Montmartre"*). Manages localized physical rooms and bell schedules.
- **Academic Year:** Temporal boundary (e.g., September 2026 – July 2027) containing terms, semesters, or trimesters. Academic records are immutably tied to an academic year.
- **User:** A single human identity across the platform (email, password hash/SSO identity, MFA secrets).
- **Tenant Membership:** Association linking a `User` to an `Organization`. A single user may belong to multiple organizations (e.g., an IT administrator managing multiple school trusts, an itinerant music teacher teaching at two independent schools, or a parent with children in different schools).
- **Role and Permissions:** Scoped per Tenant Membership and optionally per Campus (e.g., a user can be a `TEACHER` at Campus A and a `PARENT` at Campus B).

### 2.2 Golden Security Rule: Zero Frontend Trust
> [!CAUTION]
> **Strict Security Invariant:** The active organization or campus selected in the frontend UI is **purely contextual information for rendering navigation and filters**. It must **never** be considered an authorization mechanism.
>
> For every single incoming request:
> 1. The backend independently authenticates the user session via secure, HttpOnly, SameSite=Strict cookies.
> 2. The backend extracts the target `organization_id` (from route param or header) and queries the user's `TenantMembership` in the database.
> 3. The backend independently verifies that the user holds an active membership and the required permission key (`students:view`, `grades:publish`) for that specific organization and campus before returning or mutating data.
> 4. All Prisma queries append `WHERE organization_id = :authorizedOrgId` automatically via backend tenancy interceptors.

---

## 3. The 14 Bounded Domains (Responsibilities & Boundaries)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Bounded Domains                                │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ 1. Identity & Access (IAM)   │ User identities, auth, sessions, RBAC keys   │
│ 2. Organizations & Campuses  │ Legal entities, campuses, facility hierarchy │
│ 3. Students & Guardians      │ Pupil lifecycle, custody flags, demographics │
│ 4. Admissions & Enrollment   │ Inquiries, applications, cohort promotions   │
│ 5. Academic Structure        │ Years, terms, year groups, classes, subjects │
│ 6. Staff & Human Resources   │ Employee profiles, credentials, workloads    │
│ 7. Attendance                │ Homeroom & period attendance, excuse records │
│ 8. Assessment & Grading      │ Polymorphic grading, exam terms, report cards│
│ 9. Timetable & Resources     │ Bell periods, weekly matrix, room booking    │
│ 10. Finance & Invoicing      │ ISO 4217 fees, SEPA payments, expenses       │
│ 11. Communication            │ Multilingual announcements, emergency alerts │
│ 12. Documents                │ Scoped file repository, compliance metadata  │
│ 13. Reporting & Analytics    │ Operational rosters, demographic dashboards  │
│ 14. Integrations & Localize  │ i18n, SSO, OneRoster, LMS adapters, formatters│
└──────────────────────────────┴──────────────────────────────────────────────┘
```

### 3.1 Domain Breakdown
1. **Identity & Access Management (IAM):** User identities, authentication, MFA, session token lifecycle, tenant membership resolution, role definitions, permission evaluations.
2. **Organizations & Campuses:** Tenant lifecycle, campus profile, institutional metadata, operational calendar settings, subscription entitlement evaluation.
3. **Students & Guardians:** Student demographics, enrollment state machine, guardian relationships, custodial authority flags, GDPR special category flags (medical/SEN).
4. **Admissions & Enrollment:** Prospective student applications, entrance reviews, offer management, class cohort balancing, year-end student promotions.
5. **Academic Structure:** Academic year and term boundaries, year groups / grades, classes / homerooms, departments, curriculum subject catalog.
6. **Staff & Human Resources:** Staff directory, professional credentials (degrees, teaching certifications), contract types, weekly teaching load allocation (*Deputat / Heures de cours*).
7. **Attendance:** Daily homeroom attendance registers, period-by-period lesson registers, absence justifications, medical note attachments, truancy monitoring.
8. **Assessment & Grading:** Polymorphic grading calculations (Primary Competency rubrics default, German 1–6, French 0–20, Percentage, Letter), exam terms, gradebooks, official report card (*Zeugnis / Bulletin*) generation.
9. **Timetable & Resources:** Bell schedules, class timetable matrices, teacher weekly schedules, room utilization, collision detection, teacher substitution tracking.
10. **Finance & Invoicing:** Fee structures in ISO 4217 currencies, student billing, SEPA payments, credit notes, overdue tracking, operational expenses.
11. **Communication:** Multilingual notices (EN, FR, DE), targeted audience scoping, urgent broadcast banners, notification center.
12. **Documents:** Encrypted document storage, pupil dossiers, staff contracts, institutional policies, retention and legal hold metadata.
13. **Reporting & Analytics:** Consolidated rosters, demographic summaries, academic performance curves, attendance analytics, audit trails.
14. **Integrations & Localization:** Dynamic `Intl` currency/date formatting, `react-i18next` engine, external identity provider (OIDC/SAML) adapters, OneRoster 1.2 export, LMS synchronization.

---

## 4. Primary & Secondary Educational Architecture (Polymorphic Core)

### 4.1 Attendance Strategy Interface
```typescript
export interface IAttendanceStrategy {
  readonly mode: 'HOMEROOM_DAILY' | 'PERIOD_LESSON';
  recordRegister(dto: SubmitRegisterDto): Promise<RegisterResult>;
  getAbsenceSummary(studentId: string, termId: string): Promise<AbsenceSummary>;
  detectTruancy(date: string, campusId: string): Promise<TruancyAlert[]>;
}
```

### 4.2 Polymorphic Grading Strategy Architecture
```typescript
export interface IGradingStrategy {
  readonly systemType: 'PRIMARY_COMPETENCY' | 'GERMAN_SCALE' | 'FRENCH_SCALE' | 'PERCENTAGE' | 'LETTER_GRADE' | 'CUSTOM';
  calculateGrade(rawScore: number, maxScore: number, weight?: number): GradeResult;
  calculateTermAverage(grades: GradeResult[]): GradeResult;
  formatForDisplay(grade: GradeResult, locale: string): string;
  isPassing(grade: GradeResult): boolean;
  getSemanticBadgeColor(grade: GradeResult): 'emerald' | 'teal' | 'amber' | 'rose' | 'slate';
}
```

- **Primary Default:** `PrimaryCompetencyStrategy` evaluates developmental rubrics (*Exceeding, Secure, Developing, Emerging* or *Non acquis, En voie d'acquisition, Acquis, Expert*) paired with narrative remarks. Configurable overrides allow numerical scoring if required by an institution.
- **Secondary Defaults:** Resolved dynamically via `GradingStrategyFactory` supporting German 1–6 (inverted curve), French 0–20 (honors mentions), Percentage, or Letter grades.

---

## 5. Dynamic ISO 4217 Currency & Localization Engine

The formatting utility in `src/shared/utils/formatters.ts` supports dynamic ISO 4217 currency codes:

```typescript
export function formatCurrency(
  amountInMinorUnits: number, 
  currencyCode = 'EUR', 
  locale = 'en-IE'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountInMinorUnits / 100);
  } catch {
    // Graceful fallback for non-standard currency tokens
    return `${currencyCode.toUpperCase()} ${(amountInMinorUnits / 100).toFixed(2)}`;
  }
}
```

---

## 6. GDPR, Legal Holds & Retention Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Data Retention & Erasure Engine                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Incoming Deletion Request (Right to be Forgotten Art. 17)                 │
│                          │                                                  │
│                          ▼                                                  │
│               [ Legal Hold Active? ] ──YES──► [ ABORT DELETION ]            │
│                          │                    (Log Security Warning)        │
│                         NO                                                  │
│                          ▼                                                  │
│          [ Record Statutory Archive? ]                                      │
│                  │               │                                          │
│                 YES              NO                                         │
│                  │               │                                          │
│                  ▼               ▼                                          │
│          [ Retain Locked  ]   [ Scrub Personal Data ]                       │
│          [ Encrypted Arch ]   [ Emit Tombstone Log  ]                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **`LegalHold` Entity:** Can be attached to any student, staff member, or financial transaction. An active legal hold immediately halts all automated retention pruners and user deletion requests.
2. **Statutory Exemption Handling:** When an erasure request is executed, non-statutory PII is expunged, while legally mandated graduation transcripts and financial ledgers are moved to an immutable statutory archive partition.
3. **Tombstone Audit Logging:** All purge operations create an immutable tombstone record detailing the deletion authorization, timestamp, approving DPO, and statutory basis.
4. **Legal Review Demarcation:** The system explicitly notes where institutional legal counsel and Data Processing Agreements (DPAs) are required.

---

## 7. Fictional Demonstration Institutions (Stage A Baseline)

For prototype testing in Stage A:
- **`École Démonstration Paris`:** Bilingual French-English institution, 2 campuses (Victor Hugo, Montmartre), Trimester calendar, French 0–20 grading (Secondary), Competencies (Primary), EUR base currency.
- **`Bavarian Demo School`:** German-English *Gymnasium*, 1 campus (München Schwabing), Semester calendar, German 1–6 grading (Secondary), Competencies (Primary), EUR base currency.
