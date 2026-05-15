// Server-side proxy to DeepSeek for AI-drafted messages.
// Supports both employer-side and worker-side drafting, plus a free-form
// "custom" scenario where the drafter types their own intent.
//
// Never call DeepSeek directly from the browser — the API key must stay server-side.

export const runtime = "nodejs";

const EMPLOYER_SYSTEM_PROMPT = `You are an AI writing assistant on EcoPulse, a Malaysian B2B2G workforce platform that connects blue-collar workers, Sdn Bhd employers, and HRD Corp / TVET-funded training pathways.

You are drafting a short message FROM the Malaysian Sdn Bhd HR TO a blue-collar worker (typically B40 youth aged 18–30, based in Penang / Selangor / Johor).

Hard rules:
- Tone: warm, professional, like a real Malaysian HR. Mild Malaysian English flavour is fine. Avoid heavy Manglish slang ("lah", "leh").
- Use the worker's FIRST NAME only. Never use full names.
- Mention concrete details: salary in RM, location, HRD Corp / TVET training, training attendance % if relevant.
- Maximum 80 words. No greeting boilerplate ("Dear Sir/Madam"). No sign-off ("Best regards"). Be direct.
- DO NOT mention you are an AI or a language model. Write as if the HR composed it personally.
- DO NOT use markdown formatting or bullet points. Plain prose only.
- Output ONLY the message body. No preamble, no commentary.`;

const WORKER_SYSTEM_PROMPT = `You are an AI writing assistant on EcoPulse helping a Malaysian B40 blue-collar worker (aged 18–30) draft a polite, professional message to their potential Sdn Bhd employer.

You write FROM the worker's perspective TO the HR.

Hard rules:
- Tone: respectful, sincere, eager but not pushy. Slight Malaysian English flavour is fine, but no heavy Manglish slang ("lah", "lor").
- Address the company by name; use polite forms — avoid "Dear Sir/Madam" boilerplate.
- Reference concrete details: the role title, the salary if discussing, training pathway names where relevant.
- Maximum 60 words.
- DO NOT mention you are an AI or a language model. Write as if the worker wrote it themselves.
- DO NOT use markdown or bullet points. Plain prose only.
- Output ONLY the message body. No preamble, no commentary.`;

const EMPLOYER_SCENARIOS = {
  invite:
    "Scenario: Invite this worker to a face-to-face interview at the company's location. Suggest 1–2 specific times this week. Mention transport stipend or address SMS if helpful.",
  training:
    "Scenario: Before making the formal offer, ask the worker to first complete the suggested HRD Corp / TVET-funded training pathway. Stress that it is fully funded (no fee from worker), enrolment is 1-click via EcoPulse, and completion guarantees the interview / offer. Mention the specific pathway name and duration if available.",
  availability:
    "Scenario: Politely ask the worker to confirm full-time availability and their earliest possible start date. Keep it brief.",
  no_show:
    "Scenario: The worker was due to start work today but did not show up. Reach out kindly, ask if everything is okay, offer practical help (transport, dormitory placement), and let them know the role is held until end of today.",
  attendance_alert:
    "Scenario: The worker's training attendance has dropped below 70%. Reach out empathetically — do not be punitive. Ask if they need help (transport, family, health, housing). Offer to have an EcoPulse counsellor reach out. Keep tone supportive.",
  completed:
    "Scenario: The worker has just completed their HRD Corp / TVET training successfully. Congratulate them warmly. Formally invite them to start work, mention agreed salary and proposed start date.",
};

const WORKER_SCENARIOS = {
  worker_confirm:
    "Scenario: The worker wants to express strong interest in this role and confirm willingness to proceed with whatever next steps the HR proposed (interview, training, etc.). Be enthusiastic but professional.",
  worker_ask_compensation:
    "Scenario: Politely ask for clarification on salary, overtime pay, benefits (EPF, SOCSO), and any allowances (transport, meals, dormitory) for this role.",
  worker_ask_logistics:
    "Scenario: Politely ask about the earliest possible start date, dormitory or transport arrangements, and the working schedule (shift patterns if any) for this role.",
  worker_decline:
    "Scenario: Politely decline the role with sincere appreciation. Do not burn bridges — keep door open for future opportunities. Briefly hint at the reason (e.g., distance, family, alternative offer) without going into too much detail.",
};

