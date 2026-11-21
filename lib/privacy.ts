// Pure privacy rules, testable.
export const REPORT_THRESHOLD = 5;
export const reportVisible = (responses: number, threshold = REPORT_THRESHOLD) => responses >= threshold;

export type Answer = string | number | null;
export interface Question { id: string; kind: "choice" | "scale" | "text"; prompt: string; options?: string[] }

/** Aggregate anonymous responses per question. Text answers are listed without order or timestamps. */
export function aggregate(questions: Question[], responses: { answers: Record<string, Answer> }[]) {
  return questions.map((q) => {
    const vals = responses.map((r) => r.answers[q.id]).filter((v) => v != null && v !== "");
    if (q.kind === "text") return { q, n: vals.length, texts: [...(vals as string[])].sort() };
    const counts: Record<string, number> = {};
    for (const v of vals) counts[String(v)] = (counts[String(v)] ?? 0) + 1;
    const nums = vals.map(Number).filter((x) => !Number.isNaN(x));
    return { q, n: vals.length, counts, mean: q.kind === "scale" && nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null };
  });
}

/** Notification emails never carry the request's reason or any personal detail. */
export const notificationEmail = (link: string) => ({
  subject: "You have a new message on Airman Apex",
  text: `You have a new message on Airman Apex.\n\n${link}\n\nUnofficial program resource. Not an activity of the U.S. Air Force or DoD; no federal endorsement implied.`,
});

export const CRISIS = "Military Crisis Line: dial 988 then press 1, or text 838255.";
