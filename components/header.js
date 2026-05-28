class AppHeader extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Dashboard';
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

        const breadcrumbMap = {
            'dashboard.html':   ['Overview', 'Dashboard'],
            'analytics.html':   ['Overview', 'Analytics'],
            'newPatient.html':  ['Clinical Management', 'Patients'],
            'newDoctor.html':   ['Clinical Management', 'Doctors'],
            'nurses.html':      ['Clinical Management', 'Nurses'],
            'appointments.html':['Operations', 'Appointments'],
            'reports.html':     ['Operations', 'Reports'],
            'settings.html':    ['System', 'Settings'],
            'coming-soon.html': ['Modules', decodeURIComponent(new URLSearchParams(window.location.search).get('module') || 'Module')]
        };

        const crumbs = breadcrumbMap[currentPath] || ['Overview', title];

        this.innerHTML = `
        <div class="main-header">
            <div class="header-left">
                <div class="breadcrumbs">
                    <span class="breadcrumb-home"><i class="fas fa-home"></i></span>
                    <i class="fas fa-chevron-right breadcrumb-sep"></i>
                    <span class="breadcrumb-parent">${crumbs[0]}</span>
                    <i class="fas fa-chevron-right breadcrumb-sep"></i>
                    <span class="breadcrumb-current">${crumbs[1]}</span>
                </div>
                <h1 class="page-title">${title}</h1>
            </div>
            <div class="header-right">
                <button class="header-icon-btn" id="headerSearchBtn" title="Search">
                    <i class="fas fa-search"></i>
                </button>
                <button class="header-icon-btn" id="headerNotifBtn" title="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notif-dot"></span>
                </button>
                <div class="header-date-badge" id="currentDate"></div>
                <div class="header-avatar" title="Profile">
                    <i class="fas fa-user-circle"></i>
                </div>
            </div>
        </div>`;

        // Set date
        const dateEl = this.querySelector('#currentDate');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }

        // Mobile sidebar toggle button
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.id = 'mobileMenuBtn';
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('#appSidebar');
            sidebar?.classList.toggle('mobile-open');
        });
        this.querySelector('.header-left')?.prepend(mobileBtn);
    }
}

customElements.define('app-header', AppHeader);
