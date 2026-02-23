#!/usr/bin/env node
/*
 Lowercase-build postprocess

 Usage: node scripts/lowercase-build.js [buildDir]
 Default buildDir: build

 This script will:
 - Walk the build directory
 - Rename files whose basenames contain uppercase letters to lowercase
 - Update references inside text files (.html, .js, .css, .map, .json, .svg, .xml)

 Notes:
 - If a lowercase name already exists, the script will skip the rename and log a warning.
 - This is a best-effort post-process to avoid CDN case-sensitivity 404s.
*/

const fs = require('fs');
const path = require('path');

const TEXT_EXTENSIONS = new Set(['.html', '.js', '.css', '.map', '.json', '.svg', '.xml', '.txt']);

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function main() {
  const buildDir = process.argv[2] || 'build';
  const absBuild = path.resolve(process.cwd(), buildDir);

  if (!fs.existsSync(absBuild)) {
    console.error(`Build directory not found: ${absBuild}`);
    process.exit(1);
  }

  const files = walk(absBuild);

  // mapping of original basename -> new basename
  const renameMap = [];

  files.forEach((f) => {
    const dir = path.dirname(f);
    const base = path.basename(f);
    const lower = base.toLowerCase();
    if (base !== lower) {
      const newPath = path.join(dir, lower);
      if (fs.existsSync(newPath)) {
        // If the existing path is the same file (case-only), allow rename via temp
        try {
          const sOld = fs.statSync(f);
          const sNew = fs.statSync(newPath);
          if (sOld.dev === sNew.dev && sOld.ino === sNew.ino) {
            // same underlying file on case-insensitive fs; proceed
            renameMap.push({ oldPath: f, newPath, oldBase: base, newBase: lower });
          } else {
            console.warn(`Skipping rename ${f} -> ${newPath} because target exists and is a different file`);
          }
        } catch (e) {
          console.warn(`Skipping rename ${f} -> ${newPath} because target exists (stat error: ${e.message})`);
        }
      } else {
        renameMap.push({ oldPath: f, newPath, oldBase: base, newBase: lower });
      }
    }
  });

  if (renameMap.length === 0) {
    console.log('No filenames needing lowercasing found.');
    process.exit(0);
  }

  // Perform renames. Use a temp intermediate name to handle case-insensitive filesystems.
  renameMap.forEach(({ oldPath, newPath, oldBase, newBase }) => {
    try {
      const dir = path.dirname(oldPath);
      const tmpName = `${oldBase}.lowercase-tmp-${Date.now()}`;
      const tmpPath = path.join(dir, tmpName);

      // Move to a temporary name first (avoids case-only rename issues on macOS)
      fs.renameSync(oldPath, tmpPath);
      // Then move to the final lowercase name. If target exists, remove it first.
      if (fs.existsSync(newPath)) {
        try {
          fs.unlinkSync(newPath);
        } catch (e) {
          // if can't remove, continue and let rename fail
        }
      }
      fs.renameSync(tmpPath, newPath);
      console.log(`Renamed: ${oldBase} -> ${newBase}`);
    } catch (err) {
      console.error(`Failed to rename ${oldPath} -> ${newPath}: ${err.message}`);
    }
  });

  // Update references in text files
  const allFilesAfter = walk(absBuild);
  const textFiles = allFilesAfter.filter(isTextFile);

  textFiles.forEach((file) => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;
      renameMap.forEach(({ oldBase, newBase }) => {
        // Replace occurrences of the basename (case-sensitive) with the lowercase one
        // Also replace occurrences with query strings
        const pattern = new RegExp(oldBase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        if (pattern.test(content)) {
          content = content.replace(pattern, newBase);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated references in ${path.relative(process.cwd(), file)}`);
      }
    } catch (err) {
      console.error(`Failed to update ${file}: ${err.message}`);
    }
  });

  console.log('Lowercasing post-process complete.');
}

if (require.main === module) {
  main();
}
