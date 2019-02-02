# Project #3. Connect Private Blockchain to Front-End Client via APIs

This is Project 3, Connecting the Private Blockchain to Front-End Client via APIs. In this project, I created two RESTful endpoints (GET, POST) to manage my private blockchain as a service. Blockchain persistence is achieved using LevelDB.

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.
4. POST http://localhost:8000/block with 'body' key in the body of the request, holding the string that becomes the block data.
5. GET http://localhost:8000/block/<i>, where i is any height currently in the blockchain.

## What do I learned with this Project

* I was able to understand and use the basics of Express.js
* I was able to use set up two RESTful APIs for GET and POST
* I was able to expose my private blockchain functionality as a service to be used by anyone who desires
