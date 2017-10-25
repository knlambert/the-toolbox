
CREATE OR REPLACE VIEW comment_notification AS
(
    SELECT
    C.id AS 'COMMENT_ID',
    T.id AS 'TASK_ID',
    T.title AS 'TASK_TITLE',
    P.name AS 'PROJECT_NAME',
    P.id AS 'PROJECT_ID',
    U.email AS 'USER_EMAIL',
    U2.id AS 'AUTHOR_ID',
    U2.name AS 'AUTHOR_NAME',
    CONCAT("projects/", P.id, "/tasks/", T.id) AS 'TASK_LINK'
    FROM comment C
    JOIN task T
    ON C.task = T.id
    JOIN task_list TL
    ON T.task_list = TL.id
    JOIN project P
    ON TL.project = P.id
    JOIN user_has_task UHT
    ON T.id = UHT.task
    JOIN user U
    ON UHT.user = U.id
    JOIN user U2
    ON C.author = U2.id
);

-- CREATE OR REPLACE VIEW assignement_notification AS 
-- (
--     SELECT
--     T.id AS 'TASK_ID',
--     T.title AS 'TASK_TITLE',
--     P.name AS 'PROJECT_NAME',
--     P.id AS 'PROJECT_ID',
--     CONCAT("projects/", P.id, "/tasks/", T.id) AS 'TASK_LINK'
--     FROM task T
--     JOIN task_list TL
--     ON T.task_list = TL.id
--     JOIN project P
--     ON TL.project = P.id
-- );