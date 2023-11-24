# Northcoders News API

Welcome to my News API!

This backend project contains an API which allows users to read articles, post comments on articles and vote on them. Users can also delete comments, see the users and topics for the articles.

This API has been built using Javascript, Express and PSQL. The project was developed using TDD, with Jest & Supertest.

This project is hosted using Render: https://news-13r8.onrender.com/api

Following this link, will give you a list of valid endpoints you may use.

## Installation

To clone this repository and set the project up on your local machine, please follow these instructions:

<u>Clone the repository</u>

In your terminal enter:

    git clone https://github.com/bex9119/news-api.git

<u>Install the required dependencies</u>

    npm install

<u>To connect locally to the test and development databases</u>

1. Create a file called .env.test
2. In .env.test write PGDATABASE=nc_news_test
3. Create a file called .env.development
4. In .env.development write PGDATABASAE=nc_news

This will add the correct database name for each environment.

<u>To create and seed the local databases</u>

    npm run setup-dbs
    npm run  seed

<u>To run the tests</u>

    npm test

The database will be dropped and reseeded before each set of tests is run.

<u>Minimum Requirements</u>

Node.js >=15.0.0
postgres >= 14.9