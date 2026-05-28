const fs = require('fs');
const path = require('path');

const filesToClean = ['dashboard.html', 'newPatient.html', 'appointments.html', 'newDoctor.html', 'reports.html', 'settings.html', 'index.html'];

filesToClean.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove duplicate classes
        content = content.replace(/ds-input ds-input/g, 'ds-input');
        content = content.replace(/ds-select ds-select/g, 'ds-select');
        content = content.replace(/ds-btn ds-btn/g, 'ds-btn');
        content = content.replace(/ds-btn ds-btn ds-btn/g, 'ds-btn');
        
        // Ensure form alignment
        content = content.replace(/<form /g, '<form class="ds-form" ');
        content = content.replace(/class="ds-form ds-form"/g, 'class="ds-form"');
        
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned ${file}`);
    }
});
