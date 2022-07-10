# Trello Clone Express Server

Express server with TypeScript for the Trello Clone project. PORT is set to 1337.

## Setup

Cloning the project:

```bash
$ git clone
```

Running the server:

```bash
$ npm start
```

Building the project:

```bash
$ npm run postinstall
```

## Client

[Repository](https://github.com/Fulfilled-Koala/M3U2TrelloApp-LucasPatron)

## Project Overview

Within the `src` directory, we have the following files:

- `index.ts`: The main file for the server.
- `db.json`: The mock database containing all of the tasks.
- `type.ts`: The type definition for the tasks.
- `tasks/`: This directory approaches a model-view-controller pattern:
  - `tasks.controller.ts`: The controller for the tasks (managing requests and delegating the work to the `tasks.service.ts`).
  - `tasks.routes.ts`: The endpoints for the different actions a client can perform on the tasks.
  - `tasks.service.ts`: The service for the tasks (managing the mock database `db.json`).
