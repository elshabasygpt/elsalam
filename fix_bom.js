const fs = require("fs");
const path = require("path");

const base = "d:/mohamed projects/elsalam website/elsalam-api";
const dirs = [
    "app/Http/Resources",
    "app/Http/Controllers/Api",
    "app/Http/Controllers/Admin",
    "app/Models",
    "database/seeders",
    "database/migrations",
    "routes",
];

let fixed = 0;
dirs.forEach((dir) => {
    const fullDir = path.join(base, dir);
    if (!fs.existsSync(fullDir)) return;
    fs.readdirSync(fullDir).forEach((file) => {
        if (!file.endsWith(".php")) return;
        const filePath = path.join(fullDir, file);
        const buf = fs.readFileSync(filePath);
        if (buf.length > 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
            fs.writeFileSync(filePath, buf.slice(3));
            console.log("Fixed BOM:", file);
            fixed++;
        } else if (buf.length === 0) {
            console.log("EMPTY FILE:", file);
        }
    });
});

console.log(`\nTotal fixed: ${fixed}`);
