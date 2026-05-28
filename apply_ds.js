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

    // Migrate generic headings
    content = content.replace(/<h1>/g, '<h1 class="text-h1">');
    content = content.replace(/<h2>/g, '<h2 class="text-h2">');
    content = content.replace(/<h3>/g, '<h3 class="text-h3">');

    // Migrate buttons
    content = content.replace(/class="([^"]*)login-btn([^"]*)"/g, 'class="$1ds-btn ds-btn-primary full-width$2"');
    content = content.replace(/class="([^"]*)register-btn([^"]*)"/g, 'class="$1ds-btn ds-btn-primary full-width$2"');
    content = content.replace(/class="([^"]*)save-btn([^"]*)"/g, 'class="$1ds-btn ds-btn-primary$2"');
    content = content.replace(/class="([^"]*)cancel-btn([^"]*)"/g, 'class="$1ds-btn ds-btn-secondary$2"');

    // Migrate forms
    content = content.replace(/class="([^"]*)form-container([^"]*)"/g, 'class="$1ds-card$2"');
    content = content.replace(/class="([^"]*)input-label([^"]*)"/g, 'class="$1ds-label$2"');

    // Since input-wrapper has complex nesting, we can just add ds-input directly to inputs
    content = content.replace(/<input([^>]*?)class="([^"]*?)"([^>]*?)>/g, '<input$1class="$2 ds-input"$3>');
    content = content.replace(/<input([^>]*?)((?!class=)[^>]*?)>/g, '<input$1$2 class="ds-input">');
    content = content.replace(/class="ds-input ds-input"/g, 'class="ds-input"');
    
    // Selects and Textareas
    content = content.replace(/<select([^>]*?)class="([^"]*?)"([^>]*?)>/g, '<select$1class="$2 ds-select"$3>');
    content = content.replace(/<select([^>]*?)((?!class=)[^>]*?)>/g, '<select$1$2 class="ds-select">');
    
    content = content.replace(/<textarea([^>]*?)class="([^"]*?)"([^>]*?)>/g, '<textarea$1class="$2 ds-textarea"$3>');
    content = content.replace(/<textarea([^>]*?)((?!class=)[^>]*?)>/g, '<textarea$1$2 class="ds-textarea">');

    // Tables
    content = content.replace(/class="([^"]*)appointments-table([^"]*)"/g, 'class="$1ds-table$2"');
    content = content.replace(/class="([^"]*)data-table([^"]*)"/g, 'class="$1ds-table$2"');
    content = content.replace(/class="([^"]*)table-container([^"]*)"/g, 'class="$1ds-table-container$2"');

    fs.writeFileSync(filePath, content);
    console.log(`Applied design system to ${file}`);
}
