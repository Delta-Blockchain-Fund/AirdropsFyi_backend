# Delta Fund Backend

This is the backend application for the airdrop website.

It is a complete Dockerized application, with a PostgreSQL database, a NodeJS server constructed with Express and Typescript.

## Project structure

- **node_modules**: Contains all the dependencies of the project
- **src**: Contains all the source code of the project
  - **email**: Contains the script to send emails and email templates
  - **http**: Contains .http files for manually testing the API
  - **middlewares**: Contains the express middlewares such as admin authentication and recaptcha
  - **routes**: Contains all the routes of the API
  - **database.ts**: Script that connects the express server to the postgres database
  - **index.ts**: Main script that starts the express server
  - **routes.ts**: Script that registers all the routes of the API
- **.dockerignore**: Contains the files that should not be copied to the docker image
- **.env**: Contains the environment variables
- **.env.example**: Contains an example of the environment variables
- **.gitignore**: Contains the files that should not be commited to git
- **docker-compose.prod.yaml**: Contains the docker-compose configuration for production
- **docker-compose.yaml**: Contains the docker-compose configuration for development
- **Dockerfile**: Contains the declaration of the docker image
- **generateRandomToken.js**: Utility script to generate a random token for testing
- **nodemon.json**: Contains all the nodemon configuration
- **package.json**: Contains all the dependencies and information about the project
- **README.md**: This file
- **tsconfig.json**: Contains all the typescript configuration
- **yarn.lock**: Contains the exact versions of the dependencies, if you use npm, delete this file and npm will create the package-lock.json file

## How to run

You can run the application in development mode or in production mode.

Development mode is useful for development, it will automatically restart the server when you make changes to the code.

Production mode is a fixed image that will not restart automatically.

To run the application, you need to have docker and docker-compose installed.

You can find more information on how to install docker-compose here: https://docs.docker.com/compose/install/

### Development mode

You can run the application in development mode with the following command:

```bash
npm run docker-dev
# or
yarn docker-dev
```

Or, if you want to run it in the background:

```bash
npm run docker-dev-d
# or
yarn docker-dev-d
```

### Production mode

You can run the application in production mode with the following command:

```bash
npm run docker-prod
# or
yarn docker-prod
```

Or, if you want to run it in the background:

```bash
npm run docker-prod-d
# or
yarn docker-prod-d
```

## How to stop

If you ran the docker in the background, you can stop it with the following command:

```bash
npm run docker-stop
# or
yarn docker-stop
```

## Hot reload

If you are running the application in development mode with the commands above, you can make changes to the code and after saving the file, the server will automatically restart and the changes will be applied.

## Environment variables

In order to the application to work, you need to set the environment variables.

You can find an example of the environment variables in the .env.example file. Just copy the file and rename it to .env and fill in the values.

- **HOST:** The host of the express server, it is only used in the rest.http file, and can be localhost at development time or ip/domain at production time

- **PORT:** The port that the express server will listen to, for development it can be 4000, for production it is recommended to use 80

- **POSTGRES_USER:** The username of the postgres database

- **POSTGRES_PASSWORD:** The password of the postgres database

- **POSTGRES_DB:** The name of the postgres database

- **POSTGRES_CONTAINER_NAME:** The name of the postgres container, it is used in the docker-compose files and as the host for the express server connection to the database

- **POSTGRES_PORT:** The port of the postgres database, it is recommended to use 5432

- **ADMIN_KEY:** The key that the Github Actions script will use to authenticate to the API

- **RECAPTCHA_SECRET_KEY:** The secret key of the recaptcha, you can find it in the recaptcha admin panel https://www.google.com/recaptcha/admin. This key is used together with the recaptcha site key in the frontend to prevent bots from submitting forms

- **MAILCHIMP_API_KEY:** The API key of the Mailchimp account, you can find it in the Mailchimp admin panel https://us1.admin.mailchimp.com/account/api/. This key is used to authenticate to the Mailchimp API and send the emails to the subscribers

## API Routes

The API has the following routes:

- **GET /:** Hello world route, it is used to check if the API is running

- **POST /check-new-tokens:** This route is used by the Github Actions script to send all the tokens names to check if there are new tokens

- **POST /add-new-token:** This route is used by the Github Actions script to send a new token to add it to the database

- **GET /airdrops/:address:** This route is used by the frontend to search for all airdrops for a given wallet address

- **POST /register-wallet:** This route is used by the frontend to register a wallet to receive email notifications, it uses Recaptcha to prevent bots from submitting the form

- **GET /wallet/:address:** This route is used by the frontend to get the email of a wallet

## Utility scripts

- **generateRandomToken.js:** This script generates a random token in the structure used in the API, very useful for testing

Sample `randomToken.json`:

```json
{
  "name": "Quietly Second",
  "description": "Library Only Headed Wooden Bite Vote Least Balloon Excitement Balloon",
  "logoUrl": "https://door.com/brain",
  "claimUrl": "https://soon.buffalo.failed.com/welcome/driven/truth",
  "symbol": "QS",
  "addresses": {
    "0x16e3d24d02ae09a0b7844380944365b1df8eb829": 406,
    "0x3d45ac7f4b0cd131f5cda2e1f19283555d030bcc": 127,
    "0xb8f2894ca673b22381a4481c11aa69095a5576ba": 10,
    "0x78ac8c7073afa9112f29776824917870cc2e677b": 415,
    "0xe6864a91c198c9a7dfda9551bed50187442c1c3c": 658,
    "0xf20956090bf73c6414938274c7d731f10bfe99c3": 845,
    "0xaf32569f4e2094f7c34632a9731fafdf893e229e": 366,
    "0x9fca13989fbe1078034ca6928d0d85144c5bcce3": 832,
    "0xa74a11f7fdeba2013cd8164a311319f8dd2b4a94": 359,
    "0xb91dbe0e6fe8963bb157eac4c27126108978b0f3": 475
  }
}
```

## Dependencies used

- **Axios:** Used to make HTTP requests, in this backend it is used to connect to Recaptcha
- **Cors:** Used to configure the CORS headers on the Express server
- **Dotenv:** Used to load the environment variables from the .env file
- **Express:** Used to create the Express server
- **Nodemon:** Used to automatically restart the server when a file is changed, it is used internally in the docker images
- **pg:** Used to connect to the Postgres database
- **sequelize:** Used to create the models and connect to the database from the Express server
- **ts-node:** Used to run the Typescript code
- **typescript:** Used to compile the Typescript code to Javascript
- **@mailchimp/mailchimp_transactional:** Used to connect to the Mailchimp API and send emails
- **@types/express:** Types for the Express library
- **@types/mailchimp\_\_mailchimp_transactional:** Types for the Mailchimp library
- **@types/nodemailer:** Types for the Nodemailer library
- **random-words:** Used to generate random words for testing, used in the `generateRandomToken.js` script
