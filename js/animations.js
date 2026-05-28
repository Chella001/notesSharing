import { animate, stagger, inView, spring } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";

window.animate = animate;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Page Transition
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        animate(mainContent, { opacity: [0, 1], y: [15, 0] }, { duration: 0.5, easing: "ease-out" });
    }

    // 2. Staggered Stat Cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        animate(statCards, 
            { opacity: [0, 1], y: [20, 0] },
            { delay: stagger(0.08), duration: 0.6, easing: spring({ stiffness: 300, damping: 20 }) }
        );
    }
    
    // 3. Button Micro-interactions (Hover only to preserve native clicks)
    const initButtons = () => {
        const buttons = document.querySelectorAll('.ds-btn, .view-all, .tab-btn');
        buttons.forEach(btn => {
            // Avoid attaching multiple times
            if (btn.dataset.animated) return;
            btn.dataset.animated = "true";
            
            btn.addEventListener('mouseenter', () => {
                animate(btn, { scale: 1.02 }, { duration: 0.2, easing: spring({ stiffness: 400, damping: 15 }) });
            });
            btn.addEventListener('mouseleave', () => {
                animate(btn, { scale: 1 }, { duration: 0.2, easing: spring({ stiffness: 400, damping: 15 }) });
            });
        });
    };
    initButtons();
    
    // Observe DOM mutations to animate dynamically added buttons
    const observer = new MutationObserver(() => initButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    // 4. Scroll Reveal Animations
    const scrollElements = document.querySelectorAll('.ds-card, .ds-table-container, .charts-grid, .register-card, .login-card');
    scrollElements.forEach(el => {
        el.style.opacity = '0'; // Initial state
        inView(el, () => {
            animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: 0.6, easing: spring({ stiffness: 250, damping: 25 }) });
        }, { margin: "-20px" });
    });
});

// Expose global animation utilities for custom interactions
window.dsAnimate = {
    fadeInUp: (element) => animate(element, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, easing: "ease-out" }),
    springScale: (element) => animate(element, { scale: [0.9, 1], opacity: [0, 1] }, { easing: spring({ stiffness: 300, damping: 15 }) }),
    popIn: (element) => animate(element, { scale: [0.5, 1], opacity: [0, 1] }, { easing: spring({ stiffness: 400, damping: 20 }) }),
    countUp: (element, endValue, duration = 1.5, prefix = "") => {
        let startTime = null;
        const startValue = 0;
        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            // easeOutExpo formula for satisfying deceleration
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(easeOutProgress * (endValue - startValue) + startValue);
            element.textContent = prefix + currentValue.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = prefix + endValue.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }
};
