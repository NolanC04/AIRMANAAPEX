-- Split unit-side tools out of Airman Apex (V3 report, Section 15: official duty training never uses the
-- venture's app). Growth-session kind "flight" becomes "team". Unit feedback and flight-block tables are
-- NOT dropped here: export them first, then run supabase/manual/drop_unit_tables.sql by hand.
alter table session_requests drop constraint if exists session_requests_kind_check;
update session_requests set kind = 'team' where kind = 'flight';
alter table session_requests add constraint session_requests_kind_check check (kind in ('one_on_one','small_group','team'));
