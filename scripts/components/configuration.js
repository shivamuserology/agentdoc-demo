/* ============================================
   DOCUAGENT - Polished Configuration Studio
   ============================================ */

const ConfigurationComponent = {
  currentStep: 0,
  steps: [
    { id: 'type', title: 'Document Type', subtitle: 'Name & category', icon: 'file-plus' },
    { id: 'schema', title: 'Schema Builder', subtitle: 'Define fields', icon: 'table' },
    { id: 'training', title: 'Training', subtitle: 'Sample docs', icon: 'upload' },
    { id: 'rules', title: 'Business Rules', subtitle: 'Validation', icon: 'git-branch' },
    { id: 'workflow', title: 'Workflow', subtitle: 'Pipeline', icon: 'git-merge' },
    { id: 'integrations', title: 'Integrations', subtitle: 'Connections', icon: 'link' }
  ],
  formData: {
    name: '',
    category: 'Procurement',
    template: null,
    fields: [
      { id: 'f1', name: 'document_number', label: 'Document Number', type: 'string', required: true, unique: true },
      { id: 'f2', name: 'vendor_name', label: 'Vendor Name', type: 'string', required: true, unique: false },
      { id: 'f3', name: 'date', label: 'Document Date', type: 'date', required: true, unique: false },
      { id: 'f4', name: 'total_amount', label: 'Total Amount', type: 'currency', required: true, unique: false }
    ],
    rules: [
      { id: 'r1', name: 'Amount Threshold', enabled: true, condition: 'total_amount > 10000', action: 'require_approval' },
      { id: 'r2', name: 'Vendor Check', enabled: true, condition: 'vendor_name IN approved_list', action: 'flag_exception' }
    ],
    workflowStages: ['upload', 'classify', 'extract', 'validate', 'review', 'complete']
  },

  render() {
    const container = document.getElementById('pageContent');

    container.innerHTML = `
      <div class="config-layout">
        <!-- Sidebar with Steps -->
        <div class="config-sidebar">
          <div class="config-sidebar-header">
            <h3 class="config-sidebar-title">Configuration Studio</h3>
            <p class="config-sidebar-subtitle">Create document type</p>
          </div>
          <div class="config-steps">
            ${this.steps.map((step, index) => `
              <div class="config-step ${index === this.currentStep ? 'active' : ''} ${index < this.currentStep ? 'completed' : ''}" 
                   onclick="ConfigurationComponent.goToStep(${index})">
                <div class="config-step-indicator">
                  ${index < this.currentStep
        ? '<i data-feather="check" width="14" height="14"></i>'
        : `<i data-feather="${step.icon}" width="14" height="14"></i>`
      }
                </div>
                <div class="config-step-text">
                  <div class="config-step-title">${step.title}</div>
                  <div class="config-step-subtitle">${step.subtitle}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="config-sidebar-footer">
            <button class="btn btn-ghost btn-sm w-full" onclick="Router.navigate('dashboard')">
              <i data-feather="x" width="16" height="16"></i>
              Cancel
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="config-main">
          ${this.renderCurrentStep()}
        </div>
      </div>
    `;

    setTimeout(() => feather.replace({ 'stroke-width': 2 }), 100);
  },

  renderCurrentStep() {
    const stepRenderers = {
      0: () => this.renderDocumentTypeStep(),
      1: () => this.renderSchemaStep(),
      2: () => this.renderTrainingStep(),
      3: () => this.renderRulesStep(),
      4: () => this.renderWorkflowStep(),
      5: () => this.renderIntegrationsStep()
    };
    return stepRenderers[this.currentStep]?.() || '';
  },

  // Step 1: Document Type
  renderDocumentTypeStep() {
    const templates = [
      { id: 'invoice', icon: 'file-text', name: 'Invoice', desc: 'Standard invoice template', fields: 15 },
      { id: 'po', icon: 'shopping-cart', name: 'Purchase Order', desc: 'PO with line items', fields: 12 },
      { id: 'contract', icon: 'file', name: 'Contract', desc: 'Legal agreements', fields: 10 },
      { id: 'id', icon: 'credit-card', name: 'ID Document', desc: 'Identity verification', fields: 8 },
      { id: 'medical', icon: 'heart', name: 'Medical Form', desc: 'Healthcare docs', fields: 18 },
      { id: 'custom', icon: 'plus', name: 'Custom', desc: 'Start from scratch', fields: 0 }
    ];

    return `
      <div class="config-panel">
        <div class="config-panel-header">
          <div>
            <h2 class="config-panel-title">Document Type Setup</h2>
            <p class="config-panel-desc">Define the basic information for your document type</p>
          </div>
          <span class="config-step-badge">Step 1 of 6</span>
        </div>
        
        <div class="config-panel-content">
          <div class="form-section">
            <div class="form-row">
              <div class="form-group flex-2">
                <label class="form-label">Document Type Name <span class="required">*</span></label>
                <input type="text" class="form-input form-input-lg" id="docTypeName" 
                       placeholder="e.g., Purchase Order, Invoice, Claim Form" 
                       value="${this.formData.name}" 
                       oninput="ConfigurationComponent.formData.name = this.value">
                <div class="form-hint">This name will be used to identify the document type in the system</div>
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Category</label>
                <select class="form-select form-select-lg" id="docCategory" 
                        onchange="ConfigurationComponent.formData.category = this.value">
                  <option value="Procurement" ${this.formData.category === 'Procurement' ? 'selected' : ''}>Procurement</option>
                  <option value="Finance" ${this.formData.category === 'Finance' ? 'selected' : ''}>Finance</option>
                  <option value="Healthcare" ${this.formData.category === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
                  <option value="Legal" ${this.formData.category === 'Legal' ? 'selected' : ''}>Legal</option>
                  <option value="HR" ${this.formData.category === 'HR' ? 'selected' : ''}>HR</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">Start with Template</label>
            <p class="form-hint mb-4">Choose a pre-built template or start from scratch</p>
            <div class="template-grid">
              ${templates.map(t => `
                <div class="template-card ${this.formData.template === t.id ? 'selected' : ''}" 
                     onclick="ConfigurationComponent.selectTemplate('${t.id}')">
                  <div class="template-card-icon">
                    <i data-feather="${t.icon}" width="24" height="24"></i>
                  </div>
                  <div class="template-card-name">${t.name}</div>
                  <div class="template-card-desc">${t.desc}</div>
                  ${t.fields > 0 ? `<div class="template-card-meta">${t.fields} fields</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="config-panel-footer">
          <div></div>
          <button class="btn btn-primary btn-lg" onclick="ConfigurationComponent.nextStep()">
            Continue to Schema
            <i data-feather="arrow-right" width="18" height="18"></i>
          </button>
        </div>
      </div>
    `;
  },

  // Step 2: Schema Builder
  renderSchemaStep() {
    const fieldTypes = MockData.fieldTypes;

    return `
      <div class="config-panel">
        <div class="config-panel-header">
          <div>
            <h2 class="config-panel-title">Schema Builder</h2>
            <p class="config-panel-desc">Define the fields to extract from documents</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="ConfigurationComponent.addField()">
            <i data-feather="plus" width="16" height="16"></i>
            Add Field
          </button>
        </div>
        
        <div class="config-panel-content">
          <div class="schema-builder">
            <div class="schema-header">
              <div class="schema-col-icon"></div>
              <div class="schema-col-name">Field Name</div>
              <div class="schema-col-type">Type</div>
              <div class="schema-col-props">Properties</div>
              <div class="schema-col-actions"></div>
            </div>
            
            <div class="schema-fields" id="schemaFields">
              ${this.formData.fields.map((field, index) => `
                <div class="schema-field-row" data-field-id="${field.id}">
                  <div class="schema-col-icon">
                    <div class="schema-field-handle">
                      <i data-feather="menu" width="14" height="14"></i>
                    </div>
                  </div>
                  <div class="schema-col-name">
                    <input type="text" class="schema-field-input" value="${field.label || field.name}" 
                           onblur="ConfigurationComponent.updateFieldLabel('${field.id}', this.value)">
                    <span class="schema-field-key">${field.name}</span>
                  </div>
                  <div class="schema-col-type">
                    <select class="schema-type-select" onchange="ConfigurationComponent.updateFieldType('${field.id}', this.value)">
                      ${fieldTypes.map(t => `<option value="${t.value}" ${field.type === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
                    </select>
                  </div>
                  <div class="schema-col-props">
                    <label class="schema-prop-toggle">
                      <input type="checkbox" ${field.required ? 'checked' : ''} 
                             onchange="ConfigurationComponent.updateFieldProp('${field.id}', 'required', this.checked)">
                      <span>Required</span>
                    </label>
                    <label class="schema-prop-toggle">
                      <input type="checkbox" ${field.unique ? 'checked' : ''} 
                             onchange="ConfigurationComponent.updateFieldProp('${field.id}', 'unique', this.checked)">
                      <span>Unique</span>
                    </label>
                  </div>
                  <div class="schema-col-actions">
                    <button class="btn btn-icon-sm btn-ghost" onclick="ConfigurationComponent.deleteField('${field.id}')">
                      <i data-feather="trash-2" width="14" height="14"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            ${this.formData.fields.length === 0 ? `
              <div class="schema-empty">
                <i data-feather="table" width="32" height="32"></i>
                <p>No fields defined yet</p>
                <button class="btn btn-primary btn-sm" onclick="ConfigurationComponent.addField()">
                  Add First Field
                </button>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="config-panel-footer">
          <button class="btn btn-secondary" onclick="ConfigurationComponent.prevStep()">
            <i data-feather="arrow-left" width="16" height="16"></i>
            Back
          </button>
          <button class="btn btn-primary btn-lg" onclick="ConfigurationComponent.nextStep()">
            Continue to Training
            <i data-feather="arrow-right" width="18" height="18"></i>
          </button>
        </div>
      </div>
    `;
  },

  // Step 3: Training
  renderTrainingStep() {
    const sampleProgress = Math.floor(Math.random() * 40) + 60;

    return `
      <div class="config-panel">
        <div class="config-panel-header">
          <div>
            <h2 class="config-panel-title">Training Center</h2>
            <p class="config-panel-desc">Upload sample documents to train the AI model</p>
          </div>
          <div class="training-progress-badge">
            <div class="training-progress-ring" style="--progress: ${sampleProgress}"></div>
            <span>${sampleProgress}% Ready</span>
          </div>
        </div>
        
        <div class="config-panel-content">
          <div class="training-layout">
            <!-- Sample Upload Section -->
            <div class="training-upload-section">
              <h4 class="training-section-title">Sample Documents</h4>
              <p class="training-section-desc">Upload 5-10 examples for best results</p>
              
              <div class="training-samples">
                ${[1, 2, 3, 4].map(i => `
                  <div class="training-sample ${i <= 3 ? 'annotated' : ''}">
                    <div class="training-sample-preview">
                      <i data-feather="file-text" width="24" height="24"></i>
                    </div>
                    <div class="training-sample-info">
                      <span class="training-sample-name">sample_${i}.pdf</span>
                      <span class="training-sample-status">${i <= 3 ? 'Annotated' : 'Pending'}</span>
                    </div>
                    <button class="btn btn-icon-sm btn-ghost">
                      <i data-feather="${i <= 3 ? 'check-circle' : 'edit-2'}" width="14" height="14"></i>
                    </button>
                  </div>
                `).join('')}
                
                <div class="training-sample add-sample" onclick="ConfigurationComponent.addSample()">
                  <div class="training-sample-preview">
                    <i data-feather="plus" width="24" height="24"></i>
                  </div>
                  <span class="training-sample-add-text">Add Sample</span>
                </div>
              </div>
            </div>

            <!-- Annotation Preview -->
            <div class="training-preview-section">
              <h4 class="training-section-title">Annotation Preview</h4>
              <div class="annotation-preview">
                <div class="annotation-document">
                  <div class="annotation-doc-header"></div>
                  <div class="annotation-doc-lines">
                    <div class="annotation-line"></div>
                    <div class="annotation-line short"></div>
                    <div class="annotation-line"></div>
                  </div>
                  <div class="annotation-doc-table">
                    <div class="annotation-table-row header"></div>
                    <div class="annotation-table-row"></div>
                    <div class="annotation-table-row"></div>
                  </div>
                  <!-- Annotation Boxes -->
                  <div class="annotation-box" style="top: 12%; left: 60%; width: 35%; height: 8%;" data-field="document_number">
                    <span class="annotation-label">Document #</span>
                  </div>
                  <div class="annotation-box" style="top: 25%; left: 5%; width: 40%; height: 8%;" data-field="vendor_name">
                    <span class="annotation-label">Vendor</span>
                  </div>
                  <div class="annotation-box" style="top: 85%; left: 55%; width: 30%; height: 8%;" data-field="total_amount">
                    <span class="annotation-label">Total</span>
                  </div>
                </div>
              </div>
              
              <div class="annotation-fields">
                <h5 class="annotation-fields-title">Field Mapping</h5>
                ${this.formData.fields.map((field, i) => {
      const status = i < 3 ? 'mapped' : 'unmapped';
      return `
                    <div class="annotation-field ${status}">
                      <span class="annotation-field-name">${field.label || field.name}</span>
                      <span class="annotation-field-status">${status === 'mapped' ? '✓ Mapped' : 'Not mapped'}</span>
                    </div>
                  `;
    }).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="config-panel-footer">
          <button class="btn btn-secondary" onclick="ConfigurationComponent.prevStep()">
            <i data-feather="arrow-left" width="16" height="16"></i>
            Back
          </button>
          <div class="flex gap-3">
            <button class="btn btn-secondary" onclick="ConfigurationComponent.trainModel()">
              <i data-feather="zap" width="16" height="16"></i>
              Train Model
            </button>
            <button class="btn btn-primary btn-lg" onclick="ConfigurationComponent.nextStep()">
              Continue to Rules
              <i data-feather="arrow-right" width="18" height="18"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Step 4: Business Rules
  renderRulesStep() {
    const rules = [
      { id: 'r1', name: 'Amount Threshold', enabled: true, condition: 'IF total_amount > $10,000', action: 'Require Manager Approval', type: 'approval' },
      { id: 'r2', name: 'Vendor Validation', enabled: true, condition: 'vendor_name MUST BE in approved vendors list', action: 'Route to Exception Queue', type: 'validation' },
      { id: 'r3', name: 'Date Check', enabled: false, condition: 'document_date MUST BE within 90 days', action: 'Auto-reject', type: 'validation' }
    ];

    return `
      <div class="config-panel">
        <div class="config-panel-header">
          <div>
            <h2 class="config-panel-title">Business Rules</h2>
            <p class="config-panel-desc">Define validation and routing logic</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="ConfigurationComponent.addRule()">
            <i data-feather="plus" width="16" height="16"></i>
            Add Rule
          </button>
        </div>
        
        <div class="config-panel-content">
          <div class="rules-list">
            ${rules.map(rule => `
              <div class="rule-card ${rule.enabled ? 'enabled' : 'disabled'}">
                <div class="rule-card-header">
                  <div class="rule-card-title-row">
                    <span class="rule-type-badge ${rule.type}">${rule.type}</span>
                    <span class="rule-card-name">${rule.name}</span>
                  </div>
                  <div class="rule-card-actions">
                    <label class="toggle-switch">
                      <input type="checkbox" ${rule.enabled ? 'checked' : ''}>
                      <span class="toggle-slider"></span>
                    </label>
                    <button class="btn btn-icon-sm btn-ghost">
                      <i data-feather="edit-2" width="14" height="14"></i>
                    </button>
                    <button class="btn btn-icon-sm btn-ghost">
                      <i data-feather="trash-2" width="14" height="14"></i>
                    </button>
                  </div>
                </div>
                <div class="rule-card-body">
                  <div class="rule-condition">
                    <span class="rule-keyword">IF</span>
                    <span class="rule-expression">${rule.condition.replace('IF ', '')}</span>
                  </div>
                  <div class="rule-action">
                    <span class="rule-keyword">THEN</span>
                    <span class="rule-expression">${rule.action}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="rules-templates">
            <button class="btn btn-ghost">
              <i data-feather="book-open" width="16" height="16"></i>
              Browse Rule Templates
            </button>
          </div>
        </div>

        <div class="config-panel-footer">
          <button class="btn btn-secondary" onclick="ConfigurationComponent.prevStep()">
            <i data-feather="arrow-left" width="16" height="16"></i>
            Back
          </button>
          <button class="btn btn-primary btn-lg" onclick="ConfigurationComponent.nextStep()">
            Continue to Workflow
            <i data-feather="arrow-right" width="18" height="18"></i>
          </button>
        </div>
      </div>
    `;
  },

  // Step 5: Workflow Designer
  renderWorkflowStep() {
    const stages = [
      { id: 'upload', name: 'Upload', icon: 'upload', desc: 'Document ingestion' },
      { id: 'classify', name: 'Classify', icon: 'tag', desc: 'AI classification' },
      { id: 'extract', name: 'Extract', icon: 'file-text', desc: 'Field extraction' },
      { id: 'validate', name: 'Validate', icon: 'check-square', desc: 'Rule validation' },
      { id: 'review', name: 'Review', icon: 'user-check', desc: 'Human review' },
      { id: 'complete', name: 'Complete', icon: 'check-circle', desc: 'Final output' }
    ];
    const selectedStage = 'validate';

    return `
      <div class="config-panel">
        <div class="config-panel-header">
          <div>
            <h2 class="config-panel-title">Workflow Designer</h2>
            <p class="config-panel-desc">Configure the document processing pipeline</p>
          </div>
        </div>
        
        <div class="config-panel-content">
          <!-- Workflow Visualization -->
          <div class="workflow-designer">
            <div class="workflow-pipeline">
              ${stages.map((stage, i) => `
                <div class="workflow-stage ${stage.id === selectedStage ? 'selected' : ''}" 
                     onclick="ConfigurationComponent.selectStage('${stage.id}')">
                  <div class="workflow-stage-icon">
                    <i data-feather="${stage.icon}" width="20" height="20"></i>
                  </div>
                  <div class="workflow-stage-name">${stage.name}</div>
                </div>
                ${i < stages.length - 1 ? '<div class="workflow-connector"><i data-feather="chevron-right" width="16" height="16"></i></div>' : ''}
              `).join('')}
            </div>
          </div>

          <!-- Stage Settings -->
          <div class="stage-settings">
            <div class="stage-settings-header">
              <h4 class="stage-settings-title">Stage Settings: Validate</h4>
              <span class="badge badge-primary">Auto-configured</span>
            </div>
            <div class="stage-settings-content">
              <div class="settings-grid">
                <div class="setting-item">
                  <label class="form-label">Auto-approve Threshold</label>
                  <div class="threshold-slider">
                    <input type="range" min="50" max="100" value="85" id="thresholdSlider" 
                           oninput="document.getElementById('thresholdValue').textContent = this.value + '%'">
                    <span id="thresholdValue" class="threshold-value">85%</span>
                  </div>
                  <div class="form-hint">Documents above this confidence are auto-approved</div>
                </div>
                <div class="setting-item">
                  <label class="form-label">Exception Queue</label>
                  <select class="form-select">
                    <option>Operations Team</option>
                    <option selected>Finance Team</option>
                    <option>Manager Queue</option>
                  </select>
                </div>
                <div class="setting-item">
                  <label class="form-label">SLA Duration</label>
                  <select class="form-select">
                    <option>4 hours</option>
                    <option selected>24 hours</option>
                    <option>48 hours</option>
                  </select>
                </div>
                <div class="setting-item">
                  <label class="form-label">Escalation</label>
                  <select class="form-select">
                    <option selected>48h → Manager</option>
                    <option>24h → Manager</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="config-panel-footer">
          <button class="btn btn-secondary" onclick="ConfigurationComponent.prevStep()">
            <i data-feather="arrow-left" width="16" height="16"></i>
            Back
          </button>
          <button class="btn btn-primary btn-lg" onclick="ConfigurationComponent.nextStep()">
            Continue to Integrations
            <i data-feather="arrow-right" width="18" height="18"></i>
          </button>
        </div>
      </div>
    `;
  },

  // Step 6: Integrations
  renderIntegrationsStep() {
    const imports = [
      { id: 'email', icon: 'mail', name: 'Email', connected: true },
      { id: 's3', icon: 'cloud', name: 'Amazon S3', connected: false },
      { id: 'dropbox', icon: 'folder', name: 'Dropbox', connected: false },
      { id: 'api', icon: 'code', name: 'REST API', connected: true }
    ];
    const exports = [
      { id: 'sap', icon: 'database', name: 'SAP', connected: true },
      { id: 'slack', icon: 'message-square', name: 'Slack', connected: true },
      { id: 'webhook', icon: 'link', name: 'Webhook', connected: false },
      { id: 'sheets', icon: 'grid', name: 'Google Sheets', connected: false }
    ];

    return `
      <div class="config-panel">
        <div class="config-panel-header">
          <div>
            <h2 class="config-panel-title">Integrations</h2>
            <p class="config-panel-desc">Connect import sources and export destinations</p>
          </div>
        </div>
        
        <div class="config-panel-content">
          <div class="integrations-section">
            <h4 class="integrations-title">
              <i data-feather="download" width="16" height="16"></i>
              Import Sources
            </h4>
            <div class="integrations-grid">
              ${imports.map(i => `
                <div class="integration-card ${i.connected ? 'connected' : ''}" onclick="ConfigurationComponent.configureIntegration('${i.id}')">
                  <div class="integration-icon">
                    <i data-feather="${i.icon}" width="24" height="24"></i>
                  </div>
                  <div class="integration-name">${i.name}</div>
                  <div class="integration-status">
                    ${i.connected
        ? '<i data-feather="check-circle" width="14" height="14"></i> Connected'
        : '<i data-feather="plus-circle" width="14" height="14"></i> Connect'
      }
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="integrations-section">
            <h4 class="integrations-title">
              <i data-feather="upload" width="16" height="16"></i>
              Export Destinations
            </h4>
            <div class="integrations-grid">
              ${exports.map(e => `
                <div class="integration-card ${e.connected ? 'connected' : ''}" onclick="ConfigurationComponent.configureIntegration('${e.id}')">
                  <div class="integration-icon">
                    <i data-feather="${e.icon}" width="24" height="24"></i>
                  </div>
                  <div class="integration-name">${e.name}</div>
                  <div class="integration-status">
                    ${e.connected
          ? '<i data-feather="check-circle" width="14" height="14"></i> Connected'
          : '<i data-feather="plus-circle" width="14" height="14"></i> Connect'
        }
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="config-panel-footer">
          <button class="btn btn-secondary" onclick="ConfigurationComponent.prevStep()">
            <i data-feather="arrow-left" width="16" height="16"></i>
            Back
          </button>
          <button class="btn btn-success btn-lg" onclick="ConfigurationComponent.completeSetup()">
            <i data-feather="check" width="18" height="18"></i>
            Complete Setup
          </button>
        </div>
      </div>
    `;
  },

  // Navigation
  goToStep(step) {
    if (step <= this.currentStep + 1) {
      this.currentStep = step;
      this.render();
    }
  },

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    }
  },

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  },

  // Actions
  selectTemplate(templateId) {
    this.formData.template = templateId;
    this.render();
    Utils.showToast(`Template "${templateId}" selected`, 'success');
  },

  addField() {
    App.openModal({
      title: 'Add New Field',
      content: `
        <div class="form-group">
          <label class="form-label">Field Label</label>
          <input type="text" class="form-input" id="newFieldLabel" placeholder="e.g., Invoice Number">
        </div>
        <div class="form-group">
          <label class="form-label">Field Key</label>
          <input type="text" class="form-input" id="newFieldName" placeholder="e.g., invoice_number">
          <div class="form-hint">Used in exports and API</div>
        </div>
        <div class="form-group">
          <label class="form-label">Field Type</label>
          <select class="form-select" id="newFieldType">
            ${MockData.fieldTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
          </select>
        </div>
        <div class="flex gap-4 mt-4">
          <label class="form-checkbox-group">
            <input type="checkbox" class="form-checkbox" id="newFieldRequired">
            Required
          </label>
          <label class="form-checkbox-group">
            <input type="checkbox" class="form-checkbox" id="newFieldUnique">
            Unique
          </label>
        </div>
      `,
      confirmText: 'Add Field',
      onConfirm: () => {
        const label = document.getElementById('newFieldLabel').value;
        const name = document.getElementById('newFieldName').value || label.toLowerCase().replace(/\s+/g, '_');
        const type = document.getElementById('newFieldType').value;
        const required = document.getElementById('newFieldRequired').checked;
        const unique = document.getElementById('newFieldUnique').checked;

        if (label) {
          this.formData.fields.push({
            id: 'f' + Date.now(),
            name,
            label,
            type,
            required,
            unique
          });
          this.render();
          Utils.showToast('Field added', 'success');
        }
      }
    });
  },

  updateFieldLabel(id, value) {
    const field = this.formData.fields.find(f => f.id === id);
    if (field) field.label = value;
  },

  updateFieldType(id, value) {
    const field = this.formData.fields.find(f => f.id === id);
    if (field) field.type = value;
  },

  updateFieldProp(id, prop, value) {
    const field = this.formData.fields.find(f => f.id === id);
    if (field) field[prop] = value;
  },

  deleteField(id) {
    this.formData.fields = this.formData.fields.filter(f => f.id !== id);
    this.render();
    Utils.showToast('Field removed', 'success');
  },

  addSample() {
    Utils.showToast('Upload dialog would open here', 'info');
  },

  trainModel() {
    Utils.showToast('Training model...', 'info');
    setTimeout(() => Utils.showToast('Model trained! 94.2% accuracy', 'success'), 2000);
  },

  addRule() {
    Utils.showToast('Rule builder would open here', 'info');
  },

  selectStage(stageId) {
    Utils.showToast(`Editing stage: ${stageId}`, 'info');
  },

  configureIntegration(id) {
    App.openModal({
      title: 'Configure Integration',
      content: `
        <div class="form-group">
          <label class="form-label">Connection URL</label>
          <input type="text" class="form-input" placeholder="https://api.example.com">
        </div>
        <div class="form-group">
          <label class="form-label">API Key</label>
          <input type="password" class="form-input" placeholder="Enter API key">
        </div>
      `,
      confirmText: 'Save',
      onConfirm: () => Utils.showToast('Integration configured', 'success')
    });
  },

  completeSetup() {
    Utils.showToast('🎉 Document type created successfully!', 'success');
    setTimeout(() => {
      this.currentStep = 0;
      this.formData.name = '';
      this.formData.template = null;
      Router.navigate('dashboard');
    }, 1500);
  },

  editDocType(id) {
    Router.navigate('configuration');
  }
};
