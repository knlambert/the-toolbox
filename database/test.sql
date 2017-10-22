
CREATE OR REPLACE VIEW tasks_left AS
(
    SELECT
    T.id,
    T.title,
    P.id AS 'project_id',
    P.name AS 'project_name',
    UHT.user AS 'user_id',
    CONCAT("projects/", P.id, "/tasks/", T.id) AS 'link'
    FROM task T
    JOIN user_has_task UHT
    ON T.id = UHT.task
    JOIN task_list TL
    ON T.task_list = TL.id
    JOIN project P
    ON TL.project = P.id
    WHERE T.completed = 0
    ORDER BY T.created_at
)
;