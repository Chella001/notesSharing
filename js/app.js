// Import all components
import '../components/sidebar.js';
import '../components/header.js';

// Global Utilities

// Notification System
window.showNotification = function(message, type = "success") {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.style.background = type === "success" ? "var(--primary)" : "var(--danger)";
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
};

// Global formatters
window.formatDate = function(date) {
    if (!date) return 'N/A';
    if (date.toDate) {
        const d = date.toDate();
        return d.toLocaleDateString('en-GB');
    }
    if (date instanceof Date) {
        return date.toLocaleDateString('en-GB');
    }
    return date;
};

window.formatTime = function(date) {
    if (!date) return 'N/A';
    if (date.toDate) {
        const d = date.toDate();
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return '--:--';
};

// Global confirm dialog logic (if needed, this intercepts window.showLogoutConfirmation)
window.showLogoutConfirmation = function(onConfirm) {
    // Check if custom modal exists, else fallback to confirm
    const result = confirm("Are you sure you want to log out?");
    if (result && onConfirm) {
        onConfirm();
    }
};

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
});

// Global Loading State Handlers
window.showLoading = function(message = "Loading...") {
    let loader = document.getElementById('global-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
                z-index: 99999; display: flex; flex-direction: column;
                align-items: center; justify-content: center; color: white;
                font-family: var(--font-sans);
            ">
                <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: var(--brand-500);"></i>
                <div id="global-loader-msg" style="font-weight: 500;">${message}</div>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        document.getElementById('global-loader-msg').textContent = message;
        loader.style.display = 'flex';
    }
};

window.hideLoading = function() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.display = 'none';
};
