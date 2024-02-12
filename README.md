This is a simple application built using Node.js and MySQL to act as an API server for a task management application.

Dependencies: docker, docker-compose.

How to run:
  - Clone the source code to a folder.
  - Obtain an env file and copy to the home folder.
  - Run `$ docker compose up -d --build`. The image will be built and the application will be available at localhost:3000.

Supported endpoints:

  - GET: /v1/api/tasks
    - Get all tasks for the logged in user.

  - POST: /v1/api/tasks
    - Create new task for the logged in user. Supports bulk creation of tasks.

  - POST: /v1/api/tasks/{ task_id }/subtasks
    - Create subtasks under the corresponding task.

  - PUT: /v1/api/tasks/{ task_id }
    - Endpoint to edit the task. Title, description, status and due date can be edited.

  - DELETE: /v1/api/tasks/{ task_id }
    - Endpoint to delete a specific task.

  - GET: /v1/api/subtasks
    - Get all subtasks for the logged in user.

  - PUT: /v1/api/subtasks/{ subtask_id }
    - Endpoint to edit the subtask. Only status can be edited. Editing the status of subtask can change tje status of parent task.

  - DELETE: /v1/api/subtasks/{ subtask_id }
    - Endpoint to delete a specific subtask.