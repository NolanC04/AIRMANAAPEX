import { test } from "node:test";
import assert from "node:assert/strict";
import { MEASURES, scoreOf, stat, effect, toCSV, type CheckinRow } from "../lib/measures.ts";
import { reportVisible, aggregate, notificationEmail } from "../lib/privacy.ts";
import { contentReadable, slideReadable, classCode } from "../lib/access.ts";
import { safetyHit, shouldReflect, parseRead } from "../lib/gene-rules.ts";
import { diff } from "../lib/diff.ts";
import { buildSlides, visibleSlides } from "../lib/slides.ts";

const [swls, gse, brs] = MEASURES;

test("BRS reverse-scores items 2/4/6 and means; SWLS sums", () => {
  assert.equal(scoreOf(brs, [5, 1, 5, 1, 5, 1]), 5);
  assert.equal(scoreOf(brs, [1, 5, 1, 5, 1, 5]), 1);
  assert.equal(scoreOf(swls, [7, 7, 7, 7, 7]), 35);
  assert.equal(scoreOf(gse, [1, 2, 3]), null); // incomplete never scores
});

test("diff-in-diff and Cohen's d match a hand calculation", () => {
  const s = (v: number) => [v, v, v, v, v]; // SWLS total = 5v
  const rows: CheckinRow[] = [
    { anon_id: "a", group: "cohort", wave: "T0", responses: { swls: s(3) } }, // 15
    { anon_id: "b", group: "cohort", wave: "T0", responses: { swls: s(4) } }, // 20
    { anon_id: "a", group: "cohort", wave: "T2", responses: { swls: s(5) } }, // 25
    { anon_id: "b", group: "cohort", wave: "T2", responses: { swls: s(6) } }, // 30
    { anon_id: "c", group: "comparison", wave: "T0", responses: { swls: s(3) } }, // 15
    { anon_id: "d", group: "comparison", wave: "T0", responses: { swls: s(4) } }, // 20
    { anon_id: "c", group: "comparison", wave: "T2", responses: { swls: s(4) } }, // 20
    { anon_id: "d", group: "comparison", wave: "T2", responses: { swls: s(4) } }, // 20
  ];
  // cohort 17.5 → 27.5 (+10); comparison 17.5 → 20 (+2.5); DiD = 7.5
  // cohort SDs: T0 sd = sqrt(((15-17.5)^2+(20-17.5)^2)/1) = 3.5355; T2 same; pooled = 3.5355; d = 10/3.5355 = 2.828
  const e = effect(rows, swls);
  assert.equal(e.latest, "T2");
  assert.equal(e.did, 7.5);
  assert.ok(Math.abs((e.d as number) - 2.8284) < 1e-3);
  assert.equal(stat(rows, "cohort", "T0", swls)?.n, 2);
  assert.match(toCSV(rows).split("\n")[1], /^a,cohort,T0,15,,$/);
});

test("feedback report hidden at 4, visible at 5; aggregates carry no ids", () => {
  assert.equal(reportVisible(4), false);
  assert.equal(reportVisible(5), true);
  const agg = aggregate([{ id: "q1", kind: "scale", prompt: "?" }], [{ answers: { q1: 4 } }, { answers: { q1: 2 } }]);
  assert.equal(agg[0].mean, 3);
});

test("notification email never contains request content", () => {
  const e = notificationEmail("https://x/app/unit/requests/1");
  assert.equal(e.subject, "You have a new message on Airman Apex");
  assert.ok(!/note|reason/i.test(e.text));
});

const learner = { id: "u1", role: "learner" } as never;
const open = { id: "s1", class_id: null, code: "ABC123", module_numbers: [1, 9, 17], opened_by: "f", opened_at: "", closed_at: null };
test("class wall: readable only while joined to an open session that includes the module", () => {
  const opts = { sealed: false, readableAfterCompletion: false };
  assert.equal(contentReadable(learner, 1, [open], [], opts), false);
  assert.equal(contentReadable(learner, 1, [open], [{ class_session_id: "s1", user_id: "u1" }], opts), true);
  assert.equal(contentReadable(learner, 2, [open], [{ class_session_id: "s1", user_id: "u1" }], opts), false);
  assert.equal(contentReadable(learner, 1, [{ ...open, closed_at: "now" }], [{ class_session_id: "s1", user_id: "u1" }], opts), false);
  assert.equal(contentReadable(learner, 1, [], [], { sealed: true, readableAfterCompletion: true }), true);
  assert.equal(contentReadable({ id: "x", role: "admin" } as never, 5, [], [], opts), true);
  assert.equal(contentReadable({ id: "x", role: "comparison" } as never, 1, [open], [{ class_session_id: "s1", user_id: "x" }], opts), false);
});

test("Bridge gate: slides 9+ withheld until submitted", () => {
  assert.equal(slideReadable(8, false), true);
  assert.equal(slideReadable(9, false), false);
  assert.equal(slideReadable(13, true), true);
  const slides = buildSlides(1, {});
  assert.equal(visibleSlides(slides, false).length, 8);
  assert.equal(visibleSlides(slides, true).length, 13);
  assert.match(slides[7].body[0], /\[NOLAN: the Bridge question\]/);
});

test("GENE rules: safety pre-check, cadence halves below 70%, malformed output fails", () => {
  assert.equal(safetyHit("some days I want to die"), true);
  assert.equal(safetyHit("I died laughing at PT"), false);
  assert.equal(shouldReflect(3, []), true);
  assert.equal(shouldReflect(3, ["not", "not", "true"]), false); // 33% → every sixth
  assert.equal(shouldReflect(6, ["not", "not", "true"]), true);
  assert.throws(() => parseRead("no json here"));
  assert.equal(parseRead('{"reasoning_grade":3,"thinking_pattern":"x","follow_up_question":"Why?"}').follow_up_question, "Why?");
});

test("import diff shows only changed fields and never deletes", () => {
  assert.deepEqual(diff({ title: "A", arc: "x" }, { title: "B" }), [{ field: "title", before: "A", after: "B" }]);
  assert.match(classCode(() => 0), /^[A-Z0-9]{6}$/);
});
