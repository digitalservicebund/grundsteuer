#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const { execSync } = require("child_process");

const cypress = require("cypress");
const { program } = require("commander");

function ensureCorrectWorkingDir() {
  process.chdir(`${__dirname}/..`);
}

async function runCypress(baseUrl, spec) {
  await cypress.run({
    browser: "chrome",
    config: {
      baseUrl,
    },
    quiet: true,
    spec,
  });
}

function injectCredentialsIntoHar(harFilename, hostname, credentials) {
  const jsonContents = JSON.parse(fs.readFileSync(harFilename));
  for (const entry of jsonContents.log.entries) {
    const url = entry.request?.url;
    if (url?.startsWith(`https://${hostname}`)) {
      entry.request.url = entry.request.url.replace(
        `https://${hostname}`,
        `https://${credentials}@${hostname}`
      );
    }
  }
  fs.writeFileSync(harFilename, JSON.stringify(jsonContents));
}

function convertHarToK6Script(
  scriptFilename,
  harFilename,
  hostFilter,
  optionsFilename
) {
  execSync(
    `k6 convert --output ${scriptFilename} --only ${hostFilter} --options ${optionsFilename} --min-sleep 0 --max-sleep 0 ${harFilename}`
  );
}

function patchRegistrationScript(scriptFilename) {
  // K6 is neither using a browser nor nodejs, so we have to use vanilla JS. See https://stackoverflow.com/a/19964557/11819
  const randomStringExpression =
    "(Math.random().toString(36)+'00000000000000000').slice(2, 14)";
  const randomEmailAddressDefinition =
    "const email = `grundsteuer+load-test-${" +
    randomStringExpression +
    "}@digitalservice.bund.de`;\n";

  let scriptContents = fs.readFileSync(scriptFilename).toString();
  const randomEmailAddressDefinitionInsertionPoint =
    scriptContents.indexOf('group("Global"');

  scriptContents =
    scriptContents.slice(0, randomEmailAddressDefinitionInsertionPoint) +
    randomEmailAddressDefinition +
    scriptContents
      .slice(randomEmailAddressDefinitionInsertionPoint)
      .replaceAll(
        '"grundsteuer+load-test-RANDOM@digitalservice.bund.de"',
        "email"
      );

  fs.writeFileSync(scriptFilename, scriptContents);
}

function actionFunctionFor(runName) {
  return async (options) => {
    const hostname = options.hostname;
    const authCredentials = options.authCredentials;
    const targetUrl = `https://${
      authCredentials === undefined ? "" : authCredentials + "@"
    }${hostname}`;
    const specFilename = `./cypress/integration/${runName}.js`;
    const harFilename = `${runName}.har`;
    const scriptFilename = `${runName}.js`;
    const optionsFilename = `${runName}Options.json`;

    ensureCorrectWorkingDir();
    await runCypress(targetUrl, specFilename);
    if (authCredentials !== undefined) {
      injectCredentialsIntoHar(harFilename, hostname, authCredentials);
    }
    convertHarToK6Script(
      scriptFilename,
      harFilename,
      hostname,
      optionsFilename
    );
  };
}

program
  .command("staticPages")
  .description("Generate test script for the static suite")
  .showHelpAfterError()
  .requiredOption("-n, --hostname <hostname>", "hostname to run against")
  .option(
    "-a, --auth-credentials <username:passsword>",
    "HTTP Basic Auth credentials to use for the test"
  )
  .action(actionFunctionFor("staticPages"));

program
  .command("form")
  .description("Generate test script for the form suite")
  .showHelpAfterError()
  .requiredOption("-n, --hostname <hostname>", "hostname to run against")
  .option(
    "-a, --auth-credentials <username:passsword>",
    "HTTP Basic Auth credentials to use for the test"
  )
  .action(actionFunctionFor("form"));

program
  .command("registration")
  .description("Generate test script for the registration suite")
  .showHelpAfterError()
  .requiredOption("-n, --hostname <hostname>", "hostname to run against")
  .option(
    "-a, --auth-credentials <username:passsword>",
    "HTTP Basic Auth credentials to use for the test"
  )
  .action((options) => {
    actionFunctionFor("registration")(options);
    patchRegistrationScript("registration.js");
  });

program.parse();
