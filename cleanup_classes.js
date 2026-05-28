const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'register.html',
    'dashboard.html',
    'newPatient.html',
    'newDoctor.html',
    'appointments.html',
    'reports.html',
    'settings.html'
];

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Fix duplicate class attributes, e.g., class="something" ... class="ds-input"
    // We will find tags with two class attributes and merge them
    // regex to match <element ... class="A" ... class="B" ... >
    content = content.replace(/<([^>]+?)\s+class="([^"]+?)"([^>]*?)\s+class="([^"]+?)"([^>]*?)>/g, '<$1 class="$2 $4" $3 $5>');
    // run it twice in case there are multiple
    content = content.replace(/<([^>]+?)\s+class="([^"]+?)"([^>]*?)\s+class="([^"]+?)"([^>]*?)>/g, '<$1 class="$2 $4" $3 $5>');

    fs.writeFileSync(filePath, content);
    console.log(`Cleaned up classes in ${file}`);
}
