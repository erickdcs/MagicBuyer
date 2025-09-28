const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "extension");
const outputDir = path.join(__dirname, "..", "dist", "extension");
const staticFiles = ["manifest.json", "background.js", "content-script.js"];

const ensureDirectory = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const resetDirectory = (dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  ensureDirectory(dir);
};

const copyStaticFiles = (src, dest, files) => {
  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`Missing required extension asset: ${file}`);
    }

    fs.copyFileSync(srcPath, destPath);
  });
};

const main = () => {
  resetDirectory(outputDir);
  copyStaticFiles(sourceDir, outputDir, staticFiles);
};

main();
