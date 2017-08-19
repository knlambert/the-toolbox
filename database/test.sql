-- [{
--                 "$match": {
--                     "project.id": project.id
--                 }
--             }, {
--                 "$group": {
--                     "_id": {
--                         "project_id": "$project.id",
--                         "project_name": "$project.name",
--                         "provisioned": "$project.provisioned_hours"
--                     },
--                     "consumed": {
--                         "$sum": "$minutes"
--                     }
--                 }
--             }]

CREATE VIEW project_consumptions
AS (
    SELECT
    P.id AS 'project_id',
    P.name AS 'project_name',
    P.provisioned_hours AS 'provisioned',
    SUM(H.minutes) AS 'consumed'
    FROM hour H
    JOIN project P
    ON H.project = P.id
    GROUP BY P.id, P.name, P.provisioned_hours
);