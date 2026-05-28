// Import all components
import '../components/sidebar.js';
import '../components/header.js';
import './animations.js';

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

// Premium Logout Confirmation Modal
window.showLogoutConfirmation = function(onConfirm) {
    // Remove any existing modal
    const existing = document.getElementById('logout-modal-overlay');
    if (existing) existing.remove();

    // Inject modal styles if not already present
    if (!document.getElementById('logout-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'logout-modal-styles';
        style.textContent = `
            #logout-modal-overlay {
                position: fixed; inset: 0; z-index: 9999;
                background: rgba(0,0,0,0.55);
                backdrop-filter: blur(6px);
                display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.25s ease;
            }
            #logout-modal-overlay.show { opacity: 1; }
            #logout-modal-box {
                background: var(--ds-bg-card, #fff);
                border: 1px solid var(--ds-border, #e2e8f0);
                border-radius: 20px;
                padding: 36px 32px 28px;
                width: 100%; max-width: 380px;
                text-align: center;
                box-shadow: 0 24px 60px rgba(0,0,0,0.18);
                transform: scale(0.9) translateY(12px);
                transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease;
                opacity: 0;
            }
            #logout-modal-overlay.show #logout-modal-box {
                transform: scale(1) translateY(0); opacity: 1;
            }
            #logout-modal-icon {
                width: 56px; height: 56px; border-radius: 50%;
                background: linear-gradient(135deg, #fee2e2, #fca5a5);
                display: flex; align-items: center; justify-content: center;
                margin: 0 auto 18px;
                font-size: 22px; color: #dc2626;
            }
            #logout-modal-box h3 {
                font-size: 1.15rem; font-weight: 700;
                color: var(--ds-text-primary, #0f172a);
                margin: 0 0 8px;
            }
            #logout-modal-box p {
                font-size: 0.875rem; color: var(--ds-text-secondary, #64748b);
                margin: 0 0 28px; line-height: 1.5;
            }
            .logout-modal-actions {
                display: flex; gap: 10px; justify-content: center;
            }
            .logout-modal-actions button {
                flex: 1; padding: 10px 20px;
                border-radius: 9999px; font-size: 0.875rem;
                font-weight: 600; cursor: pointer;
                border: 1px solid transparent;
                transition: all 0.18s ease; outline: none;
            }
            #logout-cancel-btn {
                background: var(--ds-bg-card, #fff);
                color: var(--ds-text-secondary, #64748b);
                border-color: var(--ds-border, #e2e8f0);
            }
            #logout-cancel-btn:hover { background: var(--ds-bg-hover, #f8fafc); }
            #logout-confirm-btn {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                box-shadow: 0 4px 14px rgba(220,38,38,0.3);
            }
            #logout-confirm-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(220,38,38,0.4); }
        `;
        document.head.appendChild(style);
    }

    // Build modal HTML
    const overlay = document.createElement('div');
    overlay.id = 'logout-modal-overlay';
    overlay.innerHTML = `
        <div id="logout-modal-box">
            <div id="logout-modal-icon"><i class="fas fa-sign-out-alt"></i></div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to securely log out of the hospital management system?</p>
            <div class="logout-modal-actions">
                <button id="logout-cancel-btn">Cancel</button>
                <button id="logout-confirm-btn"><i class="fas fa-sign-out-alt"></i> Log Out</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add('show'));
    });

    const close = () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    };

    document.getElementById('logout-cancel-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    document.getElementById('logout-confirm-btn').addEventListener('click', () => {
        close();
        setTimeout(() => { if (onConfirm) onConfirm(); }, 300);
    });
};

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
});

// Global Loading State Handlers
let globalLoaderTimeout;

window.showLoading = function(message = "Loading...", timeoutMs = 8000) {
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
                <button onclick="window.hideLoading()" style="margin-top: 16px; background: transparent; border: 1px solid rgba(255,255,255,0.5); color: white; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; opacity: 0.8;">Dismiss</button>
            </div>
        `;
        document.body.appendChild(loader);
        if (window.dsAnimate && window.dsAnimate.popIn) {
            window.dsAnimate.popIn(loader.firstElementChild);
            if (window.animate) {
                window.animate(loader, { opacity: [0, 1] }, { duration: 0.3 });
            }
        }
    } else {
        document.getElementById('global-loader-msg').textContent = message;
        loader.style.display = 'flex';
        if (window.dsAnimate && window.dsAnimate.popIn) {
            window.dsAnimate.popIn(loader.firstElementChild);
            if (window.animate) {
                window.animate(loader, { opacity: [0, 1] }, { duration: 0.3 });
            }
        }
    }
    
    // Failsafe timeout to prevent permanent blocking
    clearTimeout(globalLoaderTimeout);
    if (timeoutMs > 0) {
        globalLoaderTimeout = setTimeout(() => {
            window.hideLoading();
        }, timeoutMs);
    }
};

window.hideLoading = function() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        if (window.animate) {
            window.animate(loader, { opacity: [1, 0] }, { duration: 0.2 });
            setTimeout(() => {
                loader.remove();
            }, 200);
        } else {
            loader.remove();
        }
    }
};
