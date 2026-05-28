const fs = require('fs');
const path = require('path');

const files = [
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

    // Fix the extra closing div before <!-- Main Content -->
    content = content.replace(/<app-sidebar><\/app-sidebar>\s*<\/div>\s*<!-- Main Content -->/, '<app-sidebar></app-sidebar>\n\n        <!-- Main Content -->');

    fs.writeFileSync(filePath, content);
    console.log(`Fixed layout in ${file}`);
}
