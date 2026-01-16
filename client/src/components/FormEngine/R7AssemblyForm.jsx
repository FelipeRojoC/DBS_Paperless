import React, { useState, useMemo, useEffect } from 'react';
import r7Data from '../../data/r7.json';
import FormRenderer from './FormRenderer';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { formService } from '../../services/api';

// Styles for the Premium Layout
const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
    },
    sidebar: {
        width: '300px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e9ecef',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        boxShadow: '2px 0 5px rgba(0,0,0,0.03)',
        zIndex: 10,
    },
    sidebarHeader: {
        marginBottom: '2rem',
        color: '#343a40',
        fontWeight: '700',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    stepList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    stepItem: (active, locked, complete) => ({
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: locked ? 'not-allowed' : 'pointer',
        backgroundColor: active ? '#e7f5ff' : 'transparent',
        color: active ? '#1971c2' : (locked ? '#adb5bd' : '#495057'),
        fontWeight: active ? '600' : '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        opacity: locked ? 0.7 : 1,
        border: active ? '1px solid #d0ebff' : '1px solid transparent',
    }),
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    scrollArea: {
        padding: '2rem',
        overflowY: 'auto',
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerArea: {
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        border: '1px solid #e9ecef',
    },
    panelCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        marginBottom: '2rem',
        border: '1px solid #e9ecef',
    },
    panelTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #f1f3f5',
        paddingBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lockIcon: {
        fontSize: '0.9rem',
        marginLeft: 'auto',
        color: '#fcc419',
    },
    checkIcon: {
        color: '#40c057',
        fontSize: '1rem',
    },
    actions: {
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e9ecef',
    },
    buttonPrimary: {
        backgroundColor: '#339af0',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    buttonSecondary: {
        backgroundColor: '#f8f9fa',
        color: '#495057',
        border: '1px solid #dee2e6',
        padding: '10px 20px',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
    }
};

const R7AssemblyForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [isPrintMode, setIsPrintMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSave = async (status = 'draft') => {
        setLoading(true);
        try {
            // Mock data for IDs until fully integrated
            const payload = {
                template_id: 7, // R7
                service_order_id: 'SO-' + new Date().getTime(), // Unique mock SO
                technician_id: 1, // Default from seed
                status: status,
                form_data: formData
            };

            await formService.submitForm(payload);
            alert(status === 'draft' ? "Borrador guardado exitosamente" : "Formulario finalizado guardado");
            if (status === 'approved' || status === 'submitted') {
                navigate('/technician');
            }
        } catch (error) {
            console.error("Save error", error);
            alert("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    // Get User Role
    const userRole = localStorage.getItem("dbs_user_role") || "Técnico Mecánico";
    // Check role - logic to detect Supervisor
    const isSupervisor = userRole.toLowerCase().includes('supervisor') || userRole.toLowerCase().includes('jefe');

    // -- Structure Analysis --
    const { headerComponents, steps } = useMemo(() => {
        const dataArray = Array.isArray(r7Data) ? r7Data : (r7Data.components || []);

        const headers = [];
        const panelSteps = [];
        let foundFirstPanel = false;

        dataArray.forEach((comp, idx) => {
            if (comp.type === 'panel') {
                foundFirstPanel = true;
                panelSteps.push({
                    ...comp,
                    _id: comp.key || `panel_${idx}`,
                    _index: panelSteps.length
                });
            } else if (!foundFirstPanel) {
                headers.push({ ...comp, _id: `header_${idx}` });
            } else {
                if (panelSteps.length > 0) {
                    const lastPanel = panelSteps[panelSteps.length - 1];
                    if (!lastPanel.extraContent) lastPanel.extraContent = [];
                    lastPanel.extraContent.push(comp);
                }
            }
        });

        return { headerComponents: headers, steps: panelSteps };
    }, []);

    // -- Logic Helpers --
    const isPanelComplete = (index) => {
        const panelData = formData[`panel_${index}`];
        if (!panelData) return false;

        const keys = Object.keys(panelData);
        // Check for Technical signature presence
        const techSig = keys.find(k => {
            const lower = k.toLowerCase();
            return lower.includes('firma') && (lower.includes('tecnico') || lower.includes('armado') || lower.includes('mecanico'));
        });

        return !!(techSig && panelData[techSig]);
    };

    const getStepStatus = (index) => {
        if (index === 0) return { locked: false, complete: isPanelComplete(index) };
        const prevPanelComplete = isPanelComplete(index - 1);
        return {
            locked: !prevPanelComplete,
            complete: isPanelComplete(index)
        };
    };

    const handleStepClick = (index) => {
        const status = getStepStatus(index);
        if (!status.locked) {
            setActiveStep(index);
        }
    };

    const handleInputChange = (path, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            // Simple distinct merge logic for now
            // For deep objects:
            const keys = path.split('.');
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleGeneratePDF = async () => {
        if (isPrintMode) return;

        setLoading(true);
        setIsPrintMode(true);

        // Allow render cycle to update UI to 'Print Mode' (all panels expanded)
        setTimeout(async () => {
            try {
                const input = document.getElementById('r7-form-content');
                if (input) {
                    const canvas = await html2canvas(input, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: '#ffffff'
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                    // If height > page, basic logic (jspdf handles generic image placement but multipage is harder)
                    // For MVP, we stick image. If it's long, we might need multiple pages logic.
                    // Assuming basic scaling for now.

                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`R7_Completo_${new Date().toISOString().slice(0, 10)}.pdf`);
                }
            } catch (e) {
                console.error("PDF Generation Error", e);
                alert("Error generating PDF");
            } finally {
                setIsPrintMode(false);
                setLoading(false);
            }
        }, 1000);
    };


    return (
        <div style={styles.container}>
            {/* Mobile Toggle Button (Visible on small screens via logic or z-index overlay) */}
            <button
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#339af0',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Simple "media query" via JS checks or just always there on bottom right for easy access
                }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title="Toggle Sidebar"
            >
                {isSidebarOpen ? '×' : '☰'}
            </button>

            {/* Sidebar Navigation */}
            <aside style={{
                ...styles.sidebar,
                position: 'relative', // Simplify for desktop, but for mobile we might want absolute/fixed
                marginLeft: isSidebarOpen ? '0' : '-340px', // Hide by negative margin
                transition: 'margin-left 0.3s ease',
                minWidth: '300px' // Ensure width is kept
            }}>
                <div style={styles.sidebarHeader}>
                    <span style={{ color: '#339af0' }}>★</span> R7 Assembly
                </div>
                <ul style={styles.stepList}>
                    {steps.map((step, idx) => {
                        const status = getStepStatus(idx);
                        const isActive = activeStep === idx && !isPrintMode;

                        return (
                            <li
                                key={step._id}
                                style={styles.stepItem(isActive, status.locked, status.complete)}
                                onClick={() => !isPrintMode && handleStepClick(idx)}
                            >
                                <span>{idx + 1}. {step.title || step.label || 'Untitled Section'}</span>
                                {status.locked && <span style={styles.lockIcon}>🔒</span>}
                                {status.complete && <span style={styles.checkIcon}>✓</span>}
                            </li>
                        );
                    })}
                </ul>

                {/* Actions */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={loading}
                        style={{ ...styles.buttonSecondary, width: '100%' }}
                    >
                        {loading ? 'Guardando...' : '💾 Guardar Borrador'}
                    </button>
                    <button
                        onClick={handleGeneratePDF}
                        disabled={loading}
                        style={{ ...styles.buttonPrimary, width: '100%', backgroundColor: loading ? '#ccc' : '#1971c2' }}
                    >
                        {loading ? 'Procesando...' : '📄 Descargar PDF'}
                    </button>
                    <button
                        onClick={() => handleSave('submitted')}
                        disabled={loading}
                        style={{ ...styles.buttonSecondary, width: '100%', borderColor: '#40c057', color: '#40c057' }}
                    >
                        ✅ Finalizar y Enviar
                    </button>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                    <button
                        onClick={() => navigate('/technician')}
                        style={{ ...styles.buttonSecondary, width: '100%', border: 'none', color: '#868e96', textAlign: 'left', paddingLeft: 0 }}
                    >
                        ← Volver al Dashboard
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={styles.mainContent}>
                <div style={styles.scrollArea}>
                    <div id="r7-form-content">
                        {/* Global Header */}
                        <div style={styles.headerArea}>
                            {headerComponents.map(comp => (
                                <FormRenderer
                                    key={comp._id}
                                    component={comp}
                                    formData={formData}
                                    onChange={handleInputChange}
                                    pathPrefix="header"
                                    isSupervisor={isSupervisor}
                                    readOnly={isPrintMode}
                                />
                            ))}
                        </div>

                        {/* --- NORMAL MODE: Active Panel Only --- */}
                        {!isPrintMode && steps[activeStep] && (
                            <div style={styles.panelCard}>
                                <div style={styles.panelTitle}>
                                    {steps[activeStep].title}
                                    <div style={{ fontSize: '0.8rem', fontWeight: '400', color: '#868e96', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#40c057' }}></span>
                                        {getStepStatus(activeStep).complete ? 'Completado' : 'En Progreso'}
                                    </div>
                                </div>

                                {steps[activeStep].components && steps[activeStep].components.map((child, cIdx) => (
                                    <FormRenderer
                                        key={child.key || cIdx}
                                        component={child}
                                        formData={formData}
                                        onChange={handleInputChange}
                                        pathPrefix={`panel_${activeStep}`}
                                        isSupervisor={isSupervisor}
                                    />
                                ))}

                                <div style={styles.actions}>
                                    <button style={styles.buttonSecondary} disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)}>
                                        Anterior
                                    </button>
                                    <button style={styles.buttonPrimary} onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))}>
                                        {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- PRINT MODE: All Panels --- */}
                        {isPrintMode && steps.map((step, idx) => (
                            <div key={`print_${idx}`} style={{ ...styles.panelCard, marginBottom: '20px', breakInside: 'avoid' }}>
                                <h3 style={{ ...styles.panelTitle, fontSize: '1.1rem' }}>{idx + 1}. {step.title}</h3>
                                {step.components && step.components.map((child, cIdx) => (
                                    <FormRenderer
                                        key={child.key || cIdx}
                                        component={child}
                                        formData={formData}
                                        onChange={() => { }} // ReadOnly
                                        pathPrefix={`panel_${idx}`}
                                        isSupervisor={isSupervisor}
                                        readOnly={true}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px', color: '#adb5bd', fontSize: '0.8rem' }}>
                        Form ID: R7-REV02 • DBS Paperless
                    </div>
                </div>
            </main>
        </div>
    );
};

export default R7AssemblyForm;
