-- Run by hand ONLY after the unit feedback data has been exported (or confirmed empty).
-- These tables belong to the unit-side tools, which now live outside Airman Apex.
-- Check first:  select count(*) from feedback_responses; select count(*) from flight_blocks;
drop table if exists you_said_we_did;
drop table if exists campaign_receipts;
drop table if exists feedback_responses;
drop table if exists feedback_campaigns;
drop table if exists feedback_forms;
drop table if exists flight_blocks;
