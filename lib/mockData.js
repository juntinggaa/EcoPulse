// EcoPulse mock dataset — Malaysia pilot.
// Salaries in MYR (RM). Locations across Penang, Selangor, Johor manufacturing belt.

export const workers = [
  {
    id: "w1",
    name: "Ahmad Faizal",
    age: 22,
    phone: "+60 12-443 2198",
    location: "Penang Bayan Lepas",
    preferredJobType: "Assembly Operator",
    skills: ["assembly", "packing", "CNC basics"],
    certifications: ["CNC Basics", "Basic safety induction"],
    expectedSalary: 2200,
    availability: "full-time",
    trainingInterest: ["advanced CNC", "semiconductor assembly"],
    trainingProgram: "CNC Basics",
    trainingAttendance: 88,
    trainingStatus: "Completed",
    workReadiness: "Ready for placement",
    recommendedRole: "Assembly Operator",
    matchScore: 88,
    hiringStatus: "Hired",
    workAttendance: 88,
    retentionStatus: "30-day retained",
    suggestedAction: "Continue onboarding",
    workExperience:
      "6 months packing line assistant at Bayan Lepas contract manufacturer.",
    reliabilityScore: 88,
    verification: {
      realName: "Verified",
      phone: "Verified",
      idDocument: "Verified",
      skillProfile: "Completed",
    },
  },
  {
    id: "w2",
    name: "Lim Wei Ming",
    age: 23,
    phone: "+60 16-782 9044",
    location: "Shah Alam",
    preferredJobType: "Warehouse Assistant",
    skills: ["warehouse", "forklift", "inventory"],
    certifications: ["Forklift licence", "Occupational safety basics"],
    expectedSalary: 2500,
    availability: "shift work",
    trainingInterest: ["logistics management"],
    trainingProgram: "Warehouse Operations",
    trainingAttendance: 76,
    trainingStatus: "In progress",
    workReadiness: "Almost ready",
    recommendedRole: "Warehouse Assistant",
    matchScore: 79,
    hiringStatus: "Interview scheduled",
    workAttendance: null,
    retentionStatus: "Pending",
    suggestedAction: "Confirm interview",
    workExperience:
      "2 years warehouse picking, stock count, and loading support in Shah Alam.",
    reliabilityScore: 79,
    verification: {
      realName: "Verified",
      phone: "Verified",
      idDocument: "Verified",
      skillProfile: "Completed",
    },
  },
  {
    id: "w3",
    name: "Priya Nair",
    age: 21,
    phone: "+60 11-2307 6618",
    location: "Penang Bayan Lepas",
    preferredJobType: "QC Trainee",
    skills: ["inspection", "basic assembly", "documentation"],
    certifications: ["SPM", "Basic first aid"],
    expectedSalary: 1800,
    availability: "full-time",
    trainingInterest: ["quality control"],
    trainingProgram: "Quality Control Fundamentals",
    trainingAttendance: 42,
    trainingStatus: "Training at risk",
    workReadiness: "Not ready yet",
    recommendedRole: "QC Trainee",
    matchScore: 82,
    hiringStatus: "Not yet placed",
    workAttendance: null,
    retentionStatus: "Pending",
    suggestedAction: "Send training reminder",
    workExperience: "",
    reliabilityScore: 70,
    verification: {
      realName: "Verified",
      phone: "Verified",
      idDocument: "Pending",
      skillProfile: "Pending",
    },
  },
];

