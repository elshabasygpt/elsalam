const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('route.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const routes = walk(path.join(__dirname, 'src', 'app', 'api'));

let modifiedCount = 0;

routes.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Check if handleApiError needs to be imported
    const needsImport = /NextResponse\.json\(\{\s*(success:\s*false,\s*)?(error|message):\s*(error|e)\.message/.test(content) || /NextResponse\.json\(\{\s*(success:\s*false,\s*)?error:\s*"[^"]+",\s*details:\s*(error|e)\.message/.test(content);
    
    if (needsImport && !content.includes('handleApiError')) {
        // Add import at the top
        content = `import { handleApiError } from "@/lib/error-handler";\n` + content;
    }

    // Replace various leak patterns
    content = content.replace(/return NextResponse\.json\(\{\s*(?:success:\s*false,\s*)?(?:error|message):\s*(error|e)\.message(?: \|\| "[^"]+")?\s*\},?\s*\{\s*status:\s*500\s*\}\s*\);/g, "return handleApiError($1);");
    
    // Replace with details: e.message
    content = content.replace(/return NextResponse\.json\(\{\s*error:\s*"([^"]+)",\s*details:\s*(error|e)\.message\s*\},?\s*\{\s*status:\s*500\s*\}\s*\);/g, 'return handleApiError($2, "$1");');
    
    // Fallback replacing other generic e.message 
    content = content.replace(/return NextResponse\.json\(\{\s*error:\s*(error|e)\.message\s*\},?\s*\{\s*status:\s*\d+\s*\}\s*\);/g, "return handleApiError($1);");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed:', file);
        modifiedCount++;
    }
});

console.log('Total files fixed:', modifiedCount);
