CREATE OR REPLACE VIEW task_sum_up 
AS (
    SELECT
    T.id,
    T.title,
    IF(T.description != '{"ops":[{"insert":"\\n"}]}' AND T.description != '', 1, 0) AS 'has_description',
    T.completed,
    IF(M.affected_users IS NULL, 0, M.affected_users) AS 'affected_users',
    IF(C.comments IS NULL, 0, C.comments) AS 'comments',
    T.task_list,
    IF(TGS.tag_names IS NULL, "", TGS.tag_names) AS 'tag_names',
    IF(TGS.tag_colors IS NULL, "", TGS.tag_colors) AS 'tag_colors'
    FROM task T
    LEFT JOIN (
        SELECT
        COUNT(user) AS 'affected_users',
        task
        FROM user_has_task UHT
        GROUP BY task
    ) AS M
    ON T.id = M.task
    LEFT JOIN (
        SELECT
        COUNT(*) AS 'comments',
        comment.task AS 'task'
        FROM
        comment
        GROUP BY task
    ) AS C
    ON T.id = C.task
    LEFT JOIN (
        SELECT 
        THT.task,
        GROUP_CONCAT(T.name) AS 'tag_names',
        GROUP_CONCAT(T.color) AS 'tag_colors'
        FROM task_has_tag THT
        LEFT JOIN tag T
        ON THT.tag = T.id
        GROUP BY THT.task
    ) AS TGS
    ON T.id = TGS.task
);

