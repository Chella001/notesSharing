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

    // Update CSS link
    content = content.replace(/href="theme\.css"/g, 'href="css/theme.css"');
    
    // Update Firebase Config script
    content = content.replace(/src="firebase-config\.js"/g, 'src="js/firebase-config.js"');

    fs.writeFileSync(filePath, content);
    console.log(`Updated paths in ${file}`);
}
