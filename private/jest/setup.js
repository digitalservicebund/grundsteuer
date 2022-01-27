// eslint-disable-next-line @typescript-eslint/no-var-requires
const { installGlobals } = require("@remix-run/node");

// Add globals to be able to access Request/Response etc. in the tests
installGlobals();
