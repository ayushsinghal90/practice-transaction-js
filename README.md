# Description

This is practice project in Nodejs, Express and sequelize. To create a server side implementation of banking transactions.

## Getting Set Up

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

- Run `npm install` to gather all dependencies.
- To set up database you would need to install mySql.
  - Update these config in `.env`
  ```
  DB_DATABSE=<Database Name>
  DB_USERNAME=<Database Username>
  DB_PASSWORD=<Database Password>
  DB_HOST=<Database host>
  ```
- Run `npm run seed` will seed the local connected database. **Warning: This will drop the database if it exists**.
- Run `npm start` which should start the server.

## PostMan Collection

- You can find attached the postman collection for all the api's
  [here](Transaction.postman_collection.json)
