/* ============================================
   DOCUAGENT - Claims Processing Component
   ============================================ */

const ClaimsComponent = {
    render() {
        const container = document.getElementById('pageContent');
        const claims = MockData.claimsDocuments;

        container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <h1 class="page-title">Claims Processing</h1>
          <p class="page-subtitle">Healthcare claim submissions and adjudication</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">
            <i data-feather="filter"></i>
            Filter
          </button>
          <button class="btn btn-primary" onclick="DocumentsComponent.showUploadModal()">
            <i data-feather="plus"></i>
            New Claim
          </button>
        </div>
      </div>

      <!-- Claims Overview Cards -->
      <div class="metrics-grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-card-title">Pending Claims</span>
            <div class="metric-card-icon primary"><i data-feather="clock" width="20" height="20"></i></div>
          </div>
          <div class="metric-card-value">24</div>
        </div>
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-card-title">In Review</span>
            <div class="metric-card-icon warning"><i data-feather="eye" width="20" height="20"></i></div>
          </div>
          <div class="metric-card-value">8</div>
        </div>
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-card-title">Approved Today</span>
            <div class="metric-card-icon success"><i data-feather="check-circle" width="20" height="20"></i></div>
          </div>
          <div class="metric-card-value">15</div>
        </div>
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-card-title">Total Value</span>
            <div class="metric-card-icon primary"><i data-feather="dollar-sign" width="20" height="20"></i></div>
          </div>
          <div class="metric-card-value">$47.2K</div>
        </div>
      </div>

      <!-- Claims List -->
      <div class="card mt-6">
        <div class="card-header">
          <h3 class="card-title">Active Claims</h3>
          <div class="tabs" style="border: none; padding: 0; gap: var(--space-2);">
            <button class="pill active">All Claims</button>
            <button class="pill">Pending</button>
            <button class="pill">In Review</button>
            <button class="pill">Exceptions</button>
          </div>
        </div>
        <div class="card-body p-0">
          ${claims.map(claim => this.renderClaimCard(claim)).join('')}
        </div>
      </div>
    `;

        setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
    },

    renderClaimCard(claim) {
        const statusConfig = {
            'in_review': { icon: 'eye', color: 'warning', label: 'In Review' },
            'exception': { icon: 'alert-triangle', color: 'error', label: 'Exception' },
            'approved': { icon: 'check-circle', color: 'success', label: 'Approved' },
            'pending': { icon: 'clock', color: 'primary', label: 'Pending' }
        };
        const status = statusConfig[claim.status] || statusConfig.pending;

        return `
      <div class="document-card" style="border-radius: 0; border-left: none; border-right: none; border-top: none;" onclick="Router.navigate('claim-detail?id=${claim.id}')">
        <div class="document-card-content" style="padding: var(--space-5);">
          <div class="document-card-header mb-4">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <span class="text-lg font-semibold">${claim.claimNumber}</span>
                <span class="badge badge-${status.color}">${status.label}</span>
              </div>
              <div class="text-sm text-secondary">${claim.claimant} • Policy: ${claim.policyNumber}</div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold">${Utils.formatCurrency(claim.claimAmount)}</div>
              <div class="text-sm text-secondary">${claim.procedure}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-6">
            <!-- Documents Status -->
            <div class="flex items-center gap-3">
              ${claim.documents.map(doc => `
                <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <span class="status-dot ${doc.status === 'verified' || doc.status === 'extracted' ? 'success' : 'warning'}"></span>
                  <span class="text-xs font-medium">${doc.typeLabel}</span>
                  <span class="text-xs text-secondary">${doc.confidence}%</span>
                </div>
              `).join('')}
            </div>
            
            <!-- Validation Preview -->
            <div class="flex items-center gap-2 ml-auto">
              <span class="text-xs text-success flex items-center gap-1">
                <i data-feather="check" width="12" height="12"></i>
                ${claim.validationResults.filter(v => v.status === 'passed').length} Passed
              </span>
              ${claim.validationResults.filter(v => v.status === 'flagged').length > 0 ? `
                <span class="text-xs text-warning flex items-center gap-1">
                  <i data-feather="alert-triangle" width="12" height="12"></i>
                  ${claim.validationResults.filter(v => v.status === 'flagged').length} Flagged
                </span>
              ` : ''}
              ${claim.validationResults.filter(v => v.status === 'failed').length > 0 ? `
                <span class="text-xs text-error flex items-center gap-1">
                  <i data-feather="x" width="12" height="12"></i>
                  ${claim.validationResults.filter(v => v.status === 'failed').length} Failed
                </span>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    },

    renderDetail(params) {
        const container = document.getElementById('pageContent');
        const claim = MockData.claimsDocuments.find(c => c.id === params.id);

        if (!claim) {
            container.innerHTML = `
        <div class="empty-state">
          <i data-feather="file-x" class="empty-state-icon"></i>
          <h3 class="empty-state-title">Claim Not Found</h3>
          <button class="btn btn-primary" onclick="App.switchUseCase('claims'); ClaimsComponent.render();">Back to Claims</button>
        </div>
      `;
            return;
        }

        const statusConfig = {
            'in_review': { color: 'warning', label: 'In Review' },
            'exception': { color: 'error', label: 'Exception' },
            'approved': { color: 'success', label: 'Approved' }
        };
        const status = statusConfig[claim.status] || { color: 'primary', label: claim.status };

        container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <div class="flex items-center gap-3 mb-2">
            <button class="btn btn-icon btn-ghost" onclick="App.switchUseCase('claims'); ClaimsComponent.render();">
              <i data-feather="arrow-left" width="20" height="20"></i>
            </button>
            <h1 class="page-title">${claim.claimNumber}</h1>
            <span class="badge badge-${status.color}">${status.label}</span>
          </div>
          <p class="page-subtitle">${claim.claimant} • ${claim.procedure} • ${claim.provider}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">
            <i data-feather="message-circle"></i>
            Request Info
          </button>
          <button class="btn btn-success" onclick="ClaimsComponent.approveClaim('${claim.id}')">
            <i data-feather="check"></i>
            Approve Claim
          </button>
        </div>
      </div>

      <div class="grid-3 gap-6">
        <!-- Claim Summary -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Claim Summary</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div class="flex justify-between"><span class="text-secondary">Claimant</span><span class="font-medium">${claim.claimant}</span></div>
              <div class="flex justify-between"><span class="text-secondary">Policy #</span><span class="font-medium">${claim.policyNumber}</span></div>
              <div class="flex justify-between"><span class="text-secondary">Date of Service</span><span class="font-medium">${Utils.formatDate(claim.dateOfService)}</span></div>
              <div class="flex justify-between"><span class="text-secondary">Provider</span><span class="font-medium">${claim.provider}</span></div>
              <div class="flex justify-between"><span class="text-secondary">Procedure</span><span class="font-medium">${claim.procedure}</span></div>
              <div class="divider"></div>
              <div class="flex justify-between"><span class="text-secondary font-medium">Claim Amount</span><span class="text-xl font-bold">${Utils.formatCurrency(claim.claimAmount)}</span></div>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Documents</h3>
            <span class="badge badge-success">${claim.documents.filter(d => d.status === 'verified' || d.status === 'extracted').length}/${claim.documents.length}</span>
          </div>
          <div class="card-body">
            <div class="flex flex-col gap-3">
              ${claim.documents.map(doc => `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="status-indicator">
                    <span class="status-dot ${doc.status === 'verified' || doc.status === 'extracted' ? 'success' : 'warning'}"></span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-sm">${doc.typeLabel}</div>
                    <div class="text-xs text-secondary">${doc.fileName || 'Document'}</div>
                  </div>
                  ${Utils.createConfidenceBar(doc.confidence)}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Validation Results -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Validation</h3>
          </div>
          <div class="card-body">
            <div class="flex flex-col gap-2">
              ${claim.validationResults.map(result => {
            const iconMap = { passed: 'check-circle', flagged: 'alert-triangle', failed: 'x-circle' };
            const colorMap = { passed: 'success', flagged: 'warning', failed: 'error' };
            return `
                  <div class="flex items-start gap-3 p-2">
                    <i data-feather="${iconMap[result.status]}" width="18" height="18" class="text-${colorMap[result.status]}" style="flex-shrink: 0; margin-top: 2px;"></i>
                    <div>
                      <div class="font-medium text-sm">${result.rule}</div>
                      <div class="text-xs text-secondary">${result.message}</div>
                    </div>
                  </div>
                `;
        }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Extracted Data -->
      <div class="card mt-6">
        <div class="card-header">
          <h3 class="card-title">Extracted Data</h3>
        </div>
        <div class="card-body">
          <div class="grid-3 gap-6">
            ${claim.documents.filter(d => d.extractedFields).map(doc => `
              <div>
                <h4 class="font-semibold mb-3">${doc.typeLabel}</h4>
                <div class="extraction-list" style="padding: 0;">
                  ${doc.extractedFields.map(field => `
                    <div class="extraction-item">
                      <div class="extraction-item-status ${field.status}"></div>
                      <div class="extraction-item-content">
                        <div class="extraction-item-label">${field.name}</div>
                        <div class="extraction-item-value">${field.value}</div>
                      </div>
                      <div class="extraction-item-confidence" style="width: 60px;">
                        <span class="text-xs ${field.confidence >= 90 ? 'text-success' : field.confidence >= 70 ? 'text-warning' : 'text-error'}">${field.confidence}%</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

        setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
    },

    approveClaim(claimId) {
        Utils.showToast('Claim approved! Payment processing initiated.', 'success');
        setTimeout(() => {
            App.switchUseCase('claims');
            this.render();
        }, 1500);
    }
};
