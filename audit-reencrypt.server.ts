import { reEncrypt } from "~/audit/reEncryption.server";

const OUTPUT_FILE = "decrypted_logs.json";

function usage() {
  console.log(
    "Usage: npm run audit:reEncrypt path-to-private-key path-to-encrypted-logs path-to-output-encrypted-logs"
  );
  console.log(
    "Example: npm run audit:reEncrypt /path/to/key.pem /another/path/to/encrypted-logs /path/to/reencrypted-logs"
  );
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    usage();
  } else {
    reEncrypt(args[0], args[1], args[2] || OUTPUT_FILE);
  }
}

main();
