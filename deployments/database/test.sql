SELECT
T.id AS 'TASK_ID',
T.title AS 'TASK_TITLE',
P.name AS 'PROJECT_NAME',
P.id AS 'PROJECT_ID',
IF(U.id IS NULL, U3.id , U.id) AS 'USER_ID',
IF(U.id IS NULL, U3.email , U.email) AS 'USER_EMAIL',
U3.email AS 'TASK_AUTHOR_EMAIL',	
CONCAT("projects/", P.id, "/tasks/", T.id) AS 'TASK_LINK'
FROM task T
JOIN task_list TL
ON T.task_list = TL.id
JOIN project P
ON TL.project = P.id
LEFT JOIN user_has_task UHT
ON T.id = UHT.task
LEFT JOIN user U
ON UHT.user = U.id
LEFT JOIN user U3
ON T.author = U3.id

