class AppSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.setActiveLink();
    }

    render() {
        this.innerHTML = `
        <div class="sidebar">
            <div class="hospital-brand">
                <div class="hospital-logo"><i class="fas fa-heartbeat"></i></div>
                <div class="hospital-name">🏥 Akshaya Clinic</div>
            </div>
            <div class="sidebar-menu">
                <div class="menu-group">
                    <div class="menu-group-title">Overview</div>
                    <div class="menu-item" data-path="dashboard.html" onclick="window.location.href='dashboard.html'">
                        <i class="fas fa-chart-pie"></i> <span>Dashboard</span>
                    </div>
                </div>
                <div class="menu-group">
                    <div class="menu-group-title">Clinical Management</div>
                    <div class="menu-item" data-path="newPatient.html" onclick="window.location.href='newPatient.html'">
                        <i class="fas fa-user-injured"></i> <span>Patients</span>
                    </div>
                    <div class="menu-item" data-path="newDoctor.html" onclick="window.location.href='newDoctor.html'">
                        <i class="fas fa-user-md"></i> <span>Doctors</span>
                    </div>
                </div>
                <div class="menu-group">
                    <div class="menu-group-title">Operations</div>
                    <div class="menu-item" data-path="appointments.html" onclick="window.location.href='appointments.html'">
                        <i class="fas fa-calendar-check"></i> <span>Appointments</span>
                    </div>
                    <div class="menu-item" data-path="reports.html" onclick="window.location.href='reports.html'">
                        <i class="fas fa-chart-bar"></i> <span>Reports</span>
                    </div>
                </div>
                <div class="menu-group">
                    <div class="menu-group-title">System</div>
                    <div class="menu-item" data-path="settings.html" onclick="window.location.href='settings.html'">
                        <i class="fas fa-cog"></i> <span>Settings</span>
                    </div>
                </div>
                <div class="sidebar-footer">
                    <button class="theme-toggle-btn" id="themeToggleBtn">
                        <i class="fas fa-moon"></i> <span>Dark Mode</span>
                    </button>
                    <div class="menu-item logout" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i> <span>Logout</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        const menuItems = this.querySelectorAll('.menu-item[data-path]');
        menuItems.forEach(item => {
            if (item.getAttribute('data-path') === currentPath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        const logoutBtn = this.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.showLogoutConfirmation && window.auth) {
                    window.showLogoutConfirmation(() => {
                        window.auth.signOut().then(() => {
                            sessionStorage.clear();
                            if (window.showNotification) window.showNotification("Logged out successfully");
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1500);
                        }).catch(error => {
                            if (window.showNotification) window.showNotification("Error logging out: " + error.message, "error");
                        });
                    });
                } else if (window.auth) {
                    window.auth.signOut().then(() => {
                        sessionStorage.clear();
                        window.location.href = 'index.html';
                    });
                } else {
                    sessionStorage.clear();
                    window.location.href = 'index.html';
                }
            });
        }

        const themeToggleBtn = this.querySelector('#themeToggleBtn');
        if (themeToggleBtn) {
            // Check current theme
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark');
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>';
            }

            themeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark');
                const isDark = document.body.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                themeToggleBtn.innerHTML = isDark ? 
                    '<i class="fas fa-sun"></i> <span>Light Mode</span>' : 
                    '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
            });
        }
    }
}

customElements.define('app-sidebar', AppSidebar);
