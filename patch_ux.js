const fs = require('fs');
const path = require('path');

const filesToPatch = [
    {
        name: 'newPatient.html',
        search: `submitBtn.disabled = true;\r\n            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';\r\n\r\n            // Set timeout warning after 5 seconds`,
        replace: `submitBtn.disabled = true;\r\n            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';\r\n            if (window.showLoading) window.showLoading("Registering Patient...");\r\n\r\n            // Set timeout warning after 5 seconds`
    },
    {
        name: 'newPatient.html',
        search: `// Redirect to dashboard after 1.5 seconds\r\n                setTimeout(() => {\r\n                    window.location.href = 'dashboard.html?newPatient=success&timestamp=' + Date.now();\r\n                }, 1500);\r\n\r\n            } catch (error) {`,
        replace: `if (window.hideLoading) window.hideLoading();\r\n\r\n                // Redirect to dashboard after 1.5 seconds\r\n                setTimeout(() => {\r\n                    window.location.href = 'dashboard.html?newPatient=success&timestamp=' + Date.now();\r\n                }, 1500);\r\n\r\n            } catch (error) {\r\n                if (window.hideLoading) window.hideLoading();`
    },
    {
        name: 'newPatient.html',
        search: `tbody.innerHTML = \`<tr><td colspan="6" class="no-data">📭 No matching patients found.</td></tr>\`;`,
        replace: `tbody.innerHTML = \`<tr><td colspan="6" class="no-data"><div style="text-align: center; padding: 48px; color: var(--ds-text-tertiary);"><i class="fas fa-users-slash" style="font-size: 32px; margin-bottom: 16px; display: block; opacity: 0.5;"></i><h3 class="text-h4">No patients found</h3><p class="text-body-sm">Try adjusting your filters or register a new patient.</p></div></td></tr>\`;`
    },
    {
        name: 'newDoctor.html',
        search: `submitBtn.disabled = true;\r\n            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';`,
        replace: `submitBtn.disabled = true;\r\n            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';\r\n            if (window.showLoading) window.showLoading("Registering Doctor...");`
    },
    {
        name: 'newDoctor.html',
        search: `setTimeout(() => {\r\n                    window.location.href = 'dashboard.html?newDoctor=success&timestamp=' + Date.now();\r\n                }, 1500);\r\n\r\n            } catch (error) {`,
        replace: `if (window.hideLoading) window.hideLoading();\r\n                setTimeout(() => {\r\n                    window.location.href = 'dashboard.html?newDoctor=success&timestamp=' + Date.now();\r\n                }, 1500);\r\n\r\n            } catch (error) {\r\n                if (window.hideLoading) window.hideLoading();`
    }
];

filesToPatch.forEach(patch => {
    const filePath = path.join(__dirname, patch.name);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Normalize line endings for replacement
        const searchNormalized = patch.search.replace(/\r\n/g, '\n');
        const replaceNormalized = patch.replace.replace(/\r\n/g, '\n');
        content = content.replace(searchNormalized, replaceNormalized);
        
        fs.writeFileSync(filePath, content);
        console.log(`Patched ${patch.name}`);
    }
});
