// firebase-config.js

// Immediate Theme Application to prevent flashing
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
})();

// Real Firebase Configuration matching other files
const firebaseConfig = {
    apiKey: "AIzaSyCMmDlzMavatvqE9-gKW4V6nPAV4U5CzDo",
    authDomain: "notessharingapp-fc388.firebaseapp.com",
    projectId: "notessharingapp-fc388",
    storageBucket: "notessharingapp-fc388.firebasestorage.app",
    messagingSenderId: "64602136432",
    appId: "1:64602136432:web:6e32abecc2bc9ec98179b5"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully");
} else {
    console.log("✅ Firebase already initialized");
}

// Make Firebase, db, and auth globally available on window
window.firebase = firebase;
window.db = firebase.firestore();
window.auth = firebase.auth();

// Session Timeout Tracker
function setupSessionTimeout(minutes) {
    let timeoutId;
    const timeMs = minutes * 60 * 1000;

    function resetTimer() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(logoutUser, timeMs);
    }

    function logoutUser() {
        sessionStorage.clear();
        alert(`Session expired due to ${minutes} minutes of inactivity. Logging out.`);
        window.location.href = 'index.html';
    }

    // Listen for activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer(); // Start the timer
}

// Helper: Convert time to minutes for comparison
function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    } else {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
}

// Global apply settings function
window.applyHospitalSettings = async function () {
    if (!window.db) return;
    try {
        const docRef = window.db.collection('system_config').doc('hospital_settings');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const settings = docSnap.data();
            window.hospitalSettings = settings;
            console.log("💎 Hospital settings loaded & applied:", settings);

            // 1. Apply Hospital Name to all elements with class 'hospital-name'
            if (settings.general && settings.general.hospitalName) {
                document.querySelectorAll('.hospital-name').forEach(el => {
                    const hasEmoji = el.innerText.includes('🏥');
                    el.innerText = (hasEmoji ? '🏥 ' : '') + settings.general.hospitalName;
                    // Make the element visible after updating the name
                    el.style.visibility = 'visible';
                });
            }

            // 2. Apply Currency Symbol across elements
            if (settings.billing && settings.billing.currency) {
                const currency = settings.billing.currency;
                let symbol = '₹';
                let iconClass = 'fa-indian-rupee-sign';
                if (currency === 'USD') {
                    symbol = '$';
                    iconClass = 'fa-dollar-sign';
                } else if (currency === 'EUR') {
                    symbol = '€';
                    iconClass = 'fa-euro-sign';
                }

                window.currencySymbol = symbol;
                window.currencyIconClass = iconClass;

                // Update elements with class 'revenue-number' or specific IDs
                const totalRevenueEl = document.getElementById('totalRevenue');
                if (totalRevenueEl) {
                    if (totalRevenueEl.innerText.startsWith('₹')) {
                        totalRevenueEl.innerText = symbol + totalRevenueEl.innerText.slice(1);
                    }
                }

                const avgFeeEl = document.getElementById('avgFee');
                if (avgFeeEl) {
                    if (avgFeeEl.innerText.startsWith('₹')) {
                        avgFeeEl.innerText = symbol + avgFeeEl.innerText.slice(1);
                    }
                }

                // Replace all hardcoded ₹ text nodes or inline content in stats/tables if we find them
                document.querySelectorAll('.stat-label span i.fa-indian-rupee-sign, .stat-label span i.fa-rupee-sign, i.fa-rupee-sign').forEach(el => {
                    el.className = `fas ${iconClass}`;
                });
            }

            // 3. Apply Working Hours to appointments page dropdown
            const appointmentTimeSelect = document.getElementById('appointmentTime');
            if (appointmentTimeSelect && settings.appointments && settings.appointments.workStart && settings.appointments.workEnd) {
                const workStartMin = timeToMinutes(settings.appointments.workStart);
                const workEndMin = timeToMinutes(settings.appointments.workEnd);

                appointmentTimeSelect.querySelectorAll('option').forEach(opt => {
                    if (!opt.value) return;
                    const optMin = timeToMinutes(opt.value);
                    if (optMin < workStartMin || optMin > workEndMin) {
                        opt.style.display = 'none'; // hide outside slots
                    } else {
                        opt.style.display = ''; // show inside slots
                    }
                });
            }

            // 4. Require prepayment check
            if (settings.appointments && settings.appointments.requirePrepay) {
                const paymentStatusSelect = document.getElementById('paymentStatus');
                if (paymentStatusSelect && !document.getElementById('prepay-note')) {
                    paymentStatusSelect.value = 'Paid';
                    const note = document.createElement('small');
                    note.id = 'prepay-note';
                    note.style.color = '#b34040';
                    note.style.marginTop = '4px';
                    note.style.display = 'block';
                    note.innerHTML = `<i class="fas fa-info-circle"></i> Prepayment is required under system settings.`;
                    paymentStatusSelect.parentNode.parentNode.appendChild(note);
                }
            }

            // 5. EHR integration status
            if (settings.integrations && settings.integrations.ehrSync) {
                const provider = settings.integrations.ehrProvider || 'EHR';
                const container = document.querySelector('.main-header');
                if (container && !document.getElementById('ehr-status-badge')) {
                    const badge = document.createElement('span');
                    badge.id = 'ehr-status-badge';
                    badge.style.background = '#e2f3e4';
                    badge.style.border = '1px solid #b8d9be';
                    badge.style.color = '#1d6f2e';
                    badge.style.padding = '6px 14px';
                    badge.style.borderRadius = '30px';
                    badge.style.fontSize = '12px';
                    badge.style.fontWeight = '500';
                    badge.style.marginLeft = '12px';
                    badge.style.display = 'inline-flex';
                    badge.style.alignItems = 'center';
                    badge.style.gap = '6px';
                    badge.innerHTML = `<i class="fas fa-link"></i> EHR Active (${provider})`;
                    container.appendChild(badge);
                }
            }

            // 6. Security Session Timeout
            if (settings.security && settings.security.sessionTimeout) {
                const timeoutMinutes = parseInt(settings.security.sessionTimeout);
                if (timeoutMinutes > 0) {
                    setupSessionTimeout(timeoutMinutes);
                }
            }
        }
    } catch (e) {
        console.error("Error applying hospital settings:", e);
    }
};

