
-- CREATE VIEW project_consumption_per_role AS 
-- (
    SELECT
    P.id AS 'project_id',
    P.name AS 'project_name',
    PA.role,
    SUM(consumed),
    ROUND(P.provisioned_hours / 8) AS 'provisioned'
    FROM
    (
        SELECT
        SUM(ROUND(H.minutes / 60 / 8)) AS 'consumed',
        H.affected_to,
        H.project
        FROM hour H
        GROUP BY H.affected_to, H.project
    ) H
    JOIN project P
    ON H.project = P.id
    JOIN project_assignement PA
    ON H.affected_to = PA.user
    GROUP BY PA.role, P.id, P.name
    ORDER BY P.id
-- );