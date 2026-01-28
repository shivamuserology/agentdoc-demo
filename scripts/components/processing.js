/* ============================================
   DOCUAGENT - Polished Processing Component
   ============================================ */

const ProcessingComponent = {
  currentStep: 'upload',
  uploadedFiles: [],
  selectedFiles: [],

  render() {
    const container = document.getElementById('pageContent');
    const useCase = App.getCurrentUseCase();

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <div class="flex items-center gap-3">
            <button class="btn btn-icon btn-ghost" onclick="Router.navigate('dashboard')">
              <i data-feather="arrow-left" width="20" height="20"></i>
            </button>
            <div>
              <h1 class="page-title">Document Processing</h1>
              <p class="page-subtitle">Upload and process documents with AI extraction</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="process-steps mb-6">
        ${this.renderSteps()}
      </div>

      <!-- Main Content -->
      <div class="process-card">
        ${this.renderCurrentStep()}
      </div>
    `;

    setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
  },

  renderSteps() {
    const steps = [
      { id: 'upload', label: 'Upload', icon: 'upload' },
      { id: 'processing', label: 'AI Processing', icon: 'cpu' },
      { id: 'results', label: 'Results', icon: 'check-square' },
      { id: 'review', label: 'Review', icon: 'user-check' }
    ];
    const currentIndex = steps.findIndex(s => s.id === this.currentStep);

    return `
      <div class="process-steps-track">
        ${steps.map((step, i) => {
      const isActive = step.id === this.currentStep;
      const isCompleted = i < currentIndex;
      return `
            <div class="process-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
              <div class="process-step-indicator">
                ${isCompleted ? '<i data-feather="check" width="16" height="16"></i>' : `<i data-feather="${step.icon}" width="16" height="16"></i>`}
              </div>
              <span class="process-step-label">${step.label}</span>
            </div>
            ${i < steps.length - 1 ? `<div class="process-step-line ${i < currentIndex ? 'completed' : ''}"></div>` : ''}
          `;
    }).join('')}
      </div>
    `;
  },

  renderCurrentStep() {
    switch (this.currentStep) {
      case 'upload': return this.renderUploadStep();
      case 'processing': return this.renderProcessingStep();
      case 'results': return this.renderResultsStep();
      case 'review': return this.renderReviewStep();
      default: return this.renderUploadStep();
    }
  },

  renderUploadStep() {
    const useCase = App.getCurrentUseCase();
    const docTypes = useCase === 'procurement'
      ? [
        { name: 'Purchase Order', icon: 'shopping-cart', color: 'primary' },
        { name: 'Invoice', icon: 'file-text', color: 'info' },
        { name: 'Goods Receipt', icon: 'package', color: 'success' }
      ]
      : [
        { name: 'Claim Form', icon: 'clipboard', color: 'primary' },
        { name: 'Medical Bill', icon: 'file-text', color: 'info' },
        { name: 'ID Document', icon: 'credit-card', color: 'success' }
      ];

    return `
      <div class="process-card-body">
        <div class="upload-section">
          <div class="upload-header">
            <h3 class="upload-title">Upload Documents</h3>
            <p class="upload-subtitle">Drop files here or click to browse. The AI will automatically classify and extract data.</p>
          </div>

          <div class="upload-dropzone" id="uploadDropzone" 
               onclick="document.getElementById('fileInput').click()"
               ondragover="event.preventDefault(); this.classList.add('dragover')"
               ondragleave="this.classList.remove('dragover')"
               ondrop="event.preventDefault(); this.classList.remove('dragover'); ProcessingComponent.handleFiles(event.dataTransfer.files)">
            <div class="upload-dropzone-icon">
              <i data-feather="upload-cloud" width="48" height="48"></i>
            </div>
            <div class="upload-dropzone-text">
              <span class="upload-dropzone-primary">Drop files here</span>
              <span class="upload-dropzone-secondary">or click to browse</span>
            </div>
            <div class="upload-dropzone-formats">
              Supports PDF, PNG, JPG, TIFF up to 25MB
            </div>
            <input type="file" id="fileInput" multiple accept=".pdf,.png,.jpg,.jpeg,.tiff" 
                   style="display: none;" onchange="ProcessingComponent.handleFiles(this.files)">
          </div>

          <div id="uploadedFilesList" class="uploaded-files-list"></div>

          <div class="upload-expected">
            <span class="upload-expected-label">Expected document types:</span>
            <div class="upload-expected-types">
              ${docTypes.map(t => `
                <div class="expected-type-badge">
                  <i data-feather="${t.icon}" width="14" height="14"></i>
                  ${t.name}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="process-card-footer">
        <button class="btn btn-secondary" onclick="Router.navigate('dashboard')">
          Cancel
        </button>
        <button class="btn btn-primary btn-lg" id="processBtn" disabled onclick="ProcessingComponent.startProcessing()">
          <i data-feather="cpu"></i>
          Start AI Processing
        </button>
      </div>
    `;
  },

  renderProcessingStep() {
    return `
      <div class="process-card-body processing-view">
        <div class="processing-animation">
          <div class="processing-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-icon">
              <i data-feather="cpu" width="32" height="32"></i>
            </div>
          </div>
          <h3 class="processing-title">AI Document Processing</h3>
          <p class="processing-subtitle">Analyzing your documents...</p>
        </div>

        <div class="processing-stages">
          <div class="processing-stage completed" id="stage-classify">
            <div class="processing-stage-icon">
              <i data-feather="check" width="16" height="16"></i>
            </div>
            <div class="processing-stage-content">
              <div class="processing-stage-title">Document Classification</div>
              <div class="processing-stage-desc">Identified 3 documents</div>
            </div>
            <span class="processing-stage-time">0.8s</span>
          </div>
          <div class="processing-stage active" id="stage-extract">
            <div class="processing-stage-icon">
              <div class="mini-spinner"></div>
            </div>
            <div class="processing-stage-content">
              <div class="processing-stage-title">Field Extraction</div>
              <div class="processing-stage-desc">Extracting data with AI...</div>
            </div>
          </div>
          <div class="processing-stage" id="stage-validate">
            <div class="processing-stage-icon">
              <span class="processing-stage-num">3</span>
            </div>
            <div class="processing-stage-content">
              <div class="processing-stage-title">Validation & Rules</div>
              <div class="processing-stage-desc">Pending</div>
            </div>
          </div>
          <div class="processing-stage" id="stage-match">
            <div class="processing-stage-icon">
              <span class="processing-stage-num">4</span>
            </div>
            <div class="processing-stage-content">
              <div class="processing-stage-title">3-Way Match</div>
              <div class="processing-stage-desc">Pending</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderResultsStep() {
    const docs = MockData.procurementDocuments;
    const matchResult = MockData.threeWayMatchResult;

    return `
      <div class="process-card-header">
        <div>
          <h3 class="process-card-title">Extraction Results</h3>
          <p class="process-card-subtitle">AI processing complete • 3 documents analyzed</p>
        </div>
        <div class="result-summary-badges">
          <span class="badge badge-success"><i data-feather="check" width="12" height="12"></i> 94% Avg Confidence</span>
          <span class="badge badge-warning"><i data-feather="alert-triangle" width="12" height="12"></i> 1 Exception</span>
        </div>
      </div>
      <div class="process-card-body">
        <!-- Document Cards -->
        <div class="result-docs-grid">
          ${docs.map(doc => `
            <div class="result-doc-card ${doc.status}">
              <div class="result-doc-header">
                <span class="result-doc-type">${doc.typeLabel}</span>
                <div class="result-doc-confidence">
                  <div class="confidence-ring ${doc.confidence >= 90 ? 'high' : doc.confidence >= 75 ? 'medium' : 'low'}">
                    <span>${doc.confidence}%</span>
                  </div>
                </div>
              </div>
              <div class="result-doc-body">
                <div class="result-doc-number">${doc.number}</div>
                <div class="result-doc-vendor">${doc.vendor}</div>
                <div class="result-doc-amount">${Utils.formatCurrency(doc.amount)}</div>
              </div>
              <div class="result-doc-footer">
                <span class="badge ${doc.status === 'matched' ? 'badge-success' : 'badge-warning'}">
                  ${doc.status === 'matched' ? 'Matched' : 'Variance'}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Match Summary Alert -->
        <div class="match-summary ${matchResult.exceptions.length > 0 ? 'has-exception' : 'all-clear'}">
          <div class="match-summary-icon">
            <i data-feather="${matchResult.exceptions.length > 0 ? 'alert-triangle' : 'check-circle'}" width="24" height="24"></i>
          </div>
          <div class="match-summary-content">
            <div class="match-summary-title">
              ${matchResult.exceptions.length > 0 ? '3-Way Match: Exception Detected' : '3-Way Match: Complete'}
            </div>
            <div class="match-summary-desc">
              ${matchResult.exceptions.length > 0
        ? `${matchResult.exceptions[0].message}`
        : 'All documents match within tolerance. Ready for approval.'
      }
            </div>
          </div>
        </div>

        <!-- Match Details Table -->
        <div class="match-details-section">
          <h4 class="match-details-title">Field Comparison</h4>
          <div class="match-table-wrapper">
            <table class="match-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Purchase Order</th>
                  <th>Invoice</th>
                  <th>GRN</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${matchResult.headerMatch.map(row => `
                  <tr class="${row.status === 'variance' ? 'has-variance' : ''}">
                    <td class="field-name">${row.field}</td>
                    <td>${row.po}</td>
                    <td>
                      ${row.invoice}
                      ${row.variance ? `<span class="variance-badge">${row.variance}</span>` : ''}
                    </td>
                    <td>${row.grn}</td>
                    <td>
                      ${row.status === 'match'
          ? '<span class="status-icon match"><i data-feather="check-circle" width="16" height="16"></i></span>'
          : '<span class="status-icon variance"><i data-feather="alert-circle" width="16" height="16"></i></span>'
        }
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="process-card-footer">
        <button class="btn btn-secondary" onclick="ProcessingComponent.reset()">
          <i data-feather="refresh-cw"></i>
          Start Over
        </button>
        <button class="btn btn-primary btn-lg" onclick="ProcessingComponent.goToReview()">
          Continue to Review
          <i data-feather="arrow-right"></i>
        </button>
      </div>
    `;
  },

  renderReviewStep() {
    const matchResult = MockData.threeWayMatchResult;
    const hasExceptions = matchResult.exceptions.length > 0;

    return `
      <div class="process-card-header">
        <div>
          <h3 class="process-card-title">Human-in-the-Loop Review</h3>
          <p class="process-card-subtitle">Final approval required before processing</p>
        </div>
        <span class="badge ${hasExceptions ? 'badge-warning' : 'badge-success'} badge-lg">
          ${hasExceptions ? 'Decision Required' : 'Ready to Approve'}
        </span>
      </div>
      <div class="process-card-body">
        <div class="review-decision">
          <div class="review-decision-icon ${hasExceptions ? 'warning' : 'success'}">
            <i data-feather="${hasExceptions ? 'alert-triangle' : 'check-circle'}" width="48" height="48"></i>
          </div>
          <h3 class="review-decision-title">
            ${hasExceptions ? 'Exception Requires Your Decision' : 'All Validations Passed'}
          </h3>
          <p class="review-decision-desc">
            ${hasExceptions
        ? 'The AI detected a variance that exceeds configured thresholds. Review the details and decide how to proceed.'
        : 'Documents match within tolerance and all business rules passed. Ready for final approval.'
      }
          </p>
        </div>

        ${hasExceptions ? `
          <div class="exception-details">
            <h4 class="exception-details-title">Exception Details</h4>
            ${matchResult.exceptions.map((exc, i) => `
              <div class="exception-item">
                <div class="exception-item-icon">
                  <i data-feather="alert-triangle" width="18" height="18"></i>
                </div>
                <div class="exception-item-content">
                  <div class="exception-item-type">${Utils.formatStatus(exc.type)}</div>
                  <div class="exception-item-message">${exc.message}</div>
                </div>
                <span class="badge badge-${exc.severity}">${exc.severity}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="review-actions">
          <button class="review-action-btn reject" onclick="ProcessingComponent.reject()">
            <i data-feather="x-circle" width="24" height="24"></i>
            <span>Reject</span>
          </button>
          <button class="review-action-btn escalate" onclick="ProcessingComponent.requestInfo()">
            <i data-feather="message-circle" width="24" height="24"></i>
            <span>Request Info</span>
          </button>
          <button class="review-action-btn approve" onclick="ProcessingComponent.approve()">
            <i data-feather="check-circle" width="24" height="24"></i>
            <span>Approve</span>
          </button>
        </div>
      </div>
    `;
  },

  handleFiles(files) {
    this.uploadedFiles = Array.from(files);
    const container = document.getElementById('uploadedFilesList');

    if (this.uploadedFiles.length > 0) {
      container.innerHTML = `
        <div class="uploaded-files-header">
          <span>${this.uploadedFiles.length} file(s) ready</span>
          <button class="btn btn-ghost btn-sm" onclick="ProcessingComponent.clearFiles()">Clear all</button>
        </div>
        ${this.uploadedFiles.map((f, i) => `
          <div class="uploaded-file-item">
            <div class="uploaded-file-icon">
              <i data-feather="file" width="20" height="20"></i>
            </div>
            <div class="uploaded-file-info">
              <div class="uploaded-file-name">${f.name}</div>
              <div class="uploaded-file-size">${Utils.formatFileSize(f.size)}</div>
            </div>
            <span class="badge badge-success">Ready</span>
            <button class="btn btn-icon-sm btn-ghost" onclick="ProcessingComponent.removeFile(${i})">
              <i data-feather="x" width="14" height="14"></i>
            </button>
          </div>
        `).join('')}
      `;
      document.getElementById('processBtn').disabled = false;
      feather.replace({ 'stroke-width': 2 });
    }
  },

  clearFiles() {
    this.uploadedFiles = [];
    document.getElementById('uploadedFilesList').innerHTML = '';
    document.getElementById('processBtn').disabled = true;
  },

  removeFile(index) {
    this.uploadedFiles.splice(index, 1);
    if (this.uploadedFiles.length === 0) {
      this.clearFiles();
    } else {
      this.handleFiles(this.uploadedFiles);
    }
  },

  startProcessing() {
    this.currentStep = 'processing';
    this.render();

    // Animate processing stages
    const stages = ['extract', 'validate', 'match'];
    let stageIndex = 0;

    const advanceStage = () => {
      if (stageIndex < stages.length) {
        const prevStage = stageIndex === 0 ? 'classify' : stages[stageIndex - 1];
        const currStage = stages[stageIndex];

        // Complete previous
        const prevEl = document.getElementById(`stage-${prevStage}`);
        if (prevEl) {
          prevEl.classList.remove('active');
          prevEl.classList.add('completed');
          const icon = prevEl.querySelector('.processing-stage-icon');
          icon.innerHTML = '<i data-feather="check" width="16" height="16"></i>';
        }

        // Activate current
        const currEl = document.getElementById(`stage-${currStage}`);
        if (currEl) {
          currEl.classList.add('active');
          const icon = currEl.querySelector('.processing-stage-icon');
          icon.innerHTML = '<div class="mini-spinner"></div>';
          const desc = currEl.querySelector('.processing-stage-desc');
          desc.textContent = 'Processing...';
        }

        feather.replace({ 'stroke-width': 2 });
        stageIndex++;
        setTimeout(advanceStage, 1000);
      } else {
        // All done
        setTimeout(() => {
          this.currentStep = 'results';
          this.render();
        }, 500);
      }
    };

    setTimeout(advanceStage, 1200);
  },

  goToReview() {
    this.currentStep = 'review';
    this.render();
  },

  approve() {
    Utils.showToast('Documents approved and sent for payment processing', 'success');
    setTimeout(() => {
      this.reset();
      Router.navigate('dashboard');
    }, 1500);
  },

  reject() {
    Utils.showToast('Documents rejected and returned to vendor', 'warning');
    setTimeout(() => {
      this.reset();
      Router.navigate('dashboard');
    }, 1500);
  },

  requestInfo() {
    App.openModal({
      title: 'Request Additional Information',
      content: `
        <div class="form-group">
          <label class="form-label">Recipient</label>
          <input type="text" class="form-input" value="vendor@acme.com" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-textarea" rows="4" placeholder="Please clarify the Rush Processing Fee of $200 that was not included in the original PO..."></textarea>
        </div>
      `,
      confirmText: 'Send Request',
      onConfirm: () => {
        Utils.showToast('Information request sent to vendor', 'success');
      }
    });
  },

  reset() {
    this.currentStep = 'upload';
    this.uploadedFiles = [];
    this.render();
  }
};

// Add formatFileSize to Utils if not exists
if (typeof Utils !== 'undefined' && !Utils.formatFileSize) {
  Utils.formatFileSize = function (bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
}
