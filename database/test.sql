SELECT
T.id,
T.title,
IF(T.description != '', 1, 0) AS 'has_description',
T.completed,
IF(M.users_affected IS NULL, 0, M.users_affected) AS 'users_affected',
T.task_list
FROM task T
LEFT JOIN (
    SELECT
    COUNT(user) AS 'users_affected',
    task
    FROM user_has_task UHT
    GROUP BY task
) AS M
ON T.id = M.task
;

