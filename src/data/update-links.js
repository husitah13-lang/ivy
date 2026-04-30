const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/mhuss/Desktop/ivy/ivy_interactive/data';
const files = fs.readdirSync(dir).filter(f => f.startsWith('sales_') && (f.endsWith('.js') || f.endsWith('.json')));

let updatedCount = 0;

for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // We want to replace the href following "text": "Careers"
    // It can be on the same line or next line.
    // Example: "text": "Careers",\n "href": "#bi-careers"
    // Or: "text": "Careers", "href": "#saas-careers"
    // Let's use a regex that matches "text": "Careers" and then the closest "href"
    const regex = /("text"\s*:\s*"Careers"\s*,\s*"href"\s*:\s*")[^"]+(")/g;
    
    let newContent = content.replace(regex, '$1careers.html$2');
    
    if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${file}`);
        updatedCount++;
    }
}

console.log(`Total files updated: ${updatedCount}`);
