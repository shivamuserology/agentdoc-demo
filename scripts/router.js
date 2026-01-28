/* ============================================
   DOCUAGENT - Client-Side Router
   ============================================ */

const Router = {
    routes: {},
    currentRoute: null,

    // Initialize router
    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle initial route
        this.handleRoute();
    },

    // Register a route
    register(path, handler) {
        this.routes[path] = handler;
    },

    // Navigate to a route
    navigate(path) {
        window.location.hash = path;
    },

    // Handle route change
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        const [path, params] = hash.split('?');
        const queryParams = params ? Utils.parseQueryString(params) : {};

        // Update current route
        this.currentRoute = path;

        // Update navigation
        this.updateNavigation(path);

        // Update breadcrumb
        this.updateBreadcrumb(path);

        // Call route handler
        if (this.routes[path]) {
            this.routes[path](queryParams);
        } else {
            // Default to dashboard if route not found
            this.routes['dashboard'] && this.routes['dashboard']();
        }

        // Refresh feather icons
        setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
    },

    // Update active navigation item
    updateNavigation(path) {
        // Remove active class from all nav items
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        const activeItem = document.querySelector(`.sidebar-nav-item[data-route="${path}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    },

    // Update breadcrumb
    updateBreadcrumb(path) {
        const breadcrumbMap = {
            'dashboard': 'Dashboard',
            'documents': 'Documents',
            'review': 'Review Queue',
            'configuration': 'Configuration Studio',
            'integrations': 'Integrations',
            'audit': 'Audit Trail',
            'document-detail': 'Document Details',
            'three-way-match': '3-Way Match',
            'claim-detail': 'Claim Details'
        };

        const currentPageEl = document.getElementById('currentPage');
        if (currentPageEl) {
            currentPageEl.textContent = breadcrumbMap[path] || path;
        }
    },

    // Get current route
    getCurrent() {
        return this.currentRoute;
    },

    // Get query parameter
    getParam(key) {
        const hash = window.location.hash.slice(1);
        const [, params] = hash.split('?');
        if (!params) return null;
        const queryParams = Utils.parseQueryString(params);
        return queryParams[key] || null;
    }
};
