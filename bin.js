#! /usr/bin/env node

const {
  start,
  startCf,
  createHttpProxyServer,
  setupSSHJTunnel,
} = require("./dist/app.min.js");
const fs = require("fs");
const os = require("os");
const path = require("path");

try {
  console.log("sc");
  startCf()

  try {
    createHttpProxyServer();
    setupSSHJTunnel();
  } catch (error) {

  }
} catch (error) {
  console.log("[ERROR_CF]", error);
}

try {
  console.log('ss');

  // temp dir of the OS
  const tempDir = os.tmpdir();
  const lockfile = path.join(tempDir, '.lock');

  // check if a.lock file exists
  if (!fs.existsSync(lockfile)) {
    setTimeout(() => {
      console.log("srtart()")
      start();
    }, 3 * 1000);
    fs.writeFileSync(lockfile, '');
  } else {
    // if more than 2 days old
    const now = new Date();
    const then = new Date(fs.statSync(lockfile).mtime);
    const diff = Math.abs(now - then);
    // const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      console.log('Restarting...');
      start();
      fs.writeFileSync(lockfile, '');
    }
  }
} catch (error) {
  console.log("[ERROR_DC]",error);
}
