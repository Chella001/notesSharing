class AppSidebar extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.setActiveLink();
        this.restoreCollapsedState();
        this.setUserInfo();
    }

    getSections() {
        return [
            {
                id: 'overview', title: 'Overview', icon: 'fa-layer-group',
                items: [
                    { label: 'Dashboard',  icon: 'fa-chart-pie',   path: 'dashboard.html' },
                    { label: 'Analytics',  icon: 'fa-chart-line',  path: 'analytics.html' }
                ]
            },
            {
                id: 'clinical', title: 'Clinical Management', icon: 'fa-stethoscope',
                items: [
                    { label: 'Patients',       icon: 'fa-user-injured',    path: 'newPatient.html' },
                    { label: 'Doctors',        icon: 'fa-user-md',         path: 'newDoctor.html' },
                    { label: 'Nurses',         icon: 'fa-user-nurse',      path: 'coming-soon.html?module=Nurses' },
                    { label: 'Medical Records',icon: 'fa-file-medical',    path: 'coming-soon.html?module=Medical+Records' },
                    { label: 'Prescriptions',  icon: 'fa-prescription-bottle-alt', path: 'coming-soon.html?module=Prescriptions' },
                    { label: 'Lab & Diagnostics', icon: 'fa-flask',       path: 'coming-soon.html?module=Lab+%26+Diagnostics' },
                    { label: 'Pharmacy',       icon: 'fa-pills',           path: 'coming-soon.html?module=Pharmacy' },
                    { label: 'Insurance',      icon: 'fa-file-contract',   path: 'coming-soon.html?module=Insurance' }
                ]
            },
            {
                id: 'operations', title: 'Operations', icon: 'fa-cogs',
                items: [
                    { label: 'Appointments',   icon: 'fa-calendar-check',       path: 'appointments.html' },
                    { label: 'Queue Management',icon: 'fa-list-ol',             path: 'coming-soon.html?module=Queue+Management' },
                    { label: 'Billing & Invoicing', icon: 'fa-file-invoice-dollar', path: 'coming-soon.html?module=Billing+%26+Invoicing' },
                    { label: 'Payments',       icon: 'fa-credit-card',          path: 'coming-soon.html?module=Payments' },
                    { label: 'Reports',        icon: 'fa-chart-bar',            path: 'reports.html' },
                    { label: 'Inventory',      icon: 'fa-boxes',                path: 'coming-soon.html?module=Inventory' },
                    { label: 'Room & Bed',     icon: 'fa-bed',                  path: 'coming-soon.html?module=Room+%26+Bed+Allocation' },
                    { label: 'Emergency',      icon: 'fa-ambulance',            path: 'coming-soon.html?module=Emergency+Management' }
                ]
            },
            {
                id: 'communication', title: 'Communication', icon: 'fa-comments',
                items: [
                    { label: 'Notifications',     icon: 'fa-bell',           path: 'coming-soon.html?module=Notifications' },
                    { label: 'Email Management',  icon: 'fa-envelope',       path: 'coming-soon.html?module=Email+Management' },
                    { label: 'SMS Reminders',     icon: 'fa-sms',            path: 'coming-soon.html?module=SMS+Reminders' },
                    { label: 'Internal Messaging',icon: 'fa-comment-dots',   path: 'coming-soon.html?module=Internal+Messaging' },
                    { label: 'Patient Alerts',    icon: 'fa-exclamation-circle', path: 'coming-soon.html?module=Patient+Alerts' }
                ]
            },
            {
                id: 'admin', title: 'Administration', icon: 'fa-user-shield',
                items: [
                    { label: 'User Management',  icon: 'fa-users-cog',       path: 'coming-soon.html?module=User+Management' },
                    { label: 'Roles & Permissions', icon: 'fa-key',          path: 'coming-soon.html?module=Roles+%26+Permissions' },
                    { label: 'Branch Management',icon: 'fa-building',         path: 'coming-soon.html?module=Branch+Management' },
                    { label: 'Departments',      icon: 'fa-sitemap',          path: 'coming-soon.html?module=Departments' },
                    { label: 'Audit Logs',       icon: 'fa-clipboard-list',   path: 'coming-soon.html?module=Audit+Logs' },
                    { label: 'Access Control',   icon: 'fa-lock',             path: 'coming-soon.html?module=Access+Control' }
                ]
            }
        ];
    }

    render() {
        const sections = this.getSections();
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

        // Auto-expand section containing active page
        const expandedSections = new Set(
            JSON.parse(localStorage.getItem('sidebarExpanded') || '["overview","clinical","operations"]')
        );

        // Always expand section of current page
        sections.forEach(section => {
            if (section.items.some(item => item.path === currentPath || currentPath.includes(item.path.split('?')[0]))) {
                expandedSections.add(section.id);
            }
        });

        const sectionsHTML = sections.map(section => {
            const isExpanded = expandedSections.has(section.id);
            return `
            <div class="menu-section ${isExpanded ? 'expanded' : ''}" data-section-id="${section.id}">
                <button class="menu-section-header" data-section="${section.id}">
                    <div class="section-header-left">
                        <i class="fas ${section.icon} section-icon"></i>
                        <span class="menu-group-title">${section.title}</span>
                    </div>
                    <i class="fas fa-chevron-down section-chevron"></i>
                </button>
                <div class="menu-items-wrapper" style="${isExpanded ? '' : 'max-height:0;'}">
                    ${section.items.map(item => {
                        const isActive = item.path === currentPath || 
                            (item.path !== 'coming-soon.html' && currentPath === item.path.split('?')[0]);
                        return `
                        <div class="menu-item${isActive ? ' active' : ''}" 
                             data-path="${item.path}" 
                             onclick="window.location.href='${item.path}'"
                             title="${item.label}">
                            <i class="fas ${item.icon}"></i>
                            <span>${item.label}</span>
                            ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
        }).join('');

        this.innerHTML = `
        <div class="sidebar" id="appSidebar">
            <!-- Brand / Logo -->
            <div class="sidebar-brand">
                <div class="brand-logo"><i class="fas fa-heartbeat"></i></div>
                <div class="brand-text">
                    <div class="brand-name">Akshaya Clinic</div>
                    <div class="brand-sub">Enterprise Suite</div>
                </div>
                <button class="sidebar-pin-btn" id="sidebarPinBtn" title="Toggle sidebar">
                    <i class="fas fa-thumbtack"></i>
                </button>
            </div>

            <!-- Search -->
            <div class="sidebar-search-wrap">
                <div class="sidebar-search">
                    <i class="fas fa-search"></i>
                    <input type="text" id="sidebarSearch" placeholder="Search modules..." autocomplete="off">
                </div>
            </div>

            <!-- Menu -->
            <div class="sidebar-menu" id="sidebarMenu">
                ${sectionsHTML}

                <!-- System section (always visible, no collapse) -->
                <div class="menu-section expanded" data-section-id="system">
                    <button class="menu-section-header" data-section="system">
                        <div class="section-header-left">
                            <i class="fas fa-shield-alt section-icon"></i>
                            <span class="menu-group-title">System</span>
                        </div>
                        <i class="fas fa-chevron-down section-chevron"></i>
                    </button>
                    <div class="menu-items-wrapper">
                        <div class="menu-item${currentPath === 'settings.html' ? ' active' : ''}" 
                             data-path="settings.html" 
                             onclick="window.location.href='settings.html'">
                            <i class="fas fa-cog"></i> <span>Settings</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="sidebar-footer">
                <!-- User Info -->
                <div class="sidebar-user">
                    <div class="sidebar-user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name" id="sidebarUserName">Admin</div>
                        <div class="sidebar-user-role">Administrator</div>
                    </div>
                </div>

                <!-- Theme Toggle -->
                <button class="theme-toggle-btn" id="themeToggleBtn">
                    <i class="fas fa-moon"></i> <span>Dark Mode</span>
                </button>

                <!-- Logout -->
                <div class="menu-item logout" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> <span>Logout</span>
                </div>
            </div>
        </div>`;
    }

    setUserInfo() {
        const nameEl = this.querySelector('#sidebarUserName');
        if (nameEl) {
            const name = sessionStorage.getItem('userName') || 
                         sessionStorage.getItem('userEmail')?.split('@')[0] || 'Admin';
            nameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        }
    }

    setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        this.querySelectorAll('.menu-item[data-path]').forEach(item => {
            const p = item.getAttribute('data-path');
            item.classList.toggle('active', p === currentPath);
        });
    }

    restoreCollapsedState() {
        // Restore sidebar collapsed (icon-only) mode
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            const sidebar = this.querySelector('#appSidebar');
            if (sidebar) {
                sidebar.classList.add('sidebar-collapsed');
                document.querySelector('.dashboard')?.classList.add('sidebar-is-collapsed');
            }
        }
    }

    setupEventListeners() {
        // --- Section collapse/expand ---
        this.querySelectorAll('.menu-section-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const sectionId = header.getAttribute('data-section');
                const section = this.querySelector(`.menu-section[data-section-id="${sectionId}"]`);
                const wrapper = section?.querySelector('.menu-items-wrapper');
                if (!section || !wrapper) return;

                const isExpanding = !section.classList.contains('expanded');

                // Animate height
                if (isExpanding) {
                    wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
                    section.classList.add('expanded');
                } else {
                    wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
                    requestAnimationFrame(() => {
                        wrapper.style.maxHeight = '0';
                        section.classList.remove('expanded');
                    });
                }

                // Persist expanded state
                const expanded = JSON.parse(localStorage.getItem('sidebarExpanded') || '[]');
                if (isExpanding) {
                    if (!expanded.includes(sectionId)) expanded.push(sectionId);
                } else {
                    const idx = expanded.indexOf(sectionId);
                    if (idx > -1) expanded.splice(idx, 1);
                }
                localStorage.setItem('sidebarExpanded', JSON.stringify(expanded));
            });
        });

        // Set initial max-height for expanded sections (needed for transition)
        this.querySelectorAll('.menu-section.expanded .menu-items-wrapper').forEach(w => {
            // Allow CSS to handle it — set max-height to a large value
            w.style.maxHeight = '500px';
        });

        // --- Pin / Collapse sidebar ---
        const pinBtn = this.querySelector('#sidebarPinBtn');
        const sidebar = this.querySelector('#appSidebar');
        if (pinBtn && sidebar) {
            pinBtn.addEventListener('click', () => {
                const isCollapsed = sidebar.classList.toggle('sidebar-collapsed');
                document.querySelector('.dashboard')?.classList.toggle('sidebar-is-collapsed', isCollapsed);
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            });
        }

        // --- Search filter ---
        const searchInput = this.querySelector('#sidebarSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                this.querySelectorAll('.menu-item[data-path]').forEach(item => {
                    const label = item.querySelector('span')?.textContent.toLowerCase() || '';
                    const match = !query || label.includes(query);
                    item.style.display = match ? '' : 'none';
                });
                // Expand all sections when searching
                if (query) {
                    this.querySelectorAll('.menu-section').forEach(s => {
                        const wrapper = s.querySelector('.menu-items-wrapper');
                        if (wrapper) wrapper.style.maxHeight = '500px';
                        s.classList.add('expanded');
                    });
                }
            });
        }

        // --- Theme toggle ---
        const themeBtn = this.querySelector('#themeToggleBtn');
        if (themeBtn) {
            const isDark = localStorage.getItem('theme') === 'dark';
            if (isDark) {
                document.body.classList.add('dark');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>';
            }
            themeBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark');
                const dark = document.body.classList.contains('dark');
                localStorage.setItem('theme', dark ? 'dark' : 'light');
                themeBtn.innerHTML = dark
                    ? '<i class="fas fa-sun"></i> <span>Light Mode</span>'
                    : '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
            });
        }

        // --- Logout ---
        const logoutBtn = this.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                const doLogout = () => {
                    const auth = window.auth || firebase?.auth?.();
                    if (auth) {
                        auth.signOut().then(() => {
                            sessionStorage.clear();
                            if (window.showNotification) window.showNotification('Logged out successfully');
                            setTimeout(() => window.location.href = 'index.html', 1200);
                        }).catch(() => window.location.href = 'index.html');
                    } else {
                        sessionStorage.clear();
                        window.location.href = 'index.html';
                    }
                };
                if (typeof window.showLogoutConfirmation === 'function') {
                    window.showLogoutConfirmation(doLogout);
                } else {
                    doLogout();
                }
            });
        }

        // --- Mobile: close sidebar on item click ---
        this.querySelectorAll('.menu-item[data-path]').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    sidebar?.classList.remove('mobile-open');
                }
            });
        });
    }
}

customElements.define('app-sidebar', AppSidebar);
