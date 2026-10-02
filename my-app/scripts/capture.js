const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outFile = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("screenshot.png");
const tempDir = path.resolve(".edge_screenshot_profile");
const url = process.argv[3] || "http://localhost:8081";

// Remove old screenshot if exists
if (fs.existsSync(outFile)) {
  fs.unlinkSync(outFile);
}

const args = [
  "--headless=new",
  `--screenshot=${outFile}`,
  `--user-data-dir=${tempDir}`,
  "--window-size=390,844",
  "--virtual-time-budget=2500",
  "--hide-scrollbars",
  url,
];

console.log(`Taking screenshot of ${url} to ${outFile}...`);

const proc = spawn(edgePath, args, { stdio: "ignore" });

let checkCount = 0;
const interval = setInterval(() => {
  checkCount++;
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
    clearInterval(interval);
    console.log(`Screenshot saved successfully (${fs.statSync(outFile).size} bytes)`);
    try {
      proc.kill("SIGKILL");
    } catch (e) {}
    process.exit(0);
  }

  if (checkCount > 25) { // 5 seconds timeout
    clearInterval(interval);
    console.error("Timeout waiting for screenshot file");
    try {
      proc.kill("SIGKILL");
    } catch (e) {}
    process.exit(1);
  }
}, 200);