export const jobs = [
  {
    id: "j1",
    company: "Penang Precision Manufacturing Sdn Bhd",
    title: "Assembly Operator",
    location: "Penang Bayan Lepas",
    salary: 2400,
    skillsRequired: ["assembly", "packing", "CNC basics"],
    workingHours: "full-time",
    trainingProvided: true,
    housingSupport: "Dormitory available",
    jobQualityScore: 82,
    verification: {
      businessLicence: "Verified",
      companyContact: "Verified",
      paymentAccount: "Verified",
    },
  },
  {
    id: "j2",
    company: "Klang Valley Logistics Sdn Bhd",
    title: "Warehouse Assistant",
    location: "Selangor Klang",
    salary: 2500,
    skillsRequired: ["warehouse", "inventory", "packing"],
    workingHours: "full-time",
    trainingProvided: true,
    housingSupport: "No",
    jobQualityScore: 79,
    verification: {
      businessLicence: "Verified",
      companyContact: "Verified",
      paymentAccount: "Verified",
    },
  },
  {
    id: "j3",
    company: "Iskandar QC Solutions Sdn Bhd",
    title: "QC Trainee (SKM Level 2)",
    location: "Johor Pasir Gudang",
    salary: 1900,
    skillsRequired: ["inspection", "quality checking"],
    workingHours: "flexible",
    trainingProvided: true,
    housingSupport: "Dormitory available",
    jobQualityScore: 85,
    verification: {
      businessLicence: "Verified",
      companyContact: "Verified",
      paymentAccount: "Verified",
    },
  },
];

export const trainingPathways = [
  {
    id: "t1",
    name: "HRD Corp Claimable: CNC Machining Basics",
    duration: "4 weeks",
    funded: true,
    skills: ["CNC", "machining", "quality checking"],
  },
  {
    id: "t2",
    name: "TVET SKM Level 2 — Warehouse Operations",
    duration: "3 weeks",
    funded: true,
    skills: ["warehouse", "inventory", "forklift"],
  },
  {
    id: "t3",
    name: "MyFutureJobs · Quality Control Fundamentals",
    duration: "2 weeks",
    funded: true,
    skills: ["inspection", "quality checking", "documentation"],
  },
];

export const sectors = [
  "Semiconductors & Electronics",
  "Logistics & E-commerce",
  "F&B / Food Processing",
  "Automotive",
  "Palm Oil & Plantation",
  "Facility Management",
];

export const governmentMetrics = {
  verifiedWorkers: 1200,
  verifiedEmployers: 48,
  trainingEnrolments: 320,
  trainingCompletionRate: 78,
  successfulPlacements: 410,
  retention30Day: 68,
  atRiskTrainees: 42,
  youthEmploymentMoM: 12,
};

export const employerDashboardMetrics = {
  openRoles: 12,
  matchedCandidates: 86,
  trainingReadyCandidates: 34,
  placedWorkers: 28,
  retention30Day: 72,
};

export const candidateJourneyRows = [
  {
    id: "journey-ahmad",
    name: "Ahmad Faizal",
    age: 22,
    location: "Penang Bayan Lepas",
    skills: ["Assembly", "Packing", "CNC Basics"],
    expectedSalary: 5200,
    availability: "Full-time",
    verificationStatus: "Verified",
    trainingProgram: "CNC Basics",
    trainingAttendance: 88,
    trainingStatus: "Completed CNC Basics",
    workReadiness: "Ready for placement",
    recommendedRole: "Assembly Operator",
    matchScore: 88,
    hiringStatus: "Hired",
    workAttendance: 88,
    retentionStatus: "30-day retained",
    suggestedAction: "Continue onboarding",
  },
  {
    id: "journey-priya",
    name: "Priya Nair",
    age: 21,
    location: "Penang Bayan Lepas",
    skills: ["Inspection", "Basic Assembly", "Documentation"],
    expectedSalary: 4800,
    availability: "Full-time",
    verificationStatus: "Verified",
    trainingProgram: "Quality Control Fundamentals",
    trainingAttendance: 42,
    trainingStatus: "Training at risk",
    workReadiness: "Not ready yet",
    recommendedRole: "QC Trainee",
    matchScore: 82,
    hiringStatus: "Not yet placed",
    workAttendance: null,
    retentionStatus: "Pending",
    suggestedAction: "Send training reminder",
  },
  {
    id: "journey-lim",
    name: "Lim Wei Ming",
    age: 23,
    location: "Shah Alam",
    skills: ["Warehouse", "Inventory", "Packing"],
    expectedSalary: 5000,
    availability: "Shift work",
    verificationStatus: "Verified",
    trainingProgram: "Warehouse Operations",
    trainingAttendance: 76,
    trainingStatus: "In progress",
    workReadiness: "Almost ready",
    recommendedRole: "Warehouse Assistant",
    matchScore: 79,
    hiringStatus: "Interview scheduled",
    workAttendance: null,
    retentionStatus: "Pending",
    suggestedAction: "Confirm interview",
  },
  {
    id: "journey-aisyah",
    name: "Nur Aisyah",
    age: 20,
    location: "Johor Bahru",
    skills: ["Packing", "Sorting", "Basic Machine Operation"],
    expectedSalary: 4600,
    availability: "Full-time",
    verificationStatus: "Verified",
    trainingProgram: "No training required",
    trainingAttendance: null,
    trainingStatus: "No training required",
    workReadiness: "Ready for placement",
    recommendedRole: "Packing Operator",
    matchScore: 75,
    hiringStatus: "Shortlisted",
    workAttendance: null,
    retentionStatus: "Pending",
    suggestedAction: "Message candidate",
  },
];

