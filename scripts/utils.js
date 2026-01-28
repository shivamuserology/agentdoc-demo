/* ============================================
   DOCUAGENT - Utility Functions
   ============================================ */

const Utils = {
    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format date
    formatDate(dateString, format = 'medium') {
        const date = new Date(dateString);
        const options = {
            short: { month: 'short', day: 'numeric' },
            medium: { month: 'short', day: 'numeric', year: 'numeric' },
            long: { month: 'long', day: 'numeric', year: 'numeric' },
            full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        };
        return date.toLocaleDateString('en-US', options[format] || options.medium);
    },

    // Format time
    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    },

    // Format relative time
    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return this.formatDate(dateString, 'short');
    },

    // Get confidence level class
    getConfidenceLevel(confidence) {
        if (confidence >= 90) return 'high';
        if (confidence >= 70) return 'medium';
        return 'low';
    },

    // Get confidence color
    getConfidenceColor(confidence) {
        if (confidence >= 90) return 'var(--success-500)';
        if (confidence >= 70) return 'var(--warning-500)';
        return 'var(--error-500)';
    },

    // Get status badge class
    getStatusBadgeClass(status) {
        const statusMap = {
            'verified': 'badge-success',
            'matched': 'badge-success',
            'passed': 'badge-success',
            'approved': 'badge-success',
            'complete': 'badge-success',
            'review': 'badge-warning',
            'pending': 'badge-warning',
            'in_review': 'badge-warning',
            'in_progress': 'badge-info',
            'processing': 'badge-info',
            'variance': 'badge-warning',
            'flagged': 'badge-warning',
            'failed': 'badge-error',
            'error': 'badge-error',
            'exception': 'badge-error',
            'rejected': 'badge-error'
        };
        return statusMap[status] || 'badge-default';
    },

    // Format status label
    formatStatus(status) {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    // Generate unique ID
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Parse query string
    parseQueryString(queryString) {
        const params = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return params;
    },

    // Create element with classes and attributes
    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        if (options.className) element.className = options.className;
        if (options.id) element.id = options.id;
        if (options.innerHTML) element.innerHTML = options.innerHTML;
        if (options.textContent) element.textContent = options.textContent;
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        if (options.dataset) {
            Object.entries(options.dataset).forEach(([key, value]) => {
                element.dataset[key] = value;
            });
        }
        if (options.events) {
            Object.entries(options.events).forEach(([event, handler]) => {
                element.addEventListener(event, handler);
            });
        }
        return element;
    },

    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = this.createElement('div', {
            className: `alert alert-${type} animate-slide-in-right`,
            innerHTML: `
        <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : type === 'warning' ? 'alert-triangle' : 'info'}" class="alert-icon"></i>
        <div class="alert-content">
          <div class="alert-message">${this.escapeHtml(message)}</div>
        </div>
      `
        });

        container.appendChild(toast);
        feather.replace({ 'stroke-width': 2 });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Animate number counting
    animateValue(element, start, end, duration = 1000) {
        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            const current = Math.floor(start + (end - start) * easeProgress);
            element.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    },

    // Get icon SVG
    getIcon(name, size = 20) {
        return `<i data-feather="${name}" width="${size}" height="${size}"></i>`;
    },

    // Create confidence bar HTML
    createConfidenceBar(confidence) {
        const level = this.getConfidenceLevel(confidence);
        return `
      <div class="confidence-bar">
        <div class="confidence-bar-track">
          <div class="confidence-bar-fill ${level}" style="width: ${confidence}%"></div>
        </div>
        <span class="confidence-label text-${level === 'high' ? 'success' : level === 'medium' ? 'warning' : 'error'}">${confidence}%</span>
      </div>
    `;
    },

    // Create status badge HTML
    createStatusBadge(status) {
        return `<span class="badge ${this.getStatusBadgeClass(status)}">${this.formatStatus(status)}</span>`;
    },

    // Create avatar HTML
    createAvatar(name, size = '') {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return `<div class="avatar ${size ? 'avatar-' + size : ''}">${initials}</div>`;
    },

    // Simulate file upload progress
    simulateUpload(onProgress, onComplete, duration = 2000) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                onProgress(100);
                setTimeout(onComplete, 300);
            } else {
                onProgress(Math.floor(progress));
            }
        }, duration / 10);
    },

    // Simulate processing steps
    async simulateProcessing(steps, onStep) {
        for (let i = 0; i < steps.length; i++) {
            onStep(i, steps[i]);
            await simulateDelay(800 + Math.random() * 400);
        }
    }
};

// Add toast container styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  .toast-container {
    position: fixed;
    top: 80px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1000;
    pointer-events: none;
  }
  .toast-container > * {
    pointer-events: auto;
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(toastStyles);
