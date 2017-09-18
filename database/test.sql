
-- CREATE VIEW project_consumption_per_role AS 
-- (
    SELECT
    GROUP_CONCAT(H.consumed),
    -- H.affected_to,
    H.project,
    PA.role
    FROM
    (
        SELECT
        SUM(ROUND(H.minutes / 60 / 8)) AS 'consumed',
        H.affected_to,
        H.project
        FROM hour H
        GROUP BY H.affected_to, H.project
        ORDER BY H.project
    ) H
    LEFT JOIN project_assignement PA
    ON H.project = PA.project
    GROUP BY H.project, PA.role
    ORDER BY H.project
-- );