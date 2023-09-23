CREATE OR REPLACE VIEW categories_from_dashboards AS
SELECT ca.id, ca.label, ca.color, i.label AS icon_label, dc.dashboard_id AS dashboard_id
FROM categories ca
JOIN icons i ON i.id = ca.icON_id
JOIN dashboard_categories dc ON dc.category_id = ca.id;