export const trainingToPlacementFunnel = [
  { stage: "Verified workers", count: 1200 },
  { stage: "Training enrolled", count: 320 },
  { stage: "Training completed", count: 250 },
  { stage: "Job matched", count: 520 },
  { stage: "Job placed", count: 410 },
  { stage: "30-day retained", count: 279 },
];

export const atRiskTrainingRows = [
  {
    worker: "Priya Nair",
    programme: "Quality Control Fundamentals",
    attendance: 42,
    riskLevel: "Training at risk",
    intervention: "Send reminder + trainer follow-up",
  },
  {
    worker: "Muhammad Hafiz",
    programme: "Warehouse Operations",
    attendance: 55,
    riskLevel: "Medium risk",
    intervention: "Check schedule conflict",
  },
  {
    worker: "Tan Jia En",
    programme: "CNC Basics",
    attendance: 38,
    riskLevel: "High risk",
    intervention: "Counsellor / training provider call",
  },
];

export const stateOutcomeBreakdown = [
  {
    name: "Penang",
    workersVerified: 460,
    trainingCompleted: 104,
    placements: 142,
    retention30Day: 72,
  },
  {
    name: "Selangor",
    workersVerified: 410,
    trainingCompleted: 86,
    placements: 128,
    retention30Day: 69,
  },
  {
    name: "Johor",
    workersVerified: 330,
    trainingCompleted: 60,
    placements: 96,
    retention30Day: 64,
  },
];

export const sectorOutcomeBreakdown = [
  {
    name: "Manufacturing",
    workersVerified: 520,
    trainingCompleted: 126,
    placements: 188,
    retention30Day: 73,
  },
  {
    name: "Logistics",
    workersVerified: 310,
    trainingCompleted: 74,
    placements: 104,
    retention30Day: 69,
  },
  {
    name: "F&B",
    workersVerified: 180,
    trainingCompleted: 28,
    placements: 62,
    retention30Day: 63,
  },
  {
    name: "Service Operations",
    workersVerified: 190,
    trainingCompleted: 22,
    placements: 56,
    retention30Day: 61,
  },
];

export const placementBySector = [
  { sector: "Semiconductors", placements: 168 },
  { sector: "Logistics", placements: 104 },
  { sector: "F&B", placements: 62 },
  { sector: "Automotive", placements: 44 },
  { sector: "Plantation", placements: 32 },
];

export const trainingCompletionTrend = [
  { month: "Nov", rate: 62 },
  { month: "Dec", rate: 66 },
  { month: "Jan", rate: 70 },
  { month: "Feb", rate: 73 },
  { month: "Mar", rate: 76 },
  { month: "Apr", rate: 78 },
];

export const matchOutcomes = [
  { bucket: "Hired", count: 410 },
  { bucket: "Interviewing", count: 188 },
  { bucket: "Matched, not contacted", count: 234 },
];

