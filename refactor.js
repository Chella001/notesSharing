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

    // 1. Add app.js script to head
    if (!content.includes('<script src="js/app.js" type="module"></script>')) {
        content = content.replace('<link rel="stylesheet" href="theme.css">', '<link rel="stylesheet" href="theme.css">\n    <script src="js/app.js" type="module"></script>');
    }

    // 2. Remove notification div
    content = content.replace(/<!-- Notification Toast -->\s*<div id="notification" class="notification">.*?<\/div>\s*/g, '');

    // 3. Replace Sidebar
    const sidebarRegex = /<!-- Sidebar - with working links -->\s*<div class="sidebar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    content = content.replace(sidebarRegex, '<app-sidebar></app-sidebar>');

    // 4. Replace Header
    const headerRegex = /<div class="main-header">\s*<h1>(.*?)<\/h1>\s*<div class="date-badge" id="currentDate"><\/div>\s*<\/div>/;
    content = content.replace(headerRegex, '<app-header title="$1"></app-header>');

    // 5. Remove helper functions
    const helperRegex = /\/\/ ==================== HELPER FUNCTIONS ====================[\s\S]*?\/\/ ==================== LOAD .*? DATA ====================/i;
    // Wait, the regex might be tricky if "LOAD DASHBOARD DATA" or something else is there.
    // Let's use a simpler one:
    content = content.replace(/function showNotification[\s\S]*?\}\s*setTimeout.*?\n\s*\}\s*function formatDate[\s\S]*?return date;\s*\}/, '');
    content = content.replace(/function formatTime[\s\S]*?return '--:--';\s*\}/, '');
    content = content.replace(/\/\/ Set current date\s*document\.getElementById\('currentDate'\)[\s\S]*?\}\);/, '');

    // 6. Remove MENU INTERACTIONS & LOGOUT
    const menuLogoutRegex = /\/\/ ==================== MENU INTERACTIONS ====================[\s\S]*?\/\/ ==================== INITIAL LOAD ====================/;
    content = content.replace(menuLogoutRegex, '// ==================== INITIAL LOAD ====================');

    fs.writeFileSync(filePath, content);
    console.log(`Refactored ${file}`);
}
