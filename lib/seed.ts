import { PHASES, phaseOf, sessionOf } from "./program";

const NOW = "2026-11-20T00:00:00.000Z";
// Phase 5 seed: numbers, phases and session mapping only. Content arrives through the import flow.
export function seedData() {
  return {
    profiles: [],
    invites: [],
    agreements: [],
    audit_log: [],
    settings: [{ id: "settings", modules_readable_after_completion: false, daily_reps_between_sessions: true, report_threshold: 5 }],
    feedback_forms: [],
    feedback_campaigns: [],
    feedback_responses: [],
    campaign_receipts: [],
    you_said_we_did: [],
    session_requests: [],
    request_messages: [],
    tracks: [
      { id: "track-athletes", slug: "hybrid-athletes", name: "Hybrid Athletes", line: "Run club and fitness events." },
      { id: "track-intellects", slug: "hybrid-intellects", name: "Hybrid Intellects", line: "Extended conversation on relevant, uncommon strategies." },
      { id: "track-faith", slug: "faith-forward", name: "Faith Forward", line: "Bible study rooted in application." },
      { id: "track-social", slug: "social", name: "Social", line: "Mentorship and unit events." },
    ],
    events: [
      { id: "event-guardian-gauntlet", track_id: "track-social", title: "Guardian Gauntlet", starts_at: null, location: null, description: null, capacity: null, created_at: NOW },
    ],
    rsvps: [],
    flight_blocks: [],
    modules: Array.from({ length: 24 }, (_, i) => ({
      id: `module-${i + 1}`,
      number: i + 1,
      phase: phaseOf(i + 1).key,
      session: sessionOf(i + 1),
      content: {},
      version: 0,
      status: "draft",
      closing_law_id: null,
      updated_at: NOW,
    })),
    closing_laws: [],
    import_proposals: [],
    classes: [],
    class_members: [],
    class_sessions: [],
    class_joins: [],
    module_entries: [],
    observations: [],
    daily_reps: [],
    checkins: [],
    safety_flags: [],
  };
}
export { PHASES };