// Initialize settings application when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // NOTE: Theme toggle + sidebar collapse are handled by components/sidebar.js only.
    // firebase-config.js only applies initial dark class (done at file top) and settings.

    // Apply active highlight for current page (sidebar.js also does this, belt+suspenders)
    const path = window.location.pathname.split('/').pop() || 'dashboard.html';
    setTimeout(() => {
        document.querySelectorAll('.menu-item[data-path]').forEach(item => {
            if (item.getAttribute('data-path') === path) {
                item.classList.add('active');
            }
        });
    }, 200);

    // Apply hospital settings from Firestore
    setTimeout(() => {
        window.applyHospitalSettings();
    }, 300);
});


// Custom Logout Modal popup builder
window.showLogoutConfirmation = function(onConfirm) {
    let overlay = document.getElementById('custom-logout-modal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'custom-logout-modal';
        overlay.className = 'custom-modal-overlay';
        overlay.innerHTML = `
            <div class="custom-modal">
                <div class="custom-modal-icon">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
                <h3>Confirm Logout</h3>
                <p>Are you sure you want to securely log out of the hospital management system?</p>
                <div class="custom-modal-actions">
                    <button class="custom-modal-btn custom-modal-cancel" id="modal-cancel-btn">Cancel</button>
                    <button class="custom-modal-btn custom-modal-confirm" id="modal-confirm-btn">Log Out</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('modal-cancel-btn').addEventListener('click', () => {
            overlay.classList.remove('show');
        });
    }
    
    // Setup confirm button and remove old event listeners if any
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', () => {
        overlay.classList.remove('show');
        if (onConfirm) onConfirm();
    });
    
    // Trigger animation
    setTimeout(() => overlay.classList.add('show'), 10);
};