/* ============================================
   DOCUAGENT - Mock Data
   All simulated data for the demo
   ============================================ */

const MockData = {
    // Current user
    currentUser: {
        id: 'user-001',
        name: 'John Smith',
        email: 'john.smith@company.com',
        role: 'Admin',
        avatar: 'JS'
    },

    // Dashboard metrics
    dashboardMetrics: {
        documentsProcessed: { value: 1247, change: 12.5, trend: 'up' },
        accuracyRate: { value: 94.2, change: 2.1, trend: 'up' },
        avgProcessingTime: { value: '2.3 min', change: -15.3, trend: 'down' },
        exceptionsRate: { value: 8.4, change: -3.2, trend: 'down' },
        pendingReviews: { value: 12, change: 0, trend: 'neutral' },
        slaCompliance: { value: 96.8, change: 1.5, trend: 'up' }
    },

    // Chart data for processing volume
    processingVolumeData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Documents Processed',
            data: [145, 189, 176, 201, 198, 87, 124],
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },

    // Document type distribution
    documentTypeDistribution: {
        labels: ['Purchase Orders', 'Invoices', 'GRN', 'Claim Forms', 'Medical Bills', 'ID Documents'],
        datasets: [{
            data: [28, 35, 20, 8, 6, 3],
            backgroundColor: [
                '#6366F1',
                '#8B5CF6',
                '#A855F7',
                '#10B981',
                '#14B8A6',
                '#06B6D4'
            ]
        }]
    },

    // Exception breakdown
    exceptionBreakdown: {
        labels: ['Low Confidence', 'Validation Failed', 'Missing Fields', 'Duplicate', 'Amount Mismatch'],
        datasets: [{
            label: 'Exceptions',
            data: [24, 18, 12, 8, 15],
            backgroundColor: '#EF4444'
        }]
    },

    // Procurement Documents (3-Way Match)
    procurementDocuments: [
        {
            id: 'doc-001',
            type: 'purchase_order',
            typeLabel: 'Purchase Order',
            number: 'PO-2024-0892',
            vendor: 'Acme Corporation',
            date: '2024-01-15',
            amount: 45230.00,
            currency: 'USD',
            status: 'matched',
            confidence: 96,
            uploadedAt: '2024-01-20T10:30:00Z',
            processedAt: '2024-01-20T10:32:15Z',
            lineItems: [
                { description: 'Widget A - Industrial Grade', quantity: 100, unitPrice: 250.00, total: 25000.00 },
                { description: 'Widget B - Premium', quantity: 50, unitPrice: 380.00, total: 19000.00 },
                { description: 'Shipping & Handling', quantity: 1, unitPrice: 1230.00, total: 1230.00 }
            ],
            extractedFields: [
                { name: 'PO Number', value: 'PO-2024-0892', confidence: 99, status: 'verified' },
                { name: 'Vendor Name', value: 'Acme Corporation', confidence: 97, status: 'verified' },
                { name: 'Order Date', value: '2024-01-15', confidence: 95, status: 'verified' },
                { name: 'Total Amount', value: '$45,230.00', confidence: 94, status: 'verified' },
                { name: 'Payment Terms', value: 'Net 30', confidence: 88, status: 'review' }
            ]
        },
        {
            id: 'doc-002',
            type: 'invoice',
            typeLabel: 'Invoice',
            number: 'INV-A-78234',
            vendor: 'Acme Corporation',
            date: '2024-01-18',
            amount: 45430.00,
            currency: 'USD',
            status: 'variance',
            confidence: 94,
            relatedPO: 'PO-2024-0892',
            uploadedAt: '2024-01-20T10:31:00Z',
            processedAt: '2024-01-20T10:33:45Z',
            lineItems: [
                { description: 'Widget A - Industrial Grade', quantity: 100, unitPrice: 250.00, total: 25000.00 },
                { description: 'Widget B - Premium', quantity: 50, unitPrice: 380.00, total: 19000.00 },
                { description: 'Shipping & Handling', quantity: 1, unitPrice: 1230.00, total: 1230.00 },
                { description: 'Rush Processing Fee', quantity: 1, unitPrice: 200.00, total: 200.00 }
            ],
            extractedFields: [
                { name: 'Invoice Number', value: 'INV-A-78234', confidence: 98, status: 'verified' },
                { name: 'PO Reference', value: 'PO-2024-0892', confidence: 96, status: 'verified' },
                { name: 'Vendor Name', value: 'Acme Corporation', confidence: 97, status: 'verified' },
                { name: 'Invoice Date', value: '2024-01-18', confidence: 94, status: 'verified' },
                { name: 'Total Amount', value: '$45,430.00', confidence: 92, status: 'variance' },
                { name: 'Due Date', value: '2024-02-17', confidence: 89, status: 'review' }
            ]
        },
        {
            id: 'doc-003',
            type: 'grn',
            typeLabel: 'Goods Receipt Note',
            number: 'GRN-2024-4521',
            vendor: 'Acme Corporation',
            date: '2024-01-17',
            amount: 45230.00,
            currency: 'USD',
            status: 'matched',
            confidence: 91,
            relatedPO: 'PO-2024-0892',
            uploadedAt: '2024-01-20T10:31:30Z',
            processedAt: '2024-01-20T10:34:00Z',
            lineItems: [
                { description: 'Widget A - Industrial Grade', quantity: 100, unitPrice: 250.00, total: 25000.00, received: 100 },
                { description: 'Widget B - Premium', quantity: 50, unitPrice: 380.00, total: 19000.00, received: 50 },
                { description: 'Shipping & Handling', quantity: 1, unitPrice: 1230.00, total: 1230.00, received: 1 }
            ],
            extractedFields: [
                { name: 'GRN Number', value: 'GRN-2024-4521', confidence: 97, status: 'verified' },
                { name: 'PO Reference', value: 'PO-2024-0892', confidence: 94, status: 'verified' },
                { name: 'Receipt Date', value: '2024-01-17', confidence: 92, status: 'verified' },
                { name: 'Received By', value: 'M. Johnson', confidence: 85, status: 'review' }
            ]
        }
    ],

    // 3-Way Match Result
    threeWayMatchResult: {
        status: 'partial_match',
        matchPercentage: 85,
        headerMatch: [
            { field: 'Vendor', po: 'Acme Corporation', invoice: 'Acme Corporation', grn: 'Acme Corporation', status: 'match' },
            { field: 'PO Number', po: 'PO-2024-0892', invoice: 'PO-2024-0892', grn: 'PO-2024-0892', status: 'match' },
            { field: 'Total Amount', po: '$45,230.00', invoice: '$45,430.00', grn: '$45,230.00', status: 'variance', variance: '+$200 (0.44%)' }
        ],
        lineItemMatch: [
            { item: 'Widget A - Industrial Grade', qty: { po: 100, inv: 100, grn: 100 }, amount: { po: 25000, inv: 25000, grn: 25000 }, status: 'match' },
            { item: 'Widget B - Premium', qty: { po: 50, inv: 50, grn: 50 }, amount: { po: 19000, inv: 19000, grn: 19000 }, status: 'match' },
            { item: 'Shipping & Handling', qty: { po: 1, inv: 1, grn: 1 }, amount: { po: 1230, inv: 1230, grn: 1230 }, status: 'match' },
            { item: 'Rush Processing Fee', qty: { po: 0, inv: 1, grn: 0 }, amount: { po: 0, inv: 200, grn: 0 }, status: 'exception' }
        ],
        exceptions: [
            { type: 'amount_variance', severity: 'warning', message: 'Invoice total exceeds PO by $200 (0.44%) - within 2% tolerance', autoApprovable: true },
            { type: 'line_item_mismatch', severity: 'warning', message: 'Rush Processing Fee ($200) not in PO - requires approval' }
        ]
    },

    // Claims Processing Documents
    claimsDocuments: [
        {
            id: 'claim-001',
            claimNumber: 'CLM-2024-89234',
            status: 'in_review',
            claimant: 'Sarah Johnson',
            policyNumber: 'POL-2024-45678',
            claimAmount: 2450.00,
            dateOfService: '2024-01-15',
            procedure: 'Outpatient Surgery',
            provider: 'Metro General Hospital',
            createdAt: '2024-01-18T14:30:00Z',
            documents: [
                {
                    id: 'claim-doc-001',
                    type: 'claim_form',
                    typeLabel: 'Claim Form',
                    fileName: 'claim_form_89234.pdf',
                    status: 'extracted',
                    confidence: 96,
                    extractedFields: [
                        { name: 'Claimant Name', value: 'Sarah Johnson', confidence: 98, status: 'verified' },
                        { name: 'Policy Number', value: 'POL-2024-45678', confidence: 97, status: 'verified' },
                        { name: 'Date of Service', value: '2024-01-15', confidence: 95, status: 'verified' },
                        { name: 'Claim Amount', value: '$2,450.00', confidence: 92, status: 'flagged' },
                        { name: 'Procedure Code', value: 'CPT-99213', confidence: 89, status: 'review' }
                    ]
                },
                {
                    id: 'claim-doc-002',
                    type: 'medical_bill',
                    typeLabel: 'Medical Bill',
                    fileName: 'metro_general_bill.pdf',
                    status: 'extracted',
                    confidence: 94,
                    extractedFields: [
                        { name: 'Provider Name', value: 'Metro General Hospital', confidence: 97, status: 'verified' },
                        { name: 'Patient Name', value: 'Sarah Johnson', confidence: 96, status: 'verified' },
                        { name: 'Service Date', value: '2024-01-15', confidence: 94, status: 'verified' },
                        { name: 'Total Charges', value: '$2,450.00', confidence: 91, status: 'review' }
                    ]
                },
                {
                    id: 'claim-doc-003',
                    type: 'id_document',
                    typeLabel: 'ID Document',
                    fileName: 'id_card.jpg',
                    status: 'verified',
                    confidence: 99,
                    extractedFields: [
                        { name: 'Full Name', value: 'Sarah M. Johnson', confidence: 99, status: 'verified' },
                        { name: 'Date of Birth', value: '1985-06-22', confidence: 98, status: 'verified' },
                        { name: 'ID Number', value: 'DL-892345678', confidence: 97, status: 'verified' }
                    ]
                }
            ],
            validationResults: [
                { rule: 'Policy Active', status: 'passed', message: 'Policy is active and in good standing' },
                { rule: 'Coverage Period', status: 'passed', message: 'Service date within coverage period' },
                { rule: 'Claim Amount', status: 'flagged', message: 'Amount exceeds typical range for procedure - flagged for review' },
                { rule: 'Duplicate Check', status: 'passed', message: 'No duplicate claims found' },
                { rule: 'Provider Network', status: 'passed', message: 'Provider is in-network' }
            ]
        },
        {
            id: 'claim-002',
            claimNumber: 'CLM-2024-89235',
            status: 'exception',
            claimant: 'Michael Chen',
            policyNumber: 'POL-2024-78901',
            claimAmount: 5200.00,
            dateOfService: '2024-01-12',
            procedure: 'Emergency Room Visit',
            provider: 'City Medical Center',
            createdAt: '2024-01-17T09:15:00Z',
            documents: [
                {
                    id: 'claim-doc-004',
                    type: 'claim_form',
                    typeLabel: 'Claim Form',
                    fileName: 'claim_form_89235.pdf',
                    status: 'extracted',
                    confidence: 88
                },
                {
                    id: 'claim-doc-005',
                    type: 'medical_bill',
                    typeLabel: 'Medical Bill',
                    fileName: 'city_medical_bill.pdf',
                    status: 'extracted',
                    confidence: 85
                }
            ],
            validationResults: [
                { rule: 'Policy Active', status: 'passed', message: 'Policy is active' },
                { rule: 'Coverage Period', status: 'passed', message: 'Within coverage period' },
                { rule: 'Claim Amount', status: 'failed', message: 'Amount exceeds policy limit of $5,000' },
                { rule: 'Required Documents', status: 'failed', message: 'ID Document missing' }
            ]
        }
    ],

    // Review Queue Items
    reviewQueue: [
        { id: 'rev-001', documentId: 'doc-002', type: 'invoice', reason: 'Amount variance detected', priority: 'medium', assignee: 'John Smith', age: '2 hours' },
        { id: 'rev-002', documentId: 'claim-001', type: 'claim', reason: 'Claim amount flagged', priority: 'high', assignee: 'Jane Doe', age: '4 hours' },
        { id: 'rev-003', documentId: 'claim-002', type: 'claim', reason: 'Missing required documents', priority: 'high', assignee: null, age: '1 day' },
        { id: 'rev-004', documentId: 'doc-005', type: 'purchase_order', reason: 'Low confidence extraction', priority: 'low', assignee: 'John Smith', age: '30 min' },
        { id: 'rev-005', documentId: 'doc-006', type: 'invoice', reason: 'Duplicate detection', priority: 'medium', assignee: null, age: '3 hours' }
    ],

    // Audit Trail
    auditTrail: [
        { id: 'audit-001', timestamp: '2024-01-20T11:15:00Z', action: 'Document Approved', user: 'Mike Chen', details: 'Invoice INV-A-78234 approved for payment', documentId: 'doc-002' },
        { id: 'audit-002', timestamp: '2024-01-20T10:52:00Z', action: 'Field Corrected', user: 'Sarah Jones', details: 'Amount corrected: $45,230 → $45,430', documentId: 'doc-002' },
        { id: 'audit-003', timestamp: '2024-01-20T10:46:00Z', action: 'Validation Warning', user: 'System', details: '2 validation warnings generated', documentId: 'doc-002' },
        { id: 'audit-004', timestamp: '2024-01-20T10:45:00Z', action: 'Extraction Completed', user: 'AI Engine', details: '6 fields extracted with 94% avg confidence', documentId: 'doc-002' },
        { id: 'audit-005', timestamp: '2024-01-20T10:45:00Z', action: 'Classification', user: 'AI Engine', details: 'Classified as Invoice (97% confidence)', documentId: 'doc-002' },
        { id: 'audit-006', timestamp: '2024-01-20T10:45:00Z', action: 'Document Uploaded', user: 'John Smith', details: 'invoice_acme_78234.pdf uploaded', documentId: 'doc-002' }
    ],

    // Document Types Configuration
    documentTypes: [
        { id: 'dt-001', name: 'Purchase Order', category: 'Procurement', fieldsCount: 12, rulesCount: 5, status: 'active' },
        { id: 'dt-002', name: 'Invoice', category: 'Procurement', fieldsCount: 15, rulesCount: 8, status: 'active' },
        { id: 'dt-003', name: 'Goods Receipt Note', category: 'Procurement', fieldsCount: 10, rulesCount: 4, status: 'active' },
        { id: 'dt-004', name: 'Claim Form', category: 'Healthcare', fieldsCount: 18, rulesCount: 12, status: 'active' },
        { id: 'dt-005', name: 'Medical Bill', category: 'Healthcare', fieldsCount: 14, rulesCount: 6, status: 'active' },
        { id: 'dt-006', name: 'ID Document', category: 'Identity', fieldsCount: 8, rulesCount: 3, status: 'active' }
    ],

    // Field Types for Schema Builder
    fieldTypes: [
        { value: 'string', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'currency', label: 'Currency' },
        { value: 'date', label: 'Date' },
        { value: 'boolean', label: 'Yes/No' },
        { value: 'enum', label: 'Dropdown' },
        { value: 'table', label: 'Table' }
    ],

    // Sample Document Images (placeholder paths)
    sampleDocumentImages: {
        purchase_order: 'assets/samples/purchase_order.png',
        invoice: 'assets/samples/invoice.png',
        grn: 'assets/samples/grn.png',
        claim_form: 'assets/samples/claim_form.png',
        medical_bill: 'assets/samples/medical_bill.png',
        id_document: 'assets/samples/id_document.png'
    },

    // Workflow Stages
    workflowStages: [
        { id: 'upload', name: 'Upload', icon: 'upload' },
        { id: 'classify', name: 'Classify', icon: 'tag' },
        { id: 'extract', name: 'Extract', icon: 'file-text' },
        { id: 'validate', name: 'Validate', icon: 'check-circle' },
        { id: 'review', name: 'Review', icon: 'eye' },
        { id: 'approve', name: 'Approve', icon: 'thumbs-up' },
        { id: 'complete', name: 'Complete', icon: 'check' }
    ],

    // Integration Options
    integrations: {
        import: [
            { id: 'email', name: 'Email', icon: 'mail', configured: true },
            { id: 'dropbox', name: 'Dropbox', icon: 'droplet', configured: false },
            { id: 's3', name: 'Amazon S3', icon: 'cloud', configured: false },
            { id: 'api', name: 'REST API', icon: 'code', configured: true }
        ],
        export: [
            { id: 'sap', name: 'SAP', icon: 'database', configured: true },
            { id: 'database', name: 'Database', icon: 'hard-drive', configured: false },
            { id: 'slack', name: 'Slack', icon: 'message-square', configured: true },
            { id: 'webhook', name: 'Webhook', icon: 'link', configured: false }
        ]
    }
};

// Helper to simulate API delay
function simulateDelay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to get random confidence score
function getRandomConfidence(min = 75, max = 99) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
