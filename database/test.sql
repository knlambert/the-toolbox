SELECT
T.id,
T.title,
IF(T.description != '{"ops":[{"insert":"\\n"}]}' AND T.description != '', 1, 0) AS 'has_description',
T.completed,
IF(M.affected_users IS NULL, 0, M.affected_users) AS 'affected_users',
IF(C.comments IS NULL, 0, C.comments) AS 'comments',
T.task_list
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