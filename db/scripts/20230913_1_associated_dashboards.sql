CREATE OR REPLACE VIEW associated_dashboards AS
SELECT d.id, d.label, d.creation_date, d.creator_id, utd.user_id
FROM user_to_dashboard utd
JOIN dashboards d ON utd.dashboard_id = d.id;