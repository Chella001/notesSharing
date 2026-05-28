class AppHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Dashboard';
        this.innerHTML = `
            <div class="main-header">
                <h1>${title}</h1>
                <div class="date-badge" id="currentDate"></div>
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
