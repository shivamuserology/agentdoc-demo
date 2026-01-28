/* ============================================
   DOCUAGENT - Polished Dashboard Component
   ============================================ */

const DashboardComponent = {
  render() {
    const container = document.getElementById('pageContent');
    const useCase = App.getCurrentUseCase();
    const useCaseLabel = useCase === 'procurement' ? 'Procurement 3-Way Match' : 'Claims Processing';
    const docTypes = MockData.documentTypes.filter(dt =>
      (useCase === 'procurement' && ['Procurement', 'Finance'].includes(dt.category)) ||
      (useCase === 'claims' && ['Healthcare', 'Identity'].includes(dt.category))
    );

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <h1 class="page-title">Welcome to DocuAgent</h1>
          <p class="page-subtitle">AI-Powered Document Processing Engine</p>
        </div>
      </div>

      <!-- Hero Section - Configuration Studio CTA -->
      <div class="hero-card mb-6">
        <div class="hero-content">
          <div class="hero-badge">
            <i data-feather="star" width="14" height="14"></i>
            Platform Differentiator
          </div>
          <h2 class="hero-title">Configuration Studio</h2>
          <p class="hero-description">
            Build custom document processing pipelines in minutes. Define extraction schemas, 
            set validation rules, design workflows—all without writing code.
          </p>
          <div class="hero-actions">
            <button class="btn btn-lg" style="background: white; color: var(--primary-700);" onclick="Router.navigate('configuration')">
              <i data-feather="settings"></i>
              Open Configuration Studio
            </button>
            <button class="btn btn-lg btn-ghost" style="color: white; border-color: rgba(255,255,255,0.3);" onclick="DashboardComponent.showDemo()">
              <i data-feather="play-circle"></i>
              Watch Demo
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-visual-inner">
            <div class="hero-icon-grid">
              <div class="hero-icon-item"><i data-feather="file-text" width="24" height="24"></i></div>
              <div class="hero-icon-item"><i data-feather="cpu" width="24" height="24"></i></div>
              <div class="hero-icon-item"><i data-feather="check-circle" width="24" height="24"></i></div>
              <div class="hero-icon-item"><i data-feather="database" width="24" height="24"></i></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row mb-6">
        <div class="stat-item">
          <div class="stat-icon primary">
            <i data-feather="layers" width="20" height="20"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">${MockData.documentTypes.length}</div>
            <div class="stat-label">Document Types</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon success">
            <i data-feather="target" width="20" height="20"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">94.2%</div>
            <div class="stat-label">Extraction Accuracy</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon warning">
            <i data-feather="clock" width="20" height="20"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">2.3s</div>
            <div class="stat-label">Avg Processing</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon info">
            <i data-feather="activity" width="20" height="20"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">1,247</div>
            <div class="stat-label">Docs This Month</div>
          </div>
        </div>
      </div>

      <!-- Action Cards -->
      <h3 class="section-title">Get Started</h3>
      <div class="action-cards-grid mb-6">
        <div class="action-card" onclick="Router.navigate('processing')">
          <div class="action-card-icon primary">
            <i data-feather="upload-cloud" width="28" height="28"></i>
          </div>
          <div class="action-card-content">
            <h4 class="action-card-title">Process Documents</h4>
            <p class="action-card-description">
              Upload documents and watch AI extraction in action. See confidence scores, 3-way matching, and approve results.
            </p>
          </div>
          <div class="action-card-arrow">
            <i data-feather="arrow-right" width="20" height="20"></i>
          </div>
        </div>

        <div class="action-card" onclick="Router.navigate('configuration')">
          <div class="action-card-icon secondary">
            <i data-feather="sliders" width="28" height="28"></i>
          </div>
          <div class="action-card-content">
            <h4 class="action-card-title">Configure Document Type</h4>
            <p class="action-card-description">
              Create a new document type with custom fields, validation rules, and processing workflow.
            </p>
          </div>
          <div class="action-card-arrow">
            <i data-feather="arrow-right" width="20" height="20"></i>
          </div>
        </div>
      </div>

      <!-- Document Types Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Configured Document Types</h3>
            <p class="text-sm text-secondary mt-1">Active use case: ${useCaseLabel}</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('configuration')">
            <i data-feather="plus" width="16" height="16"></i>
            New Type
          </button>
        </div>
        <div class="doc-types-list">
          ${MockData.documentTypes.map((dt, i) => `
            <div class="doc-type-row" onclick="DashboardComponent.viewDocType('${dt.id}')">
              <div class="doc-type-icon">
                <i data-feather="${this.getDocTypeIcon(dt.category)}" width="20" height="20"></i>
              </div>
              <div class="doc-type-info">
                <div class="doc-type-name">${dt.name}</div>
                <div class="doc-type-meta">${dt.fieldsCount} fields · ${dt.rulesCount} rules</div>
              </div>
              <span class="badge badge-default">${dt.category}</span>
              <span class="badge badge-success">Active</span>
              <button class="btn btn-icon-sm btn-ghost" onclick="event.stopPropagation(); DashboardComponent.editDocType('${dt.id}')">
                <i data-feather="edit-2" width="14" height="14"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
  },

  getDocTypeIcon(category) {
    const icons = {
      'Procurement': 'shopping-cart',
      'Finance': 'dollar-sign',
      'Healthcare': 'heart',
      'Identity': 'user',
      'Legal': 'file-text'
    };
    return icons[category] || 'file';
  },

  viewDocType(id) {
    Router.navigate('configuration');
    Utils.showToast('Viewing document type configuration', 'info');
  },

  editDocType(id) {
    Router.navigate('configuration');
    Utils.showToast('Opening document type editor', 'info');
  },

  showDemo() {
    App.openModal({
      title: 'Configuration Studio Demo',
      size: 'xl',
      hideFooter: true,
      content: `
        <div class="text-center py-8">
          <div class="demo-placeholder">
            <i data-feather="play-circle" width="64" height="64" style="color: var(--primary-500); margin-bottom: var(--space-4);"></i>
            <h4 class="font-semibold mb-2">Demo Video</h4>
            <p class="text-secondary text-sm mb-4">Watch how to configure a new document type in under 5 minutes</p>
            <button class="btn btn-primary" onclick="App.closeModal(); Router.navigate('configuration');">
              Try It Yourself Instead
            </button>
          </div>
        </div>
      `
    });
  }
};
