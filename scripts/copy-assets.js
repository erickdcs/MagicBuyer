const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const assets = [
  'manifest.json',
  'background.js',
  'contentScript.js',
  'popup.html',
  'external',
  'storeImg',
];

const copyRecursiveSync = (src, dest) => {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    entries.forEach((entry) => {
      const from = path.join(src, entry);
      const to = path.join(dest, entry);
      copyRecursiveSync(from, to);
    });
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
};

const main = () => {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  assets.forEach((asset) => {
    const fromPath = path.join(rootDir, asset);
    const toPath = path.join(distDir, asset);

    if (!fs.existsSync(fromPath)) {
      return;
    }

    fs.rmSync(toPath, { recursive: true, force: true });

    if (asset === 'popup.html') {
      const originalContent = fs.readFileSync(fromPath, 'utf8');
      const updatedContent = originalContent.replace(
        'src="dist/popup.js"',
        'src="popup.js"'
      );
      fs.mkdirSync(path.dirname(toPath), { recursive: true });
      fs.writeFileSync(toPath, updatedContent);
      return;
    }

    copyRecursiveSync(fromPath, toPath);
  });
};

main();
