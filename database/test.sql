
CREATE VIEW project_load
AS
(
    SELECT
    TIMESTAMP(PL.day) AS 'timestamp',
    DAY(PL.day) AS 'dayNumber',
    P.id AS 'project.id',
    P.name AS 'project.name',
    U.id AS 'affected_to.id',
    U.name AS 'affected_to.name',
    PL.hour AS 'hour'
    FROM
    (
        SELECT
        DATE(H.started_at) AS 'day',
        H.project,
        H.affected_to,
        ROUND(SUM(H.minutes) / 60) as 'hour'
        FROM hour H
        GROUP BY DATE(H.started_at), H.affected_to, H.project
        ORDER BY H.project, H.affected_to, day
    )
    PL
    JOIN project P 
    ON PL.project = P.id 
    JOIN user U 
    ON PL.affected_to = U.id 
)
;