// EcoPulse rule-based matching engine.
//
// Match Score =
//   0.30 × Skill Match
// + 0.20 × Location Match
// + 0.20 × Salary Match
// + 0.15 × Availability Match
// + 0.10 × Training Fit
// + 0.05 × Reliability Score
//
// Each sub-score returns 0..1. The weighted total is rescaled to 0..100.

export const MATCHING_WEIGHTS = {
  skill: 0.3,
  location: 0.2,
  salary: 0.2,
  availability: 0.15,
  training: 0.1,
  reliability: 0.05,
};

const norm = (s) => (s || "").toString().trim().toLowerCase();
const cityOf = (loc) => norm(loc).split(/\s+/)[0] || "";

export function skillMatch(workerSkills = [], jobSkills = []) {
  if (jobSkills.length === 0) return 0.5;
  const w = new Set(workerSkills.map(norm));
  const overlap = jobSkills.filter((s) => w.has(norm(s))).length;
  return overlap / jobSkills.length;
}

export function locationMatch(workerLocation, jobLocation) {
  const wl = norm(workerLocation);
  const jl = norm(jobLocation);
  if (!wl || !jl) return 0;
  if (wl === jl) return 1;
  if (cityOf(wl) === cityOf(jl)) return 0.8; // same city, different district
  return 0.2;
}

export function salaryMatch(expectedSalary, jobSalary) {
  if (!expectedSalary || !jobSalary) return 0.5;
  if (jobSalary >= expectedSalary) {
    // Reward jobs that meet/exceed expectations, with diminishing returns.
    const surplus = (jobSalary - expectedSalary) / expectedSalary;
    return Math.min(1, 0.9 + surplus * 0.5);
  }
  const gap = (expectedSalary - jobSalary) / expectedSalary;
  return Math.max(0, 1 - gap * 2);
}

export function availabilityMatch(workerAvailability, jobWorkingHours) {
  const w = norm(workerAvailability);
  const j = norm(jobWorkingHours);
  if (!w || !j) return 0.5;
  if (w === j) return 1;
  if (w === "flexible" || j === "flexible") return 0.75;
  return 0.3;
}

export function trainingFit(workerInterest = [], jobTrainingProvided) {
  if (!jobTrainingProvided) return workerInterest.length === 0 ? 0.5 : 0.3;
  return workerInterest.length > 0 ? 1 : 0.6;
}

export function reliabilityComponent(reliabilityScore = 0) {
  return Math.max(0, Math.min(1, reliabilityScore / 100));
}

export function scoreMatch(worker, job) {
  const parts = {
    skill: skillMatch(worker.skills, job.skillsRequired),
    location: locationMatch(worker.location, job.location),
    salary: salaryMatch(worker.expectedSalary, job.salary),
    availability: availabilityMatch(worker.availability, job.workingHours),
    training: trainingFit(worker.trainingInterest, job.trainingProvided),
    reliability: reliabilityComponent(worker.reliabilityScore),
  };

  const weighted =
    parts.skill * MATCHING_WEIGHTS.skill +
    parts.location * MATCHING_WEIGHTS.location +
    parts.salary * MATCHING_WEIGHTS.salary +
    parts.availability * MATCHING_WEIGHTS.availability +
    parts.training * MATCHING_WEIGHTS.training +
    parts.reliability * MATCHING_WEIGHTS.reliability;

  const score = Math.round(weighted * 100);

  return {
    score,
    parts,
    reason: explain(parts, worker, job),
  };
}

function explain(parts, worker, job) {
  const notes = [];
  if (parts.skill >= 0.75) notes.push("strong skill overlap");
  else if (parts.skill >= 0.4) notes.push("partial skill overlap");
  else notes.push("limited skill overlap — upskilling needed");

  if (parts.location >= 0.9) notes.push("same district");
  else if (parts.location >= 0.7) notes.push("same city");
  else notes.push("location mismatch");

  if (parts.salary >= 0.9) notes.push("salary meets expectation");
  else if (parts.salary >= 0.6) notes.push("salary close to expectation");
  else notes.push("salary below expectation");

  if (parts.availability === 1) notes.push("availability aligned");
  if (parts.training >= 0.9 && job.trainingProvided)
    notes.push("training pathway fit");

  return notes.join(", ");
}

export function rankJobsForWorker(worker, jobs) {
  return jobs
    .map((job) => ({ job, ...scoreMatch(worker, job) }))
    .sort((a, b) => b.score - a.score);
}

export function rankWorkersForJob(job, workers) {
  return workers
    .map((worker) => ({ worker, ...scoreMatch(worker, job) }))
    .sort((a, b) => b.score - a.score);
}

export function recommendTraining(worker, jobs, pathways) {
  // Identify in-demand skills the worker lacks; recommend pathways that
  // teach them, prioritising the worker's stated training interests.
  const workerSkills = new Set((worker.skills || []).map(norm));
  const demand = new Map();
  jobs.forEach((job) => {
    (job.skillsRequired || []).forEach((s) => {
      const k = norm(s);
      demand.set(k, (demand.get(k) || 0) + 1);
    });
  });

  return pathways
    .map((p) => {
      const teaches = (p.skills || []).map(norm);
      const newSkills = teaches.filter((s) => !workerSkills.has(s));
      const demandScore = newSkills.reduce(
        (acc, s) => acc + (demand.get(s) || 0),
        0
      );
      const interestBoost = (worker.trainingInterest || []).some((i) =>
        teaches.includes(norm(i))
      )
        ? 1
        : 0;
      return { pathway: p, demandScore, interestBoost, newSkills };
    })
    .sort(
      (a, b) =>
        b.interestBoost - a.interestBoost || b.demandScore - a.demandScore
    );
}

export const SUGGESTED_ACTIONS = {
  invite: "Invite to interview",
  shortlist: "Shortlist",
  upskill: "Suggest training first",
};

// Employer-side label — what EcoPulse AI recommends the employer DO with this candidate.
export function suggestedAction(score) {
  if (score >= 85) return SUGGESTED_ACTIONS.invite;
  if (score >= 70) return SUGGESTED_ACTIONS.shortlist;
  return SUGGESTED_ACTIONS.upskill;
}

// Worker-side label — what EcoPulse recommends the worker DO about this job.
export function workerActionLabel(score) {
  if (score >= 85) return "Strong match — apply now";
  if (score >= 70) return "Good match — apply";
  return "Take a funded training first";
}
