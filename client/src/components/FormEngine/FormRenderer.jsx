import React from 'react';

// Premium Design System Tokens
const theme = {
    colors: {
        primary: '#339af0', // Blue
        border: '#ced4da',
        borderFocus: '#74c0fc',
        text: '#212529',
        textSecondary: '#868e96',
        background: '#ffffff',
        bgSecondary: '#f8f9fa',
        danger: '#fa5252',
        success: '#40c057',
    },
    radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    },
    shadow: {
        xs: '0 1px 2px rgba(0,0,0,0.05)',
        sm: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    }
};

const styles = {
    label: {
        display: 'block',
        fontWeight: '600',
        fontSize: '0.9rem',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        fontSize: '0.95rem',
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.background,
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        outline: 'none',
    },
    inputFocus: {
        borderColor: theme.colors.borderFocus,
        boxShadow: `0 0 0 3px rgba(51, 154, 240, 0.15)`,
    },
    card: {
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    signatureCard: {
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '200px',
    },
    fileUpload: {
        border: `2px dashed ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        textAlign: 'center',
        backgroundColor: theme.colors.bgSecondary,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        transition: 'background 0.2s',
    },
    helperText: {
        fontSize: '0.8rem',
        color: theme.colors.textSecondary,
        marginTop: '4px',
    }
};

/**
 * Recursive Form Renderer with Premium UI
 */
const FormRenderer = ({ component, path, formData, onChange, readOnly = false, isSupervisor = false }) => {
    if (!component) return null;

    // Helper to render children
    const renderChildren = (children, parentPath) => {
        if (!children || !Array.isArray(children)) return null;
        return children.map((child, idx) => {
            const childKey = child.key || `idx_${idx}`;
            // If parent is a table or specially handled container, path construction might differ
            const childPath = `${parentPath}.${childKey}`;
            return (
                <FormRenderer
                    key={childPath}
                    component={child}
                    path={childPath}
                    formData={formData}
                    onChange={onChange}
                    readOnly={readOnly}
                    isSupervisor={isSupervisor}
                />
            );
        });
    };

    const value = formData[path] || '';

    const handleInputChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        onChange(path, val);
    };

    // Helper for input focus effect (simple inline for now, or class if we had CSS modules)
    const handleFocus = (e) => {
        e.target.style.borderColor = styles.inputFocus.borderColor;
        e.target.style.boxShadow = styles.inputFocus.boxShadow;
    };
    const handleBlur = (e) => {
        e.target.style.borderColor = theme.colors.border;
        e.target.style.boxShadow = 'none';
        // Add basic validation visual feedback here later
    };

    switch (component.type) {
        // --- Containers ---
        case 'panel':
            // Panels rendered recursively usually just need a container if not top-level
            // Top-level panels are handled by R7AssemblyForm for the sidebar.
            // Nested panels can be simple sections.
            return (
                <div style={{ marginBottom: theme.spacing.lg }}>
                    {component.title && (
                        <h4 style={{ fontSize: '1.1rem', marginBottom: theme.spacing.md, color: theme.colors.primary }}>
                            {component.title}
                        </h4>
                    )}
                    {renderChildren(component.components, path)}
                </div>
            );

        case 'columns':
            return (
                <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap', marginBottom: theme.spacing.md }}>
                    {component.columns.map((col, idx) => (
                        <div key={idx} style={{ flex: col.width ? col.width / 12 : 1, minWidth: '250px' }}>
                            {renderChildren(col.components, `${path}.col_${idx}`)}
                        </div>
                    ))}
                </div>
            );

        case 'table':
            return (
                <div style={{ overflowX: 'auto', marginBottom: theme.spacing.lg, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md }}>
                    {component.label && <div style={{ padding: theme.spacing.sm, background: theme.colors.bgSecondary, borderBottom: `1px solid ${theme.colors.border}`, fontWeight: 600 }}>{component.label}</div>}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <tbody>
                            {component.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} style={{ border: `1px solid ${theme.colors.border}`, padding: '12px', verticalAlign: 'top' }}>
                                            {renderChildren(cell.components, `${path}.row_${rowIndex}.cell_${cellIndex}`)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        // --- Inputs ---
        case 'textfield':
        case 'number':
        case 'email':
        case 'password':
        case 'phoneNumber':
            return (
                <div style={{ marginBottom: theme.spacing.md }}>
                    {component.label && <label style={styles.label}>{component.label}</label>}
                    <input
                        type={component.type === 'number' ? 'number' : 'text'}
                        style={styles.input}
                        placeholder={component.placeholder}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={readOnly || component.disabled}
                    />
                </div>
            );

        case 'textarea':
            return (
                <div style={{ marginBottom: theme.spacing.md }}>
                    {component.label && <label style={styles.label}>{component.label}</label>}
                    <textarea
                        style={{ ...styles.input, minHeight: '100px', fontFamily: 'inherit' }}
                        placeholder={component.placeholder}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={readOnly || component.disabled}
                    />
                </div>
            );

        case 'checkbox':
            return (
                <div style={{ marginBottom: theme.spacing.md }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '12px',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.radius.md,
                        backgroundColor: value ? '#e7f5ff' : 'white',
                        transition: 'all 0.2s'
                    }}>
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={handleInputChange}
                            disabled={readOnly || component.disabled}
                            style={{ width: '18px', height: '18px', accentColor: theme.colors.primary }}
                        />
                        <span style={{ fontWeight: 500 }}>{component.label}</span>
                    </label>
                </div>
            );

        case 'select':
            return (
                <div style={{ marginBottom: theme.spacing.md }}>
                    {component.label && <label style={styles.label}>{component.label}</label>}
                    <select
                        style={styles.input}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={readOnly || component.disabled}
                    >
                        <option value="">Select option...</option>
                        {component.data && component.data.values && component.data.values.map((opt, idx) => (
                            <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            );

        case 'datetime':
            return (
                <div style={{ marginBottom: theme.spacing.md }}>
                    {component.label && <label style={styles.label}>{component.label}</label>}
                    <input
                        type="datetime-local"
                        style={styles.input}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={readOnly || component.disabled}
                    />
                </div>
            );

        // --- Rich Components ---
        case 'content':
        case 'htmlelement':
            // Styles for specific classes mentioned in r7.json like 'dbs-title' can be inline handled or globally css
            return (
                <div
                    style={{ margin: '16px 0', lineHeight: '1.6', color: '#495057' }}
                    dangerouslySetInnerHTML={{ __html: component.content || component.html }}
                />
            );

        case 'file':
            return (
                <div style={{ marginBottom: theme.spacing.lg }}>
                    <div style={styles.label}>{component.label}</div>
                    <div style={styles.fileUpload}>
                        {/* Placeholder Icon */}
                        <div style={{ fontSize: '24px', color: theme.colors.textSecondary }}>📷</div>
                        <div style={{ fontWeight: 500, color: theme.colors.primary }}>Tomar Foto / Adjuntar</div>
                        <div style={styles.helperText}>0/2 fotos adjuntas (Mínimo 1)</div>
                    </div>
                </div>
            );

        case 'signature':
            // RBAC Logic
            let isSignatureDisabled = readOnly || component.disabled;
            const keyLower = (component.key || "").toLowerCase();
            const isSupervisorField = keyLower.includes('supervisor') || keyLower.includes('supervision') || keyLower.includes('liberado');
            const isTechnicianField = keyLower.includes('tecnico') || keyLower.includes('armado');

            // Apply Role Rules
            // 1. If Technician (isSupervisor=false): Cannot sign Supervisor fields
            if (!isSupervisor && isSupervisorField) {
                isSignatureDisabled = true;
            }
            // 2. If Supervisor (isSupervisor=true): Cannot sign Technician fields (Review Only - debatable, but usually good practice)
            // Or maybe Supervisor CAN sign everything? User said "Supervisor puede ver todo". 
            // Mockup shows Supervisor field locked until Tech signs.
            if (isSupervisor && isTechnicianField) {
                // For now, let's say Supervisor can't modify Tech's signature
                isSignatureDisabled = true;
            }

            return (
                <div style={styles.signatureCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ ...styles.label, marginBottom: 'auto' }}>
                            {component.footer || component.label || "Firma"}
                        </label>
                        {/* Optional Role Badge */}
                        {isSupervisorField && <span style={{ fontSize: '0.7rem', background: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>Supervisor</span>}
                    </div>

                    <div style={{
                        height: '120px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        margin: '12px 0',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Placeholder for Signature Canvas */}
                        <span style={{ color: '#adb5bd', fontSize: '0.8rem' }}>Área de Firma</span>
                    </div>

                    {isSignatureDisabled ? (
                        <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>🔒</span>
                            {isSupervisorField && !isSupervisor
                                ? "Reservado para Supervisor"
                                : "Firma Bloqueada / Solo Lectura"}
                        </div>
                    ) : (
                        <button style={{
                            alignSelf: 'flex-end',
                            backgroundColor: theme.colors.primary,
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            width: 'fit-content',
                            marginLeft: 'auto'
                        }}
                            onClick={() => {
                                // MOCK Action for prototype
                                // Sets a dummy value to trigger state changes
                                onChange(path, "Signed_Mock_Value_" + new Date().toISOString());
                            }}
                        >
                            <span>✎</span> Confirmar Firma
                        </button>
                    )}
                </div>
            );

        default:
            return null; // Silent skip for unknown to avoid clutter
    }
};

export default FormRenderer;
