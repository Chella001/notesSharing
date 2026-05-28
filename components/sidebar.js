class AppSidebar extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this._sections = this._buildSections();
        this._collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        this._expandedSections = new Set(
            JSON.parse(localStorage.getItem('sidebarExpanded') || '["overview","clinical","operations"]')
        );
        this._currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

        // Auto-expand section of active page
        this._sections.forEach(s => {
            if (s.items.some(i => i.path === this._currentPath || this._currentPath.startsWith(i.path.split('?')[0]))) {
                this._expandedSections.add(s.id);
            }
        });

        this._render();
        this._bindEvents();
        this._injectGlobalToggle();
    }

    _buildSections() {
        const cs = 'coming-soon.html?module=';
        return [
            {
                id: 'overview', label: 'Overview',
                items: [
                    { label: 'Dashboard',  icon: 'chart-pie',     path: 'dashboard.html' },
                    { label: 'Analytics',  icon: 'chart-line',    path: 'analytics.html' }
                ]
            },
            {
                id: 'clinical', label: 'Clinical Management',
                items: [
                    { label: 'Patients',        icon: 'user-injured',    path: 'newPatient.html' },
                    { label: 'Doctors',         icon: 'user-md',         path: 'newDoctor.html' },
                    { label: 'Nurses',          icon: 'user-nurse',      path: cs + 'Nurses' },
                    { label: 'Medical Records', icon: 'file-medical',    path: cs + 'Medical+Records' },
                    { label: 'Prescriptions',   icon: 'prescription-bottle-alt', path: cs + 'Prescriptions' },
                    { label: 'Lab & Diagnostics', icon: 'flask',         path: cs + 'Lab+%26+Diagnostics' },
                    { label: 'Pharmacy',        icon: 'pills',           path: cs + 'Pharmacy' }
                ]
            },
            {
                id: 'operations', label: 'Operations',
                items: [
                    { label: 'Appointments',    icon: 'calendar-check',      path: 'appointments.html' },
                    { label: 'Queue Management',icon: 'list-ol',             path: cs + 'Queue+Management' },
                    { label: 'Billing',         icon: 'file-invoice-dollar', path: cs + 'Billing' },
                    { label: 'Payments',        icon: 'credit-card',         path: cs + 'Payments' },
                    { label: 'Reports',         icon: 'chart-bar',           path: 'reports.html' },
                    { label: 'Inventory',       icon: 'boxes',               path: cs + 'Inventory' }
                ]
            },
            {
                id: 'communication', label: 'Communication',
                items: [
                    { label: 'Notifications',    icon: 'bell',         path: cs + 'Notifications', badge: '3' },
                    { label: 'SMS Reminders',    icon: 'sms',          path: cs + 'SMS+Reminders' },
                    { label: 'Email Management', icon: 'envelope',     path: cs + 'Email+Management' },
                    { label: 'Internal Messages',icon: 'comment-dots', path: cs + 'Internal+Messaging', badge: '5' }
                ]
            },
            {
                id: 'admin', label: 'Administration',
                items: [
                    { label: 'User Management',    icon: 'users-cog',      path: cs + 'User+Management' },
                    { label: 'Roles & Permissions',icon: 'key',            path: cs + 'Roles+%26+Permissions' },
                    { label: 'Departments',        icon: 'sitemap',        path: cs + 'Departments' },
                    { label: 'Audit Logs',         icon: 'clipboard-list', path: cs + 'Audit+Logs' }
                ]
            }
        ];
    }

    _itemHTML(item) {
        const isActive = item.path === this._currentPath ||
            (item.path.split('?')[0] === 'coming-soon.html' && false);
        return `
        <a class="sb-item${isActive ? ' sb-active' : ''}"
           href="${item.path}"
           data-path="${item.path}"
           data-label="${item.label}"
           onclick="event.preventDefault(); window.location.href='${item.path}'">
            <span class="sb-item-icon"><i class="fas fa-${item.icon}"></i></span>
            <span class="sb-item-label">${item.label}</span>
            ${item.badge ? `<span class="sb-badge">${item.badge}</span>` : ''}
            <span class="sb-tooltip">${item.label}</span>
        </a>`;
    }

    _sectionHTML(s) {
        const isExp = this._expandedSections.has(s.id);
        return `
        <div class="sb-section${isExp ? ' sb-sec-open' : ''}" data-sec="${s.id}">
            <button class="sb-sec-hdr" data-sec="${s.id}">
                <span class="sb-sec-label">${s.label}</span>
                <span class="sb-sec-chevron"><i class="fas fa-chevron-right"></i></span>
            </button>
            <div class="sb-sec-body">
                ${s.items.map(i => this._itemHTML(i)).join('')}
            </div>
        </div>`;
    }

    _render() {
        const userName = sessionStorage.getItem('userName') ||
            sessionStorage.getItem('userEmail')?.split('@')[0] || 'Admin';
        const isDark = localStorage.getItem('theme') === 'dark';

        this.innerHTML = `
        <aside class="sb${this._collapsed ? ' sb-mini' : ''}" id="appSidebar" role="navigation" aria-label="Main Navigation">

            <!-- Brand -->
            <div class="sb-brand">
                <div class="sb-brand-logo"><i class="fas fa-heartbeat"></i></div>
                <div class="sb-brand-text">
                    <div class="sb-brand-name">Akshaya Clinic</div>
                    <div class="sb-brand-sub">Enterprise Suite</div>
                </div>
            </div>

            <!-- Search -->
            <div class="sb-search-wrap">
                <div class="sb-search">
                    <i class="fas fa-search"></i>
                    <input id="sbSearch" type="text" placeholder="Search modules..." autocomplete="off" spellcheck="false">
                    <kbd class="sb-search-kbd">⌘K</kbd>
                </div>
            </div>

            <!-- Nav -->
            <nav class="sb-nav" id="sbNav">
                ${this._sections.map(s => this._sectionHTML(s)).join('')}
            </nav>

            <!-- Divider -->
            <div class="sb-divider"></div>

            <!-- System -->
            <div class="sb-system">
                <a class="sb-item${this._currentPath === 'settings.html' ? ' sb-active' : ''}"
                   href="settings.html"
                   data-label="Settings"
                   onclick="event.preventDefault(); window.location.href='settings.html'">
                    <span class="sb-item-icon"><i class="fas fa-cog"></i></span>
                    <span class="sb-item-label">Settings</span>
                    <span class="sb-tooltip">Settings</span>
                </a>

                <button class="sb-item sb-theme-btn" id="sbThemeBtn" data-label="${isDark ? 'Light Mode' : 'Dark Mode'}">
                    <span class="sb-item-icon"><i class="fas fa-${isDark ? 'sun' : 'moon'}"></i></span>
                    <span class="sb-item-label">${isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    <span class="sb-tooltip">${isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button class="sb-item sb-logout-btn" id="sbLogoutBtn" data-label="Logout">
                    <span class="sb-item-icon"><i class="fas fa-sign-out-alt"></i></span>
                    <span class="sb-item-label">Logout</span>
                    <span class="sb-tooltip">Logout</span>
                </button>
            </div>

            <!-- Footer: User -->
            <div class="sb-footer">
                <div class="sb-user">
                    <div class="sb-user-av">
                        ${userName.charAt(0).toUpperCase()}
                    </div>
                    <div class="sb-user-info">
                        <div class="sb-user-name">${userName.charAt(0).toUpperCase() + userName.slice(1)}</div>
                        <div class="sb-user-role">Administrator</div>
                    </div>
                    <div class="sb-user-dot"></div>
                </div>
            </div>
        </aside>`;

        // Apply dark mode
        if (isDark) document.body.classList.add('dark');
    }

    _bindEvents() {
        /* ---- Section headers ---- */
        this.querySelectorAll('.sb-sec-hdr').forEach(hdr => {
            hdr.addEventListener('click', () => {
                const secId = hdr.getAttribute('data-sec');
                const section = this.querySelector(`.sb-section[data-sec="${secId}"]`);
                if (!section) return;
                const opening = !section.classList.contains('sb-sec-open');
                section.classList.toggle('sb-sec-open', opening);
                if (opening) this._expandedSections.add(secId);
                else this._expandedSections.delete(secId);
                localStorage.setItem('sidebarExpanded', JSON.stringify([...this._expandedSections]));
            });
        });

        /* ---- Search ---- */
        const searchInput = this.querySelector('#sbSearch');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                const q = e.target.value.toLowerCase().trim();
                this.querySelectorAll('.sb-item[data-path]').forEach(item => {
                    const lbl = item.getAttribute('data-label')?.toLowerCase() || '';
                    item.style.display = (!q || lbl.includes(q)) ? '' : 'none';
                });
                if (q) {
                    this.querySelectorAll('.sb-section').forEach(s => s.classList.add('sb-sec-open'));
                } else {
                    this.querySelectorAll('.sb-section').forEach(s => {
                        s.classList.toggle('sb-sec-open', this._expandedSections.has(s.getAttribute('data-sec')));
                    });
                }
            });

            // Keyboard shortcut ⌘K / Ctrl+K
            document.addEventListener('keydown', e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
            });
        }

        /* ---- Theme ---- */
        const themeBtn = this.querySelector('#sbThemeBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const dark = document.body.classList.toggle('dark');
                localStorage.setItem('theme', dark ? 'dark' : 'light');
                themeBtn.querySelector('.sb-item-icon i').className = `fas fa-${dark ? 'sun' : 'moon'}`;
                themeBtn.querySelector('.sb-item-label').textContent = dark ? 'Light Mode' : 'Dark Mode';
                themeBtn.querySelector('.sb-tooltip').textContent = dark ? 'Light Mode' : 'Dark Mode';
                themeBtn.setAttribute('data-label', dark ? 'Light Mode' : 'Dark Mode');
            });
        }

        /* ---- Logout ---- */
        const logoutBtn = this.querySelector('#sbLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                const doLogout = () => {
                    const auth = window.auth;
                    if (auth) {
                        auth.signOut()
                            .then(() => { sessionStorage.clear(); window.location.href = 'index.html'; })
                            .catch(() => { sessionStorage.clear(); window.location.href = 'index.html'; });
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

        /* ---- Close mobile drawer on nav click ---- */
        this.querySelectorAll('.sb-item[data-path]').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 768) this._closeMobile();
            });
        });
    }

    _closeMobile() {
        this.querySelector('#appSidebar')?.classList.remove('sb-mobile-open');
        document.getElementById('sbBackdrop')?.classList.remove('show');
        document.getElementById('sbFloatToggle')?.classList.remove('toggle-open');
    }

    _injectGlobalToggle() {
        // Avoid duplicate
        if (document.getElementById('sbFloatToggle')) return;

        // Floating toggle button
        const btn = document.createElement('button');
        btn.id = 'sbFloatToggle';
        btn.className = 'sb-float-toggle';
        btn.setAttribute('title', 'Toggle sidebar');
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(btn);

        // Backdrop for mobile
        const backdrop = document.createElement('div');
        backdrop.id = 'sbBackdrop';
        backdrop.className = 'sb-backdrop';
        document.body.appendChild(backdrop);

        const sidebar = this.querySelector('#appSidebar');
        const dashboard = document.querySelector('.dashboard');

        btn.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                const open = sidebar?.classList.toggle('sb-mobile-open');
                backdrop.classList.toggle('show', open);
                btn.classList.toggle('toggle-open', open);
            } else {
                this._collapsed = !this._collapsed;
                sidebar?.classList.toggle('sb-mini', this._collapsed);
                dashboard?.classList.toggle('sidebar-is-collapsed', this._collapsed);
                localStorage.setItem('sidebarCollapsed', this._collapsed);
            }
        });

        backdrop.addEventListener('click', () => this._closeMobile());

        // Apply collapsed state
        if (this._collapsed) {
            sidebar?.classList.add('sb-mini');
            dashboard?.classList.add('sidebar-is-collapsed');
        }

        // Resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                sidebar?.classList.remove('sb-mobile-open');
                backdrop.classList.remove('show');
                btn.classList.remove('toggle-open');
            }
        });
    }
}

customElements.define('app-sidebar', AppSidebar);
