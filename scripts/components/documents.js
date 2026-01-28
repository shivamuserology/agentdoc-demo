/* ============================================
   DOCUAGENT - Documents Component
   ============================================ */

const DocumentsComponent = {
    currentView: 'list', // 'list', 'upload', 'detail'
    selectedDocuments: [],

    render() {
        const container = document.getElementById('pageContent');
        const useCase = App.getCurrentUseCase();

        container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <h1 class="page-title">Documents</h1>
          <p class="page-subtitle">Manage and process ${useCase === 'procurement' ? 'procurement' : 'claims'} documents</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary" onclick="DocumentsComponent.switchView('list')">
            <i data-feather="list"></i>
            List View
          </button>
          <button class="btn btn-primary" onclick="DocumentsComponent.showUploadModal()">
            <i data-feather="upload"></i>
            Upload Documents
          </button>
        </div>
      </div>

      <div class="documents-container">
        ${this.renderToolbar()}
        ${this.renderDocumentsList()}
      </div>
    `;

        setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
    },

    renderToolbar() {
        return `
      <div class="documents-toolbar">
        <div class="documents-filters">
          <div class="topbar-search" style="width: 240px;">
            <i data-feather="search" class="topbar-search-icon"></i>
            <input type="text" class="topbar-search-input" placeholder="Search documents...">
          </div>
          <div class="filter-group">
            <select class="form-select" style="width: 150px;">
              <option value="">All Types</option>
              <option value="purchase_order">Purchase Order</option>
              <option value="invoice">Invoice</option>
              <option value="grn">GRN</option>
            </select>
          </div>
          <div class="filter-group">
            <select class="form-select" style="width: 150px;">
              <option value="">All Statuses</option>
              <option value="matched">Matched</option>
              <option value="variance">Variance</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary btn-sm" onclick="Router.navigate('three-way-match')">
            <i data-feather="git-merge"></i>
            Run 3-Way Match
          </button>
          <span class="text-sm text-secondary">Showing ${MockData.procurementDocuments.length} documents</span>
        </div>
      </div>
    `;
    },

    renderDocumentsList() {
        const useCase = App.getCurrentUseCase();
        const documents = useCase === 'procurement'
            ? MockData.procurementDocuments
            : MockData.claimsDocuments.flatMap(c => c.documents.map(d => ({ ...d, claimNumber: c.claimNumber })));

        return `
      <div class="flex flex-col gap-3">
        ${documents.map(doc => this.renderDocumentCard(doc)).join('')}
      </div>
    `;
    },

    renderDocumentCard(doc) {
        const typeIcons = {
            'purchase_order': 'file-text',
            'invoice': 'file',
            'grn': 'package',
            'claim_form': 'clipboard',
            'medical_bill': 'file-text',
            'id_document': 'credit-card'
        };
        const icon = typeIcons[doc.type] || 'file';
        const statusBadge = Utils.createStatusBadge(doc.status);
        const confidenceBar = Utils.createConfidenceBar(doc.confidence);

        return `
      <div class="document-card animate-fade-in" onclick="Router.navigate('document-detail?id=${doc.id}')">
        <div class="document-card-preview">
          <i data-feather="${icon}" class="document-card-preview-icon" width="40" height="40"></i>
        </div>
        <div class="document-card-content">
          <div class="document-card-header">
            <div>
              <div class="document-card-title">${doc.typeLabel || doc.type}</div>
              <div class="document-card-subtitle">${doc.number || doc.fileName || doc.id}</div>
            </div>
            ${statusBadge}
          </div>
          <div class="document-card-meta">
            ${doc.vendor ? `<span class="document-card-meta-item"><i data-feather="building" width="14" height="14"></i> ${doc.vendor}</span>` : ''}
            ${doc.amount ? `<span class="document-card-meta-item"><i data-feather="dollar-sign" width="14" height="14"></i> ${Utils.formatCurrency(doc.amount)}</span>` : ''}
            ${doc.date ? `<span class="document-card-meta-item"><i data-feather="calendar" width="14" height="14"></i> ${Utils.formatDate(doc.date)}</span>` : ''}
          </div>
          <div style="max-width: 200px; margin-top: var(--space-2);">
            ${confidenceBar}
          </div>
        </div>
        <div class="document-card-actions">
          <button class="btn btn-icon btn-ghost tooltip" onclick="event.stopPropagation(); DocumentsComponent.viewDocument('${doc.id}')">
            <i data-feather="eye" width="18" height="18"></i>
            <span class="tooltip-content">View</span>
          </button>
          <button class="btn btn-icon btn-ghost tooltip" onclick="event.stopPropagation(); DocumentsComponent.downloadDocument('${doc.id}')">
            <i data-feather="download" width="18" height="18"></i>
            <span class="tooltip-content">Download</span>
          </button>
        </div>
      </div>
    `;
    },

    renderDocumentDetail(doc) {
        return `
      <div class="page-header">
        <div class="page-header-content">
          <div class="flex items-center gap-3 mb-2">
            <button class="btn btn-icon btn-ghost" onclick="Router.navigate('documents')">
              <i data-feather="arrow-left" width="20" height="20"></i>
            </button>
            <h1 class="page-title">${doc.typeLabel}</h1>
            ${Utils.createStatusBadge(doc.status)}
          </div>
          <p class="page-subtitle">${doc.number} • ${doc.vendor}</p>
        </div>
        <div class="page-header-actions">
          ${doc.relatedPO || doc.type === 'purchase_order' ? `
            <button class="btn btn-secondary" onclick="Router.navigate('three-way-match?poId=${doc.relatedPO || doc.number}')">
              <i data-feather="git-merge"></i>
              View 3-Way Match
            </button>
          ` : ''}
          <button class="btn btn-success">
            <i data-feather="check"></i>
            Approve
          </button>
        </div>
      </div>

      <div class="document-detail">
        <!-- Document Viewer -->
        <div class="document-detail-viewer">
          <div class="document-detail-viewer-header">
            <div class="flex items-center gap-2">
              <span class="badge badge-primary">${doc.typeLabel}</span>
              <span class="text-sm text-secondary">${doc.number}</span>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn btn-icon-sm btn-ghost">
                <i data-feather="zoom-out" width="16" height="16"></i>
              </button>
              <span class="text-sm">100%</span>
              <button class="btn btn-icon-sm btn-ghost">
                <i data-feather="zoom-in" width="16" height="16"></i>
              </button>
            </div>
          </div>
          <div class="document-detail-viewer-content">
            ${this.renderDocumentPreview(doc)}
          </div>
        </div>

        <!-- Sidebar -->
        <div class="document-detail-sidebar">
          ${this.renderExtractionPanel(doc)}
          ${this.renderLineItemsPanel(doc)}
          ${this.renderAuditPanel(doc.id)}
        </div>
      </div>
    `;
    },

    renderDocumentPreview(doc) {
        // Generate a document preview placeholder
        return `
      <div class="document-preview-placeholder">
        <div class="preview-header-block">
          <div class="preview-logo-placeholder"></div>
          <div class="preview-document-info">
            <div class="preview-line short" style="margin-left: auto;"></div>
            <div class="preview-line short" style="margin-left: auto;"></div>
          </div>
        </div>
        <div style="margin-top: auto;">
          <div class="preview-line medium"></div>
          <div class="preview-line long"></div>
          <div class="preview-line short"></div>
        </div>
        <div class="preview-table">
          <div class="preview-table-row preview-table-header">
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
          </div>
          <div class="preview-table-row">
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
          </div>
          <div class="preview-table-row">
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
          </div>
          <div class="preview-table-row">
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
            <div class="preview-table-cell"></div>
          </div>
        </div>
        <div style="margin-top: auto;">
          <div class="preview-line short" style="margin-left: auto;"></div>
          <div class="preview-line medium" style="margin-left: auto;"></div>
        </div>
      </div>
    `;
    },

    renderExtractionPanel(doc) {
        if (!doc.extractedFields) return '';

        return `
      <div class="extraction-panel">
        <div class="extraction-panel-header">
          <h3 class="extraction-panel-title">Extracted Fields</h3>
          <span class="badge badge-success">${doc.extractedFields.filter(f => f.status === 'verified').length}/${doc.extractedFields.length} Verified</span>
        </div>
        <div class="extraction-list">
          ${doc.extractedFields.map(field => `
            <div class="extraction-item">
              <div class="extraction-item-status ${field.status}"></div>
              <div class="extraction-item-content">
                <div class="extraction-item-label">${field.name}</div>
                <div class="extraction-item-value">${field.value}</div>
              </div>
              <div class="extraction-item-confidence">
                ${Utils.createConfidenceBar(field.confidence)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    },

    renderLineItemsPanel(doc) {
        if (!doc.lineItems || doc.lineItems.length === 0) return '';

        return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Line Items</h3>
          <span class="badge badge-default">${doc.lineItems.length} items</span>
        </div>
        <div class="card-body p-0">
          <table class="line-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="number">Qty</th>
                <th class="number">Unit Price</th>
                <th class="number">Total</th>
              </tr>
            </thead>
            <tbody>
              ${doc.lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="number">${item.quantity}</td>
                  <td class="number">${Utils.formatCurrency(item.unitPrice)}</td>
                  <td class="number">${Utils.formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right;">Total</td>
                <td class="number">${Utils.formatCurrency(doc.amount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;
    },

    renderAuditPanel(docId) {
        const auditItems = MockData.auditTrail.filter(a => a.documentId === docId).slice(0, 5);
        if (auditItems.length === 0) return '';

        return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Activity</h3>
        </div>
        <div class="card-body">
          <div class="timeline">
            ${auditItems.map(item => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time">${Utils.formatTime(item.timestamp)}</div>
                <div class="timeline-content">
                  <strong>${item.action}</strong> by <span class="timeline-user">${item.user}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    },

    showUploadModal() {
        App.openModal({
            title: 'Upload Documents',
            size: 'lg',
            content: `
        <div class="upload-dropzone" id="uploadDropzone">
          <i data-feather="upload-cloud" class="upload-dropzone-icon"></i>
          <div class="upload-dropzone-title">Drag and drop files here</div>
          <div class="upload-dropzone-subtitle">or click to browse</div>
          <div class="upload-dropzone-formats">
            Supports: PDF, PNG, JPG, TIFF (max 25MB)
          </div>
          <input type="file" id="fileInput" multiple accept=".pdf,.png,.jpg,.jpeg,.tiff" style="display: none;">
        </div>
        <div id="uploadQueue" class="mt-4"></div>
      `,
            confirmText: 'Process Documents',
            onConfirm: () => this.processUploadedDocuments()
        });

        setTimeout(() => {
            const dropzone = document.getElementById('uploadDropzone');
            const fileInput = document.getElementById('fileInput');

            if (dropzone) {
                dropzone.addEventListener('click', () => fileInput.click());
                dropzone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropzone.classList.add('active');
                });
                dropzone.addEventListener('dragleave', () => dropzone.classList.remove('active'));
                dropzone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropzone.classList.remove('active');
                    this.handleFiles(e.dataTransfer.files);
                });
            }

            if (fileInput) {
                fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
            }

            feather.replace({ 'stroke-width': 2 });
        }, 100);
    },

    handleFiles(files) {
        const queue = document.getElementById('uploadQueue');
        if (!queue) return;

        const filesList = Array.from(files);
        queue.innerHTML = filesList.map((file, index) => `
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2" id="file-${index}">
        <i data-feather="file" width="20" height="20" style="color: var(--text-secondary);"></i>
        <div class="flex-1">
          <div class="text-sm font-medium">${file.name}</div>
          <div class="progress progress-sm mt-2">
            <div class="progress-bar" id="progress-${index}" style="width: 0%"></div>
          </div>
        </div>
        <span class="text-xs text-secondary" id="status-${index}">Waiting...</span>
      </div>
    `).join('');

        feather.replace({ 'stroke-width': 2 });

        // Simulate upload progress for each file
        filesList.forEach((file, index) => {
            setTimeout(() => {
                Utils.simulateUpload(
                    (progress) => {
                        const progressBar = document.getElementById(`progress-${index}`);
                        const status = document.getElementById(`status-${index}`);
                        if (progressBar) progressBar.style.width = `${progress}%`;
                        if (status) status.textContent = `${progress}%`;
                    },
                    () => {
                        const status = document.getElementById(`status-${index}`);
                        if (status) {
                            status.textContent = '✓ Ready';
                            status.style.color = 'var(--success-600)';
                        }
                    }
                );
            }, index * 500);
        });
    },

    processUploadedDocuments() {
        Utils.showToast('Documents uploaded! Processing with AI...', 'info');

        // Simulate processing animation
        setTimeout(() => {
            Utils.showToast('Classification complete! 3 documents detected.', 'success');
        }, 1500);

        setTimeout(() => {
            Utils.showToast('Extraction complete! Ready for review.', 'success');
            Router.navigate('three-way-match');
        }, 3000);
    },

    viewDocument(docId) {
        Router.navigate(`document-detail?id=${docId}`);
    },

    downloadDocument(docId) {
        Utils.showToast('Document download started', 'info');
    },

    switchView(view) {
        this.currentView = view;
        this.render();
    }
};
