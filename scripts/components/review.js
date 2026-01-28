/* ============================================
   DOCUAGENT - Review Queue Component
   ============================================ */

const ReviewComponent = {
    currentFilter: 'all',

    render() {
        const container = document.getElementById('pageContent');
        const queue = MockData.reviewQueue;

        container.innerHTML = `
      <div class="page-header">
        <div class="page-header-content">
          <h1 class="page-title">Review Queue</h1>
          <p class="page-subtitle">Documents requiring human review and approval</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">
            <i data-feather="filter"></i>
            Filter
          </button>
          <button class="btn btn-primary">
            <i data-feather="check-square"></i>
            Bulk Approve
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="metrics-grid" style="grid-template-columns: repeat(4, 1fr);">
        ${this.renderStatCard('Total Pending', queue.length, 'clock', 'primary')}
        ${this.renderStatCard('High Priority', queue.filter(q => q.priority === 'high').length, 'alert-circle', 'error')}
        ${this.renderStatCard('Unassigned', queue.filter(q => !q.assignee).length, 'user-x', 'warning')}
        ${this.renderStatCard('Resolved Today', 18, 'check-circle', 'success')}
      </div>

      <!-- Filter Tabs -->
      <div class="card mt-6">
        <div class="tabs">
          <button class="tab ${this.currentFilter === 'all' ? 'active' : ''}" onclick="ReviewComponent.setFilter('all')">
            All <span class="badge badge-default ml-2">${queue.length}</span>
          </button>
          <button class="tab ${this.currentFilter === 'high' ? 'active' : ''}" onclick="ReviewComponent.setFilter('high')">
            High Priority <span class="badge badge-error ml-2">${queue.filter(q => q.priority === 'high').length}</span>
          </button>
          <button class="tab ${this.currentFilter === 'unassigned' ? 'active' : ''}" onclick="ReviewComponent.setFilter('unassigned')">
            Unassigned <span class="badge badge-warning ml-2">${queue.filter(q => !q.assignee).length}</span>
          </button>
          <button class="tab ${this.currentFilter === 'mine' ? 'active' : ''}" onclick="ReviewComponent.setFilter('mine')">
            Assigned to Me <span class="badge badge-primary ml-2">${queue.filter(q => q.assignee === 'John Smith').length}</span>
          </button>
        </div>

        <div class="table-container" style="border: none; border-top: 1px solid var(--border-default);">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 40px;">
                  <input type="checkbox" class="form-checkbox">
                </th>
                <th>Document</th>
                <th>Type</th>
                <th>Reason for Review</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Age</th>
                <th style="width: 120px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderQueueItems(queue)}
            </tbody>
          </table>
        </div>
      </div>
    `;

        setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
    },

    renderStatCard(title, value, icon, variant) {
        return `
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-card-title">${title}</span>
          <div class="metric-card-icon ${variant}">
            <i data-feather="${icon}" width="20" height="20"></i>
          </div>
        </div>
        <div class="metric-card-value">${value}</div>
      </div>
    `;
    },

    renderQueueItems(queue) {
        let filtered = queue;

        switch (this.currentFilter) {
            case 'high':
                filtered = queue.filter(q => q.priority === 'high');
                break;
            case 'unassigned':
                filtered = queue.filter(q => !q.assignee);
                break;
            case 'mine':
                filtered = queue.filter(q => q.assignee === 'John Smith');
                break;
        }

        if (filtered.length === 0) {
            return `
        <tr>
          <td colspan="8" class="text-center p-8">
            <div class="empty-state">
              <i data-feather="inbox" class="empty-state-icon"></i>
              <h3 class="empty-state-title">No items in queue</h3>
              <p class="empty-state-description">All caught up! No documents require review.</p>
            </div>
          </td>
        </tr>
      `;
        }

        return filtered.map(item => {
            const priorityBadge = {
                'high': 'badge-error',
                'medium': 'badge-warning',
                'low': 'badge-default'
            };

            return `
        <tr>
          <td>
            <input type="checkbox" class="form-checkbox">
          </td>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar avatar-sm" style="background: var(--gray-200); color: var(--text-secondary);">
                <i data-feather="file" width="16" height="16"></i>
              </div>
              <div>
                <div class="font-medium">${item.documentId}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-default">${Utils.formatStatus(item.type)}</span>
          </td>
          <td>
            <span class="text-sm">${item.reason}</span>
          </td>
          <td>
            <span class="badge ${priorityBadge[item.priority]}">${Utils.formatStatus(item.priority)}</span>
          </td>
          <td>
            ${item.assignee
                    ? `<div class="flex items-center gap-2">${Utils.createAvatar(item.assignee, 'sm')} <span class="text-sm">${item.assignee}</span></div>`
                    : '<span class="text-tertiary text-sm">Unassigned</span>'
                }
          </td>
          <td>
            <span class="text-sm text-secondary">${item.age}</span>
          </td>
          <td>
            <div class="flex items-center gap-1">
              <button class="btn btn-icon-sm btn-ghost" onclick="ReviewComponent.reviewItem('${item.id}')">
                <i data-feather="eye" width="16" height="16"></i>
              </button>
              <button class="btn btn-icon-sm btn-ghost text-success" onclick="ReviewComponent.approveItem('${item.id}')">
                <i data-feather="check" width="16" height="16"></i>
              </button>
              <button class="btn btn-icon-sm btn-ghost text-error" onclick="ReviewComponent.rejectItem('${item.id}')">
                <i data-feather="x" width="16" height="16"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
        }).join('');
    },

    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    },

    reviewItem(itemId) {
        const item = MockData.reviewQueue.find(q => q.id === itemId);
        if (item) {
            if (item.type === 'claim') {
                Router.navigate(`claim-detail?id=${item.documentId}`);
            } else {
                Router.navigate(`document-detail?id=${item.documentId}`);
            }
        }
    },

    approveItem(itemId) {
        Utils.showToast('Document approved successfully', 'success');
        // In real app, would update data and re-render
    },

    rejectItem(itemId) {
        App.openModal({
            title: 'Reject Document',
            content: `
        <div class="form-group">
          <label class="form-label">Rejection Reason</label>
          <select class="form-select" id="rejectReason">
            <option value="">Select a reason...</option>
            <option value="invalid">Invalid Document</option>
            <option value="duplicate">Duplicate Submission</option>
            <option value="incomplete">Incomplete Information</option>
            <option value="mismatch">Data Mismatch</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Additional Notes</label>
          <textarea class="form-textarea" id="rejectNotes" placeholder="Provide additional details..."></textarea>
        </div>
      `,
            confirmText: 'Reject Document',
            onConfirm: () => {
                Utils.showToast('Document rejected', 'warning');
            }
        });
    }
};