function buildUserPrompt({ audience, scenario, userIntent, worker, job, training }) {
  const ctx = [
    `Worker: ${worker.name} (${worker.age} yrs, ${worker.location})`,
    `Worker skills: ${(worker.skills || []).join(", ") || "general"}`,
    `Worker reliability score: ${worker.reliabilityScore ?? "n/a"}/100`,
    `Worker availability: ${worker.availability}`,
    ``,
    `Job: ${job.title} at ${job.company}`,
    `Job location: ${job.location}`,
    `Salary: RM ${job.salary}/month`,
    `Working hours: ${job.workingHours}`,
    `Housing: ${job.housingSupport || "—"}`,
    `Training provided on the job: ${job.trainingProvided ? "Yes" : "No"}`,
  ];

  if (training) {
    ctx.push(
      ``,
      `Current training status:`,
      `- Pathway: ${training.pathway}`,
      `- Funder: ${training.funder}`,
      `- Progress: ${training.weeksCompleted}/${training.durationWeeks} weeks`,
      `- Training attendance: ${training.attendance}%`,
      `- Status: ${training.status}`,
      training.nextMilestone ? `- Next milestone: ${training.nextMilestone}` : ""
    );
  }

  let scenarioInstruction;
  if (scenario === "custom" && userIntent && userIntent.trim()) {
    const role = audience === "worker" ? "the worker" : "the HR";
    scenarioInstruction = `Scenario (${role}'s own intent — write a message accordingly): ${userIntent.trim()}`;
  } else if (audience === "worker") {
    scenarioInstruction = WORKER_SCENARIOS[scenario] || WORKER_SCENARIOS.worker_confirm;
  } else {
    scenarioInstruction = EMPLOYER_SCENARIOS[scenario] || EMPLOYER_SCENARIOS.invite;
  }

  return ctx.filter(Boolean).join("\n") + "\n\n" + scenarioInstruction;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { scenario, userIntent, worker, job, training } = body || {};
    const audience = body?.audience === "worker" ? "worker" : "employer";

    if (!worker || !job) {
      return Response.json({ error: "Missing worker or job context" }, { status: 400 });
    }

    if (scenario === "custom" && (!userIntent || !userIntent.trim())) {
      return Response.json(
        { error: "Custom scenario requires a non-empty userIntent." },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "DEEPSEEK_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const systemPrompt =
      audience === "worker" ? WORKER_SYSTEM_PROMPT : EMPLOYER_SYSTEM_PROMPT;
    const userPrompt = buildUserPrompt({
      audience,
      scenario,
      userIntent,
      worker,
      job,
      training,
    });

    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return Response.json(
        { error: `DeepSeek upstream error: ${resp.status} ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const draft = data?.choices?.[0]?.message?.content?.trim?.() || "";

    if (!draft) {
      return Response.json({ error: "Empty draft from model" }, { status: 502 });
    }

    return Response.json({
      draft,
      audience,
      scenario,
      usage: data.usage || null,
      model: data.model || "deepseek-chat",
    });
  } catch (err) {
    const causeCode = err?.cause?.code;
    const causeMsg = err?.cause?.message;
    console.error("[draft-reply] fetch failed:", {
      message: err?.message,
      causeCode,
      causeMsg,
      stack: err?.stack?.split("\n").slice(0, 3).join(" | "),
    });
    return Response.json(
      {
        error: err.message || "Failed to draft reply",
        causeCode: causeCode || null,
        causeMessage: causeMsg || null,
      },
      { status: 500 }
    );
  }
}
