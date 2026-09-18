const fs = require("fs");
const path = require("path");

const packageRoot = process.cwd();
const repositoryRoot = path.resolve(__dirname, "..");
const sharedSource = path.join(repositoryRoot, "shared", "src");
const packageSource = path.join(packageRoot, "src");
const generatedSource = path.join(packageRoot, ".generated", "src");

if (!fs.existsSync(path.join(packageRoot, "package.json"))) {
  throw new Error("Run prepare-source from a package directory");
}

fs.rmSync(generatedSource, { recursive: true, force: true });
fs.mkdirSync(generatedSource, { recursive: true });
fs.cpSync(sharedSource, generatedSource, { recursive: true });
fs.cpSync(packageSource, generatedSource, { recursive: true });
