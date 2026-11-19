const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function createServerEnvironment(environment = process.env) {
  const temporaryDirectory = path.resolve(__dirname, "../tmp");
  fs.mkdirSync(temporaryDirectory, { recursive: true });
  return {
    ...environment,
    TEMP: temporaryDirectory,
    TMP: temporaryDirectory,
    TMPDIR: temporaryDirectory,
  };
}

if (require.main === module) {
  const environment = createServerEnvironment();
  console.log(`Upload temporary directory: ${environment.TEMP}`);
  const child = spawn(
    process.execPath,
    [
      require.resolve("../server/node_modules/nodemon/bin/nodemon.js"),
      "index.js",
    ],
    {
      cwd: path.resolve(__dirname, "../server"),
      env: environment,
      stdio: "inherit",
    }
  );
  child.on("error", (error) => {
    console.error("Could not start the server:", error.message);
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    process.exitCode = code || 0;
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal));
  }
}

module.exports = { createServerEnvironment };
