const fs = require("fs");
const path = require("path");

const src = "C:/Program Files/PHP/current/php.ini";
const tmp = path.join(__dirname, "elsalam-api/php.ini.tmp");

// Read
let ini = fs.readFileSync(src, "utf8");
if (ini.charCodeAt(0) === 0xFEFF) ini = ini.slice(1);

// Enable extensions
const exts = ["openssl", "fileinfo", "curl", "mbstring", "pdo_sqlite", "pdo_mysql", "sqlite3"];
for (const ext of exts) {
    const commented = new RegExp(`^;\\s*extension\\s*=\\s*${ext}`, "m");
    const enabled = new RegExp(`^extension\\s*=\\s*${ext}`, "m");
    if (commented.test(ini)) {
        ini = ini.replace(commented, `extension=${ext}`);
        console.log(`Enabled: ${ext}`);
    } else if (enabled.test(ini)) {
        console.log(`Already enabled: ${ext}`);
    } else {
        ini += `\nextension=${ext}\n`;
        console.log(`Added: ${ext}`);
    }
}

// Fix timezone
if (/^date\.timezone\s*=/m.test(ini)) {
    ini = ini.replace(/^date\.timezone\s*=.*/m, "date.timezone = UTC");
} else {
    ini += "\ndate.timezone = UTC\n";
}
console.log("Fixed timezone");

// Write to temp, then copy
fs.writeFileSync(tmp, ini, "utf8");
console.log("Written to:", tmp);

// Copy back
try {
    fs.copyFileSync(tmp, src);
    console.log("Copied to:", src);
} catch (e) {
    console.error("Could not copy directly. Try: copy", tmp, "->", src);
    console.error(e.message);
}
