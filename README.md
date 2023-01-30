# Grundsteuer

This is the code repository of Grundsteuer by [DigitalService](https://digitalservice.bund.de).

## Quick Start Guide

- [Remix Docs](https://remix.run/docs)

### Development

Before starting the app in development mode, you need to have working instances of the following:

- Node.js v16 (see package.json for the pinned version)
- npm
- PostgreSQL (v12)
- Redis (v5 or higher)
- [Unleash](https://www.getunleash.io)

Additionally, you need Erica API ([actual](https://github.com/digitalservicebund/erica)
or [mock](https://github.com/digitalservicebund/erica-mock/pkgs/container/erica-mock)) for all interactions with
Erica/ELSTER. It is technically optional since you can start the app with no running Erica; however, the environment
variable `ERICA_URL` must be set.

We recommend Docker containers for PostgreSQL, Redis and Unleash. Default ports and credentials are configured
in `.env.example`. You also need to create a database named `grundsteuer` in Postgres. Since setting up Unleash is not
as trivial as the others as it requires its own database, we have provided a convenience script:

```shell
cd unleash
chmod +x ./create-local-unleash.sh
./create-local-unleash.sh
```

You can log into this fresh Unleash installation at `http://localhost:4242` with the username `admin` and
password `unleash4all`.

Once everything is up and running, you can start the app for the first time:

```shell
npm install
npx prisma migrate dev
npm run dev
```

This starts the development server on `localhost:3000`, rebuilding assets on file changes.

The app uses [Prisma](https://www.prisma.io) for database migrations.

You need a local `.env` file to load configuration parameters from. The default values are stored in `.env.example`. If
no `.env` exists in project root, `npm run dev` will create one by copying `.env.example`. If there are parameters
defined in `.env.example` that are missing in your local `.env`, the app will fail on startup with an error message
indicating the missing keys.

#### E2E/integration tests

Assuming the Docker daemon is running, you can execute `run-e2e-tests-locally.sh` and `run-integration-tests-locally.sh`
to execute E2E and integration tests respectively. The script fires up and seeds ephemeral instances of all required
services and cleans them up once execution is finished or aborted.

#### Style (Linting & Formatting)

We use [ESLint](https://eslint.org/docs/user-guide/getting-started) to find problems in our code
and [Prettier](https://prettier.io/docs/en/index.html) to enforce consistent formatting.

It's probably a good idea to setup ESLint and Prettier in your editor (it might even be there out-of-the-box). This way
you become aware of linting errors immediately while coding. Auto-formatting on saving the file frees you from any
manual formatting work.

To be on the safe side ESLint and Prettier are also run on all staged files before a commit. Automatically, so you can't
forget it.

Additionally, you can always run ESLint and Prettier manually via npm tasks:

Check style:

```sh
npm run style:check
```

Autofix issues:

```sh
npm run style:fix
```

### Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Docker Tooling

The Dockerfile is intended for production images. A Docker Compose file, `docker-compose-test.yml`, is provided to
minimize local setup required for running E2E tests.

#### Production Flow

```sh
docker build -t grundsteuer .
docker run --rm -it -p 3000:3000 grundsteuer
```

This builds and starts your app in production mode.

## Console

### Usage

`npm run console` gives you a Node.js REPL with some app modules added to its context. See `<PROJECT_ROOT>/console.ts`
for details.

### Development

Please run `npm run build:console` after changes to `<PROJECT_ROOT>/console.ts`.

## The form logic

To construct our forms we use four different structures:

- State machine: The state machine defines the order of form steps depending on the user data. This can be found
  in `app/domain/states/states.server.ts`. The conditions are located in `app/domain/states/guards.ts`.
- Step definitions: The fields that are used in a step and further information such as validations is defined through
  the step definition. These can be found in `app/domain/steps/index.ts`.
- Step-specific components: If a step needs to look different from the `DefaultStep`, it needs to have a specific
  StepComponent or StepHeadlineComponent (only title and description). These can be found
  in `app/components/steps/index.ts` or `app/components/headlines/index.ts`.
- Step-specific texts: Texts for each step (like headlines, descriptions, text in help components) need to be set
  through localization. These texts can be found in `public/locales/de/all.json`.

These structures are then used in `app/routes/formular/_step.tsx` to construct a step.
