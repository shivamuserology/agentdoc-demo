/* ============================================
   DOCUAGENT - Main Application
   ============================================ */

const App = {
    // Current state
    state: {
        currentUseCase: 'procurement',
        selectedDocument: null,
        isModalOpen: false
    },

    // Initialize the application
    init() {
        console.log('🚀 AgentDoc initializing...');

        // Register routes
        this.registerRoutes();

        // Initialize UI
        this.initializeUI();

        // Initialize router
        Router.init();

        // Initialize feather icons
        feather.replace({ 'stroke-width': 2 });

        console.log('✅ AgentDoc ready!');
    },

    // Register all routes
    registerRoutes() {
        Router.register('dashboard', () => DashboardComponent.render());
        Router.register('processing', () => ProcessingComponent.render());
        Router.register('configuration', () => ConfigurationComponent.render());
    },

    // Initialize UI elements
    initializeUI() {
        // Sidebar navigation
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const route = item.dataset.route;
                if (route) Router.navigate(route);
            });
        });

        // Use case switcher
        document.querySelectorAll('.use-case-card').forEach(card => {
            card.addEventListener('click', () => {
                this.switchUseCase(card.dataset.usecase);
            });
        });

        // Create custom use case button
        const createBtn = document.getElementById('openConfigStudio');
        if (createBtn) {
            createBtn.addEventListener('click', () => Router.navigate('configuration'));
        }

        // Modal handlers
        this.initializeModal();

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('open');
            });
        }
    },

    // Switch use case
    switchUseCase(useCase) {
        this.state.currentUseCase = useCase;

        // Update UI
        document.querySelectorAll('.use-case-card').forEach(card => {
            card.classList.toggle('active', card.dataset.usecase === useCase);
        });

        // Refresh current view
        Router.handleRoute();

        Utils.showToast(`Switched to ${useCase === 'procurement' ? 'Procurement' : 'Claims Processing'}`, 'info');
    },

    // Get current use case
    getCurrentUseCase() {
        return this.state.currentUseCase;
    },

    // Initialize modal
    initializeModal() {
        const backdrop = document.getElementById('modalBackdrop');
        const closeBtn = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('modalCancel');

        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.closeModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isModalOpen) {
                this.closeModal();
            }
        });
    },

    // Open modal
    openModal(options = {}) {
        const backdrop = document.getElementById('modalBackdrop');
        const modal = document.getElementById('modal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        const footer = document.getElementById('modalFooter');
        const confirmBtn = document.getElementById('modalConfirm');

        if (options.title) title.textContent = options.title;
        if (options.content) body.innerHTML = options.content;
        if (options.size) {
            modal.className = `modal modal-${options.size}`;
        }
        if (options.confirmText) confirmBtn.textContent = options.confirmText;
        if (options.onConfirm) {
            confirmBtn.onclick = () => {
                options.onConfirm();
                if (!options.keepOpen) this.closeModal();
            };
        }
        if (options.hideFooter) {
            footer.style.display = 'none';
        } else {
            footer.style.display = 'flex';
        }

        backdrop.classList.add('open');
        this.state.isModalOpen = true;

        setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
    },

    // Close modal
    closeModal() {
        const backdrop = document.getElementById('modalBackdrop');
        backdrop.classList.remove('open');
        this.state.isModalOpen = false;
    },

    // Render document detail
    renderDocumentDetail(params) {
        const container = document.getElementById('pageContent');
        const docId = params.id;
        const doc = MockData.procurementDocuments.find(d => d.id === docId);

        if (!doc) {
            container.innerHTML = `
        <div class="empty-state">
          <i data-feather="file-x" class="empty-state-icon"></i>
          <h3 class="empty-state-title">Document Not Found</h3>
          <p class="empty-state-description">The requested document could not be found.</p>
          <button class="btn btn-primary" onclick="Router.navigate('documents')">Back to Documents</button>
        </div>
      `;
            return;
        }

        container.innerHTML = DocumentsComponent.renderDocumentDetail(doc);
    },

    // Render audit trail
    renderAuditTrail() {
        const container = document.getElementById('pageContent');
        const auditData = MockData.auditTrail;

        container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <h1 class="page-title">Audit Trail</h1>
          <p class="page-subtitle">Complete activity log and compliance tracking</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">
            <i data-feather="download"></i>
            Export Log
          </button>
          <button class="btn btn-secondary">
            <i data-feather="filter"></i>
            Filter
          </button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Activity Log</h3>
          <div class="pills">
            <button class="pill active">All</button>
            <button class="pill">Documents</button>
            <button class="pill">Users</button>
            <button class="pill">System</button>
          </div>
        </div>
        <div class="card-body">
          <div class="timeline">
            ${auditData.map(item => `
              <div class="timeline-item">
                <div class="timeline-dot" style="background-color: ${this.getAuditColor(item.action)}"></div>
                <div class="timeline-time">${Utils.formatTime(item.timestamp)} · ${Utils.formatDate(item.timestamp, 'short')}</div>
                <div class="timeline-content">
                  <strong>${item.action}</strong> by <span class="timeline-user">${item.user}</span>
                  <div class="text-secondary text-sm mt-1">${item.details}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    },

    // Get audit action color
    getAuditColor(action) {
        const colorMap = {
            'Document Approved': 'var(--success-500)',
            'Field Corrected': 'var(--warning-500)',
            'Validation Warning': 'var(--warning-500)',
            'Extraction Completed': 'var(--info-500)',
            'Classification': 'var(--info-500)',
            'Document Uploaded': 'var(--primary-500)',
            'Document Rejected': 'var(--error-500)'
        };
        return colorMap[action] || 'var(--primary-500)';
    },

    // Update sidebar visibility based on current route
    updateSidebarVisibility(route) {
        const useCasesSection = document.getElementById('sidebarUseCases');
        if (!useCasesSection) return;

        // Hide Use Cases section when in Configuration Studio
        if (route === 'configuration') {
            useCasesSection.style.display = 'none';
        } else {
            useCasesSection.style.display = 'block';
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