// State-level breakdown for the Malaysia pilot.
export const placementByState = [
  { state: "Penang", placements: 142, levyUtilisation: 72 },
  { state: "Selangor", placements: 128, levyUtilisation: 65 },
  { state: "Johor", placements: 96, levyUtilisation: 58 },
  { state: "Kuala Lumpur", placements: 28, levyUtilisation: 51 },
  { state: "Perak", placements: 16, levyUtilisation: 44 },
];

// Worker journey funnel — registered → verified → trained → matched → hired → retained.
export const workerPipeline = [
  { stage: "Registered", count: 4820 },
  { stage: "MyKad verified", count: 3640 },
  { stage: "Skill-profiled", count: 2150 },
  { stage: "Trained", count: 980 },
  { stage: "Matched", count: 832 },
  { stage: "Hired", count: 410 },
  { stage: "Retained 30d", count: 279 },
];

// Placement economics — cost story for government / HRD Corp.
export const placementEconomics = {
  ecoPulseCostPerPlacement: 320, // RM
  traditionalAgencyCost: 1450, // RM, blue-collar recruiter / agency average
  hrdCorpLevyClaimable: 880, // RM avg claimed per trained placement
  retentionUpliftPP: 18, // percentage points vs non-verified hires
};

// Training pathway ROI — ties HRD Corp / TVET investment to outcomes.
export const trainingROI = [
  {
    pathway: "HRD Corp Claimable · CNC Machining",
    enrolments: 84,
    completed: 71,
    placed: 58,
    costPerPlacement: 290,
  },
  {
    pathway: "TVET SKM L2 · Warehouse Operations",
    enrolments: 102,
    completed: 84,
    placed: 73,
    costPerPlacement: 240,
  },
  {
    pathway: "MyFutureJobs · QC Fundamentals",
    enrolments: 64,
    completed: 51,
    placed: 41,
    costPerPlacement: 310,
  },
  {
    pathway: "TVET SKM L2 · Forklift & Logistics",
    enrolments: 48,
    completed: 39,
    placed: 33,
    costPerPlacement: 220,
  },
  {
    pathway: "HRD Corp Claimable · Semiconductor Assembly",
    enrolments: 38,
    completed: 31,
    placed: 26,
    costPerPlacement: 340,
  },
];

// B40 youth unemployment — pilot vs national baseline.
export const youthUnemploymentTrend = [
  { month: "Nov", national: 11.2, ecoPulsePilot: 10.4 },
  { month: "Dec", national: 11.0, ecoPulsePilot: 9.6 },
  { month: "Jan", national: 10.9, ecoPulsePilot: 8.9 },
  { month: "Feb", national: 10.6, ecoPulsePilot: 8.1 },
  { month: "Mar", national: 10.5, ecoPulsePilot: 7.4 },
  { month: "Apr", national: 10.4, ecoPulsePilot: 6.8 },
];

