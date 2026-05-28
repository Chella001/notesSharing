class AppHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Dashboard';
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        
        let breadcrumbLabel = 'Overview';
        if (['newPatient.html', 'newDoctor.html'].includes(currentPath)) breadcrumbLabel = 'Clinical Management';
        if (['appointments.html', 'reports.html'].includes(currentPath)) breadcrumbLabel = 'Operations';
        if (['settings.html'].includes(currentPath)) breadcrumbLabel = 'System';

        this.innerHTML = `
            <div class="main-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
                <div>
                    <div class="breadcrumbs" style="display: flex; gap: 8px; align-items: center; color: var(--ds-text-tertiary); font-size: 0.875rem; margin-bottom: 8px; font-weight: 500;">
                        <span><i class="fas fa-home"></i></span>
                        <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                        <span>${breadcrumbLabel}</span>
                        <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                        <span style="color: var(--brand-500);">${title}</span>
                    </div>
                    <h1 class="text-h1">${title}</h1>
                </div>
                <div class="date-badge" id="currentDate" style="background: var(--ds-bg-card); padding: 8px 16px; border-radius: 999px; border: 1px solid var(--ds-border); box-shadow: var(--shadow-sm); font-size: 0.875rem; font-weight: 500;"></div>
            </div>
        `;
        
        // Set current date
        const dateElement = this.querySelector('#currentDate');
        if (dateElement) {
            dateElement.textContent = new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
}

customElements.define('app-header', AppHeader);
