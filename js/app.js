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