// 2-way messaging threads — worker ↔ employer with EcoPulse AI in-thread.
// AI messages have an `audience` field: "worker" | "employer" | "both" (default both).
// Worker/employer messages always show to both sides.
export const messageThreads = [
  {
    id: "m1",
    workerId: "w1",
    jobId: "j1",
    employerContact: "Lee Wei Ming · HR Manager",
    unread: 1,
    lastUpdate: "2 hours ago",
    messages: [
      {
        id: "a1",
        from: "ai",
        audience: "employer",
        text: "EcoPulse matched Ahmad Faizal (88%) to your Assembly Operator role. Skill gap detected: advanced CNC. Suggested pathway — HRD Corp Claimable · CNC Machining Basics (4 weeks, fully funded).",
        time: "Today · 10:02",
      },
      {
        id: "a1w",
        from: "ai",
        audience: "worker",
        text: "Penang Precision Manufacturing matched you to their Assembly Operator role (88% match). They'd like you to complete HRD Corp Claimable · CNC Machining Basics (4 weeks, fully funded) before the offer — no fee from you.",
        time: "Today · 10:02",
      },
      {
        id: "a2",
        from: "employer",
        text: "Hi Ahmad! Your match score is strong, but we'd like you to complete a short CNC training before we make the offer. EcoPulse can enrol you in HRD Corp CNC Machining — 4 weeks, fully funded. Are you in?",
        time: "Today · 10:05",
      },
      {
        id: "a3w",
        from: "ai",
        audience: "worker",
        action: {
          kind: "enrol",
          pathway: "HRD Corp Claimable · CNC Machining Basics",
          duration: "4 weeks",
          funder: "HRD Corp",
        },
        text: "1-click enrolment available — fully funded by HRD Corp. We'll handle the paperwork.",
        time: "Today · 10:05",
      },
      {
        id: "a3e",
        from: "ai",
        audience: "employer",
        text: "Ahmad can enrol in 1 click. EcoPulse will send weekly training progress and training attendance reports automatically.",
        time: "Today · 10:05",
      },
      {
        id: "a4",
        from: "worker",
        text: "Yes, I'm interested! When is the next intake?",
        time: "Today · 10:18",
      },
      {
        id: "a5",
        from: "employer",
        text: "Next intake is 20 May 2026. Complete week 2 and we'll guarantee your interview slot.",
        time: "Today · 10:22",
      },
    ],
  },
  {
    id: "m2",
    workerId: "w2",
    jobId: "j2",
    employerContact: "Norhaslina binti Yusof · Talent Lead",
    unread: 0,
    lastUpdate: "yesterday",
    messages: [
      {
        id: "b1",
        from: "ai",
        audience: "employer",
        text: "Lim Wei Ming matches your Warehouse Assistant role at 91% — forklift cert verified, same state, reliability 79.",
        time: "Tue · 14:30",
      },
      {
        id: "b1w",
        from: "ai",
        audience: "worker",
        text: "Klang Valley Logistics Sdn Bhd matched you to their Warehouse Assistant role (91% match) — your forklift cert clinched it.",
        time: "Tue · 14:30",
      },
      {
        id: "b2",
        from: "employer",
        action: { kind: "interview", date: "18 May 2026", time: "10:00" },
        text: "Hi Lim, your warehouse + forklift profile is a great fit. Can you come for an interview on 18 May at our Klang DC?",
        time: "Tue · 14:33",
      },
      {
        id: "b3",
        from: "worker",
        text: "Yes! 18 May works for me. What time?",
        time: "Tue · 14:50",
      },
      {
        id: "b4",
        from: "employer",
        text: "10am. We'll send the address via SMS and email. Bring your IC and forklift cert.",
        time: "Tue · 14:52",
      },
      {
        id: "b5",
        from: "ai",
        audience: "both",
        text: "Interview confirmed in EcoPulse calendar. Reminder will be sent to both sides 24h before.",
        time: "Tue · 14:53",
      },
    ],
  },
  {
    id: "m3",
    workerId: "w3",
    jobId: "j3",
    employerContact: "Devi Raman · QC Lead",
    unread: 0,
    lastUpdate: "3 days ago",
    messages: [
      {
        id: "c1",
        from: "ai",
        audience: "employer",
        text: "Priya Nair matches your QC Trainee role at 76%. EcoPulse recommends pairing with MyFutureJobs · Quality Control Fundamentals (2 weeks, fully funded) — completion should gate the trainee role.",
        time: "Mon · 09:15",
      },
      {
        id: "c1w",
        from: "ai",
        audience: "worker",
        text: "Iskandar QC Solutions Sdn Bhd is offering you a trainee slot (76% match). Completing MyFutureJobs · Quality Control Fundamentals (2 weeks, fully funded) will unlock the full role.",
        time: "Mon · 09:15",
      },
      {
        id: "c2",
        from: "employer",
        text: "Welcome Priya! We'd like to offer you a trainee slot. Completion of QC Fundamentals gates the full role — EcoPulse will enrol you, no fee.",
        time: "Mon · 09:20",
      },
      {
        id: "c3w",
        from: "ai",
        audience: "worker",
        action: {
          kind: "enrol",
          pathway: "MyFutureJobs · Quality Control Fundamentals",
          duration: "2 weeks",
          funder: "MyFutureJobs",
        },
        text: "1-click enrolment available — fully funded by MyFutureJobs.",
        time: "Mon · 09:20",
      },
      {
        id: "c3e",
        from: "ai",
        audience: "employer",
        text: "Priya can enrol in 1 click. We'll alert you immediately if training attendance drops below 70%.",
        time: "Mon · 09:20",
      },
      {
        id: "c4",
        from: "worker",
        text: "Thank you so much! Yes, I'd like to enrol.",
        time: "Mon · 11:00",
      },
      {
        id: "c5",
        from: "ai",
        audience: "employer",
        text: "Training attendance alert: Priya has missed the first 2 hands-on sessions. Current training attendance: 42%. Consider reaching out before she drops out of the course.",
        time: "Thu · 09:00",
      },
    ],
  },
];

