<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Wallet System REST API

This project implements a REST API for a basic wallet system using NestJS, Postgres, and Paystack. It allows users to create accounts, create wallets with unique currencies, credit their wallets, transfer funds between wallets, and provides admin features such as approving large transfers and generating monthly payment summaries.

## Wallet Endpoint

https://chizobavictory-etap-wallet.onrender.com

## API Documentation

https://elements.getpostman.com/redirect?entityId=24035086-8946a774-a0c6-43b8-abfd-db3fb45ed06b&entityType=collection

## Technical Requirements

- **NestJS**: The API is built using NestJS, a powerful and extensible Node.js framework for building scalable and efficient server-side applications.

- **Postgres**: The system uses a PostgreSQL database to store user and wallet data securely.

- **Paystack**: Integration with Paystack is implemented for fund transfers between banks and wallets, which adds an additional layer of security and authentication.

- **TypeORM**: The application uses TypeORM, an ORM that can run in NodeJS, to interact with the database.

- **Postman**: The API is documented using Postman, which provides a user-friendly interface for testing the API.

## Paystack Design
To implement the functionality of transferring between accounts, paystack API needs the amount and the recipient code.

To get the recipient code, another paystack API is called to generate the recipient code taking in the bank code, fullname and account number you are transferring from. 

When the recipient code is generated, it is stored in the database and used to verify the transfer.

As a result of these constraints I added fullname to the user object while creating a user and also added bank code and account number to the wallet object while creating a wallet.

## API Endpoints

The API provides the following endpoints:

- **User Management**:

  - `POST /users/register`: Allows users to create accounts with a unique phone number and password.
  - `POST /users/login`: Enables user authentication.

- **Wallet Management**:

  - `POST /wallet`: Users can create wallets with unique currencies.
  - `PUT /wallet/transfer/{senderId}/{receiverId}`: Allows users to transfer funds between wallets.
  - `GET /wallet/{id}`: Retrieve wallet information.
  - `PATCH /wallet/credit/{id}`: Credit a wallet with additional funds.

- **Admin Operations**:

  - `GET /wallet/approve-transfer/{senderId}/{amount}`: Admin can approve large transfers.
  - `GET /wallet/monthly-payment-summaries`: Generate monthly payment summaries.

  ## Deployment
  The application is deployed on Render. The API endpoint is https://chizobavictory-etap-wallet.onrender.com
