# Moneypoly
![example workflow](https://github.com/nakamarusun/moneypoly/actions/workflows/node.js.yml/badge.svg)

This is the best game ever to ever be conceived in the entire world.

# Description
This repository contains both the server and worker instances for a monopoly-like game. To run the game, several dependencies are needed:
- Node.js
- Redis

A minimum of 2 servers have to be started to run the game: one master server, and one worker server.
Multiple worker servers can be run and connected to the server by adding all of the worker URLS to the master env file.
Only one master server is needed to be run at all times.

# Instructions

Have Node and NPM (Node Package Manager) installed. This uses NPM to manage all the dependencies needed for development and deployment.

Clone repository and go to the directory
```bash
git clone https://github.com/SolusiAnakBangsa/Web-Stack.git
cd Web-Stack
```

Download and install dependencies
```bash
npm install
```

#### Depending on whether you want to run both worker, master or either one, do the following:

##### Run worker instance:

Duplicate worker.env.example, and rename the new one to worker.env
```
# Rename
worker.env.example >> worker.env
```

Fill up the values in the file with accordance to the comments

Run the worker instance

```bash
node run start-worker
```

##### Run master instance:

Duplicate master.env.example, and rename the new one to master.env
```
# Rename
master.env.example >> master.env
```

Fill up the values in the file with accordance to the comments

Run the master instance

```bash
node run start
```

##### Run both worker and master instances:
Do both `Run worker instance` and `Run master instance` above with the same order.

# Scripts
- npm test: Run Jest tests on scripts
- npm run format: Formats all code with Prettier and ESLint