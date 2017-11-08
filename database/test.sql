CREATE OR REPLACE VIEW task_status_change_notification AS
(
    SELECT
    T.id AS 'TASK_ID',
    T.title AS 'TASK_TITLE',
    P.name AS 'PROJECT_NAME',
    P.id AS 'PROJECT_ID',
    U.email AS 'USER_EMAIL',
    U2.email AS 'AUTHOR_EMAIL',
    CONCAT("projects/", P.id, "/tasks/", T.id) AS 'TASK_LINK'
    FROM task T
    JOIN task_list TL
    ON T.task_list = TL.id
    JOIN project P
    ON TL.project = P.id
    JOIN user_has_task UHT
    ON T.id = UHT.task
    JOIN user U
    ON UHT.user = U.id
    JOIN user U2
    ON T.author = U2.id
)