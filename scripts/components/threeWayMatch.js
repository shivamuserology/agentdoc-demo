/* ============================================
   DOCUAGENT - Three-Way Match Component
   ============================================ */

const ThreeWayMatchComponent = {
    render(params) {
        const container = document.getElementById('pageContent');
        const matchResult = MockData.threeWayMatchResult;
        const documents = MockData.procurementDocuments;

        container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <div class="flex items-center gap-3 mb-2">
            <button class="btn btn-icon btn-ghost" onclick="Router.navigate('documents')">
              <i data-feather="arrow-left" width="20" height="20"></i>
            </button>
            <h1 class="page-title">3-Way Match Analysis</h1>
            ${this.renderMatchBadge(matchResult.status)}
          </div>
          <p class="page-subtitle">PO-2024-0892 • Acme Corporation • ${Utils.formatCurrency(45230)}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary" onclick="ThreeWayMatchComponent.exportReport()">
            <i data-feather="download"></i>
            Export Report
          </button>
          <button class="btn btn-success" onclick="ThreeWayMatchComponent.approveMatch()">
            <i data-feather="check"></i>
            Approve & Process
          </button>
        </div>
      </div>

      <!-- Match Summary Cards -->
      <div class="grid-3 mb-6">
        ${this.renderDocumentSummaryCard(documents[0], 'Purchase Order')}
        ${this.renderDocumentSummaryCard(documents[1], 'Invoice')}
        ${this.renderDocumentSummaryCard(documents[2], 'Goods Receipt')}
      </div>

      <!-- Match Results -->
      <div class="grid-2 gap-6">
        <!-- Header Match -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Header Match</h3>
            <span class="badge badge-success">${matchResult.headerMatch.filter(h => h.status === 'match').length}/${matchResult.headerMatch.length} Fields Match</span>
          </div>
          <div class="card-body p-0">
            ${this.renderHeaderMatchTable(matchResult.headerMatch)}
          </div>
        </div>

        <!-- Exceptions -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Exceptions & Warnings</h3>
            <span class="badge ${matchResult.exceptions.length > 0 ? 'badge-warning' : 'badge-success'}">
              ${matchResult.exceptions.length} Issues
            </span>
          </div>
          <div class="card-body">
            ${this.renderExceptions(matchResult.exceptions)}
          </div>
        </div>
      </div>

      <!-- Line Item Match -->
      <div class="card mt-6">
        <div class="card-header">
          <h3 class="card-title">Line Item Match</h3>
          <div class="flex items-center gap-3">
            <span class="badge badge-success">${matchResult.lineItemMatch.filter(l => l.status === 'match').length} Matched</span>
            <span class="badge badge-warning">${matchResult.lineItemMatch.filter(l => l.status === 'exception').length} Exceptions</span>
          </div>
        </div>
        <div class="card-body p-0">
          ${this.renderLineItemMatchTable(matchResult.lineItemMatch)}
        </div>
      </div>

      <!-- Actions Panel -->
      <div class="card mt-6">
        <div class="card-header">
          <h3 class="card-title">Resolution Actions</h3>
        </div>
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-semibold mb-1">Invoice Variance: +$200 (0.44%)</h4>
              <p class="text-sm text-secondary">Rush Processing Fee not in original PO. Within 2% tolerance threshold.</p>
            </div>
            <div class="flex items-center gap-3">
              <button class="btn btn-secondary" onclick="ThreeWayMatchComponent.requestClarification()">
                <i data-feather="message-circle"></i>
                Request Clarification
              </button>
              <button class="btn btn-success" onclick="ThreeWayMatchComponent.approveWithNote()">
                <i data-feather="check"></i>
                Approve with Note
              </button>
              <button class="btn btn-danger" onclick="ThreeWayMatchComponent.rejectMatch()">
                <i data-feather="x"></i>
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
    },

    renderMatchBadge(status) {
        const statusConfig = {
            'full_match': { class: 'badge-success', label: 'Full Match' },
            'partial_match': { class: 'badge-warning', label: 'Partial Match' },
            'mismatch': { class: 'badge-error', label: 'Mismatch' }
        };
        const config = statusConfig[status] || statusConfig.mismatch;
        return `<span class="badge ${config.class}">${config.label}</span>`;
    },

    renderDocumentSummaryCard(doc, title) {
        const statusIcon = doc.status === 'matched' ? 'check-circle' : doc.status === 'variance' ? 'alert-triangle' : 'file-text';
        const statusColor = doc.status === 'matched' ? 'success' : doc.status === 'variance' ? 'warning' : 'primary';

        return `
      <div class="card card-hover" onclick="Router.navigate('document-detail?id=${doc.id}')">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-sm text-secondary">${title}</div>
              <div class="text-lg font-semibold">${doc.number}</div>
            </div>
            <div class="metric-card-icon ${statusColor}" style="width: 36px; height: 36px;">
              <i data-feather="${statusIcon}" width="18" height="18"></i>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold">${Utils.formatCurrency(doc.amount)}</div>
              <div class="text-sm text-secondary">${Utils.formatDate(doc.date)}</div>
            </div>
            ${Utils.createConfidenceBar(doc.confidence)}
          </div>
        </div>
      </div>
    `;
    },

    renderHeaderMatchTable(headerMatch) {
        return `
      <table class="table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Purchase Order</th>
            <th>Invoice</th>
            <th>GRN</th>
            <th style="width: 100px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${headerMatch.map(row => `
            <tr>
              <td class="font-medium">${row.field}</td>
              <td>${row.po}</td>
              <td>
                ${row.status === 'variance'
                ? `<span class="text-warning">${row.invoice}</span> <span class="text-xs text-warning">${row.variance}</span>`
                : row.invoice
            }
              </td>
              <td>${row.grn}</td>
              <td>
                ${row.status === 'match'
                ? '<span class="text-success flex items-center gap-1"><i data-feather="check-circle" width="16" height="16"></i> Match</span>'
                : '<span class="text-warning flex items-center gap-1"><i data-feather="alert-triangle" width="16" height="16"></i> Variance</span>'
            }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    },

    renderLineItemMatchTable(lineItems) {
        return `
      <table class="table">
        <thead>
          <tr>
            <th>Item</th>
            <th class="text-center">PO Qty</th>
            <th class="text-center">Invoice Qty</th>
            <th class="text-center">GRN Qty</th>
            <th class="text-right">PO Amount</th>
            <th class="text-right">Invoice Amount</th>
            <th class="text-right">GRN Amount</th>
            <th style="width: 100px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems.map(item => {
            const isException = item.status === 'exception';
            const rowClass = isException ? 'style="background-color: var(--warning-50);"' : '';

            return `
              <tr ${rowClass}>
                <td class="font-medium">${item.item}</td>
                <td class="text-center">${item.qty.po || '-'}</td>
                <td class="text-center ${isException ? 'text-warning font-medium' : ''}">${item.qty.inv || '-'}</td>
                <td class="text-center">${item.qty.grn || '-'}</td>
                <td class="text-right">${item.amount.po ? Utils.formatCurrency(item.amount.po) : '-'}</td>
                <td class="text-right ${isException ? 'text-warning font-medium' : ''}">${item.amount.inv ? Utils.formatCurrency(item.amount.inv) : '-'}</td>
                <td class="text-right">${item.amount.grn ? Utils.formatCurrency(item.amount.grn) : '-'}</td>
                <td>
                  ${item.status === 'match'
                    ? '<span class="badge badge-success">Match</span>'
                    : '<span class="badge badge-warning">Exception</span>'
                }
                </td>
              </tr>
            `;
        }).join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: var(--gray-50);">
            <td class="font-semibold">Total</td>
            <td colspan="3"></td>
            <td class="text-right font-semibold">${Utils.formatCurrency(45230)}</td>
            <td class="text-right font-semibold text-warning">${Utils.formatCurrency(45430)}</td>
            <td class="text-right font-semibold">${Utils.formatCurrency(45230)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    `;
    },

    renderExceptions(exceptions) {
        if (exceptions.length === 0) {
            return `
        <div class="text-center p-6">
          <i data-feather="check-circle" class="text-success mb-3" width="40" height="40" style="margin: 0 auto; display: block;"></i>
          <p class="font-medium">No Exceptions</p>
          <p class="text-sm text-secondary">All documents match perfectly</p>
        </div>
      `;
        }

        return exceptions.map(exc => `
      <div class="alert alert-${exc.severity === 'warning' ? 'warning' : 'error'} mb-3">
        <i data-feather="${exc.severity === 'warning' ? 'alert-triangle' : 'alert-circle'}" class="alert-icon"></i>
        <div class="alert-content">
          <div class="alert-title">${Utils.formatStatus(exc.type)}</div>
          <div class="alert-message">${exc.message}</div>
          ${exc.autoApprovable ? '<div class="text-xs mt-1 opacity-75">Eligible for auto-approval</div>' : ''}
        </div>
      </div>
    `).join('');
    },

    approveMatch() {
        Utils.showToast('3-Way Match approved! Processing payment...', 'success');
        setTimeout(() => Router.navigate('documents'), 1500);
    },

    approveWithNote() {
        App.openModal({
            title: 'Approve with Note',
            content: `
        <div class="alert alert-warning mb-4">
          <i data-feather="alert-triangle" class="alert-icon"></i>
          <div class="alert-content">
            <div class="alert-message">Approving with variance of +$200 (0.44%)</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Approval Note</label>
          <textarea class="form-textarea" id="approvalNote" placeholder="Provide justification for approving with variance...">Rush processing fee confirmed with vendor via phone. Approved for payment.</textarea>
        </div>
      `,
            confirmText: 'Approve',
            onConfirm: () => {
                Utils.showToast('Approved with note. Processing payment...', 'success');
                setTimeout(() => Router.navigate('documents'), 1500);
            }
        });
    },

    requestClarification() {
        App.openModal({
            title: 'Request Clarification',
            content: `
        <div class="form-group">
          <label class="form-label">Send Request To</label>
          <select class="form-select">
            <option value="vendor">Vendor (Acme Corporation)</option>
            <option value="internal">Internal Team</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <input type="text" class="form-input" value="Clarification needed: Invoice INV-A-78234 variance">
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-textarea">Please clarify the Rush Processing Fee of $200 that appears on invoice INV-A-78234 but was not included in the original PO-2024-0892.</textarea>
        </div>
      `,
            confirmText: 'Send Request',
            onConfirm: () => {
                Utils.showToast('Clarification request sent to vendor', 'info');
            }
        });
    },

    rejectMatch() {
        App.openModal({
            title: 'Reject Documents',
            content: `
        <div class="alert alert-error mb-4">
          <i data-feather="alert-circle" class="alert-icon"></i>
          <div class="alert-content">
            <div class="alert-message">This will reject the 3-way match and notify relevant parties.</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Rejection Reason</label>
          <select class="form-select">
            <option value="">Select a reason...</option>
            <option value="amount">Amount Mismatch</option>
            <option value="unauthorized">Unauthorized Charges</option>
            <option value="duplicate">Duplicate Invoice</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-textarea" placeholder="Provide additional details..."></textarea>
        </div>
      `,
            confirmText: 'Reject',
            onConfirm: () => {
                Utils.showToast('Documents rejected. Notification sent.', 'warning');
                setTimeout(() => Router.navigate('documents'), 1500);
            }
        });
    },

    exportReport() {
        Utils.showToast('Generating PDF report...', 'info');
        setTimeout(() => {
            Utils.showToast('Report downloaded: 3-way-match-PO-2024-0892.pdf', 'success');
        }, 1500);
    }
};
