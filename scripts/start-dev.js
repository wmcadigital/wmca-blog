#!/usr/bin/env node
const { spawn, spawnSync } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');

const PORT = process.env.PORT || 1234;
const URL = `http://localhost:${PORT}`;
const USER_DATA_DIR = process.env.WMCA_CHROME_PROFILE || path.join(os.tmpdir(), 'wmca-chrome-dev');

function startParcel() {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'npx.cmd' : 'npx';
  const args = ['parcel', 'src/index.html'];
  const child = spawn(cmd, args, { stdio: 'inherit' });

  child.on('exit', (code) => {
    process.exit(code);
  });

  return child;
}

function tryOpenChrome(url) {
  const platform = process.platform;
  try {
    if (platform === 'darwin') {
      // macOS
      spawn('open', ['-na', 'Google Chrome', '--args', '--disable-web-security', `--user-data-dir=${USER_DATA_DIR}`, url], {
        detached: true,
        stdio: 'ignore',
      }).unref();
    } else if (platform === 'win32') {
      // Windows - use start via cmd
      spawn('cmd', ['/c', 'start', '""', 'chrome', '--disable-web-security', `--user-data-dir=${USER_DATA_DIR}`, url], {
        detached: true,
        stdio: 'ignore',
      }).unref();
    } else {
      // Linux - try common binary names
      const candidates = ['google-chrome', 'google-chrome-stable', 'chromium-browser', 'chromium'];
      let opened = false;
      for (const bin of candidates) {
        const res = spawnSync('which', [bin]);
        if (res.status === 0) {
          spawn(bin, ['--disable-web-security', `--user-data-dir=${USER_DATA_DIR}`, url], {
            detached: true,
            stdio: 'ignore',
          }).unref();
          opened = true;
          break;
        }
      }
      if (!opened) {
        console.warn('Could not find Chrome/Chromium binary on PATH. Please open a browser manually with --disable-web-security and --user-data-dir. URL:', url);
      }
    }
  } catch (err) {
    console.warn('Failed to open Chrome automatically:', err.message);
  }
}

function waitForServer(url, timeoutMs = 30000, interval = 500) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, () => {
          resolve();
        })
        .on('error', () => {
          if (Date.now() - start > timeoutMs) return reject(new Error('Timed out waiting for server'));
          setTimeout(check, interval);
        });
    };
    check();
  });
}

(async function main() {
  console.log('Starting dev server (Parcel) and will open Chrome with relaxed CORS when ready...');
  const parcel = startParcel();

  try {
    await waitForServer(URL, 30000, 500);
    console.log(`Server is responding at ${URL} — opening Chrome with --disable-web-security (profile: ${USER_DATA_DIR})`);
    tryOpenChrome(URL);
  } catch (err) {
    console.warn('Server did not become ready in time:', err.message);
    console.log('You can still open Chrome manually with flags: --disable-web-security --user-data-dir=' + USER_DATA_DIR);
  }

  // Forward exit signals to parcel child
  const forward = (sig) => {
    try {
      parcel.kill(sig);
    } catch (e) {
      /* ignore */
    }
    process.exit();
  };
  process.on('SIGINT', forward);
  process.on('SIGTERM', forward);
})();