// Training progress per worker — visible to the employer in messaging.
// status: not_enrolled | enrolled | in_progress | at_risk | completed | dropped
export const trainingProgress = {
  w1: {
    pathway: "HRD Corp Claimable · CNC Machining Basics",
    funder: "HRD Corp",
    durationWeeks: 4,
    weeksCompleted: 4,
    status: "completed",
    attendance: 88,
    nextMilestone: "Training completed — ready for Assembly Operator placement",
    lastActivity: "2 days ago",
    enrolmentDate: "2026-05-08",
    provider: "Penang Skills Development Centre (PSDC)",
  },
  w2: {
    pathway: "TVET SKM Level 2 — Warehouse Operations",
    funder: "TVET",
    durationWeeks: 3,
    weeksCompleted: 2,
    status: "in_progress",
    attendance: 76,
    nextMilestone: "Final practical assessment before placement",
    lastActivity: "today",
    enrolmentDate: "2026-05-09",
    provider: "Selangor Skills Centre",
  },
  w3: {
    pathway: "MyFutureJobs · Quality Control Fundamentals",
    funder: "MyFutureJobs",
    durationWeeks: 2,
    weeksCompleted: 0,
    status: "at_risk",
    attendance: 42,
    nextMilestone: "Missed Week 1 hands-on — re-attendance window closes Friday",
    lastActivity: "5 days ago",
    enrolmentDate: "2026-05-08",
    provider: "Penang Skills Development Centre (PSDC)",
  },
};

// Quick-action templates surfaced in the composer.
export const employerQuickActions = [
  {
    id: "invite",
    label: "Invite to interview",
    template:
      "Hi {worker}, your match score is strong. Are you available for an interview at our {location} office this week?",
  },
  {
    id: "training",
    label: "Suggest training pathway",
    template:
      "Hi {worker}, before we make the offer we'd like you to complete {pathway}. EcoPulse can enrol you — fully funded, no fee. Interested?",
  },
  {
    id: "availability",
    label: "Request availability",
    template:
      "Hi {worker}, can you confirm your full-time availability and earliest start date?",
  },
];

export const workerQuickReplies = [
  "Yes, I'm interested!",
  "When can we meet?",
  "Tell me more about the role",
  "I'd like to enrol in the training",
];

// Worker-side AI quick-drafts (scenarios understood by /api/draft-reply).
export const workerQuickDrafts = [
  { id: "worker_confirm", label: "Confirm interest in role" },
  { id: "worker_ask_compensation", label: "Ask about salary & benefits" },
  { id: "worker_ask_logistics", label: "Ask about start date & housing" },
  { id: "worker_decline", label: "Politely decline" },
];

// Top employers — used for government dashboard summary.
export const topEmployers = [
  { name: "Penang Precision Manufacturing Sdn Bhd", placements: 84, retention: 74 },
  { name: "Klang Valley Logistics Sdn Bhd", placements: 62, retention: 71 },
  { name: "Iskandar QC Solutions Sdn Bhd", placements: 48, retention: 69 },
  { name: "Bayan Lepas Semiconductor Sdn Bhd", placements: 41, retention: 76 },
  { name: "Shah Alam Auto Parts Sdn Bhd", placements: 35, retention: 64 },
];
