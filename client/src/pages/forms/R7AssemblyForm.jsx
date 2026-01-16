import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, UserCheck, ChevronRight, Check } from 'lucide-react';
import { useWorkflowState, WORKFLOW_STATUS, ROLES } from '../../hooks/useWorkflowState';
import HoldPointControl from '../../components/ui/HoldPointControl';
import SignatureCanvas from '../../components/ui/SignatureCanvas';
import PhotoCapture from '../../components/ui/PhotoCapture';

const INITIAL_SECTIONS = [
    { id: 'prep', title: '1. Preparación y Limpieza' },
    { id: 'assembly_hss', title: '2. Armado Eje Alta (HSS)' },
    { id: 'assembly_lss', title: '3. Armado Eje Baja (LSS)' },
    { id: 'final_check', title: '4. Pruebas Finales y Sellado' },
];

export default function R7AssemblyForm({ onBack }) {
    const navigate = useNavigate();
    const {
        currentStep,
        currentSection,
        sections,
        activeRole,
        setActiveRole,
        updateSectionData,
        signSection,
        submitForReview,
        approveSection,
        goToStep,
        isLastStep
    } = useWorkflowState(INITIAL_SECTIONS);

    const renderSectionContent = () => {
        const isLocked = currentSection.status === WORKFLOW_STATUS.LOCKED;
        const disabled = isLocked || (activeRole === ROLES.TECHNICIAN && currentSection.status !== WORKFLOW_STATUS.OPEN);

        switch (currentSection.id) {
            case 'prep':
                return (
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                            <h4 className="font-bold text-blue-900 text-sm mb-1 uppercase">Hold Point de Limpieza</h4>
                            <p className="text-xs text-blue-800">Verifique que la carcasa esté libre de residuos y pintura antigua.</p>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                                <input type="checkbox" disabled={disabled} className="w-5 h-5 accent-blue-600" />
                                <span className="font-medium text-gray-700">Limpieza con solvente dieléctrico realizada</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                                <input type="checkbox" disabled={disabled} className="w-5 h-5 accent-blue-600" />
                                <span className="font-medium text-gray-700">Canales de lubricación soplados y libres</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                                <input type="checkbox" disabled={disabled} className="w-5 h-5 accent-blue-600" />
                                <span className="font-medium text-gray-700">Alojamiento de rodamientos verificado</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Evidencia de Limpieza</label>
                            <PhotoCapture
                                photos={currentSection.data?.cleanPhotos || []}
                                onCapture={(photos) => updateSectionData('cleanPhotos', photos)}
                                maxPhotos={2}
                            />
                        </div>
                    </div>
                );
            case 'assembly_hss':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">N° Serie Rodamiento L.A.</label>
                                <input
                                    type="text"
                                    disabled={disabled}
                                    value={currentSection.data?.bearingLA || ''}
                                    onChange={(e) => updateSectionData('bearingLA', e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">N° Serie Rodamiento L.O.A.</label>
                                <input
                                    type="text"
                                    disabled={disabled}
                                    value={currentSection.data?.bearingLOA || ''}
                                    onChange={(e) => updateSectionData('bearingLOA', e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Juego Axial Final (mm)</label>
                            <input
                                type="number"
                                disabled={disabled}
                                value={currentSection.data?.axialPlay || ''}
                                onChange={(e) => updateSectionData('axialPlay', e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none font-mono"
                                placeholder="0.00"
                            />
                        </div>
                        <PhotoCapture
                            photos={currentSection.data?.hssPhotos || []}
                            onCapture={(photos) => updateSectionData('hssPhotos', photos)}
                        />
                    </div>
                );
            case 'assembly_lss':
                return (
                    <div className="space-y-4">
                        <p className="text-gray-500 italic">Formulario similar a Eje de Alta, específico para Baja Velocidad.</p>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Torque de Pernos (Nm)</label>
                            <input
                                type="number"
                                disabled={disabled}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none"
                            />
                        </div>
                    </div>
                );
            case 'final_check':
                return (
                    <div className="space-y-6">
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                            <h4 className="font-bold text-green-900 text-sm mb-2">Prueba de Giro Libre</h4>
                            <p className="text-sm text-green-800">El reductor debe girar suavemente sin ruidos anormales.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Video / Foto Giro</label>
                            <PhotoCapture
                                photos={currentSection.data?.finalPhotos || []}
                                onCapture={(photos) => updateSectionData('finalPhotos', photos)}
                            />
                        </div>
                    </div>
                );
            default:
                return <div>Sección no configurada</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#575756]">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">R7 - Armado Reductores</h1>
                        <p className="text-xs text-gray-500">Montaje Final • OS-Pending</p>
                    </div>
                </div>
                {/* Role Switcher */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveRole(ROLES.TECHNICIAN)} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${activeRole === ROLES.TECHNICIAN ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><User className="w-3 h-3" /> Téc</button>
                    <button onClick={() => setActiveRole(ROLES.SUPERVISOR)} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${activeRole === ROLES.SUPERVISOR ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}><UserCheck className="w-3 h-3" /> Sup</button>
                </div>
            </div>

            <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Steps Nav */}
                <div className="md:col-span-3 space-y-2 hidden md:block sticky top-24 h-fit">
                    {sections.map((section, idx) => (
                        <button
                            key={section.id}
                            onClick={() => goToStep(idx)}
                            disabled={section.status === WORKFLOW_STATUS.LOCKED}
                            className={`w-full text-left p-3 rounded-xl border flex items-center justify-between group transition-all ${idx === currentStep
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                    : section.status === WORKFLOW_STATUS.APPROVED
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : section.status === WORKFLOW_STATUS.LOCKED
                                            ? 'bg-gray-50 border-transparent text-gray-300'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                                }`}
                        >
                            <span className="text-sm font-bold truncate pr-2">{section.title}</span>
                            {section.status === WORKFLOW_STATUS.APPROVED && <Check className="w-4 h-4" />}
                            {section.status === WORKFLOW_STATUS.LOCKED && <span className="text-xs">🔒</span>}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div className="md:col-span-9 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{currentSection.title}</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentSection.status === WORKFLOW_STATUS.OPEN ? 'bg-blue-100 text-blue-700' :
                                    currentSection.status === WORKFLOW_STATUS.REVIEW ? 'bg-orange-100 text-orange-700' :
                                        currentSection.status === WORKFLOW_STATUS.APPROVED ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-400'
                                }`}>
                                {currentSection.status === WORKFLOW_STATUS.OPEN ? 'En Progreso' :
                                    currentSection.status === WORKFLOW_STATUS.REVIEW ? 'Revisión' :
                                        currentSection.status === WORKFLOW_STATUS.APPROVED ? 'Aprobado' : 'Bloqueado'}
                            </span>
                        </div>
                        {renderSectionContent()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <SignatureCanvas
                                label="Firma Técnico Armado"
                                onSave={(sig) => signSection(sig, ROLES.TECHNICIAN)}
                                savedSignature={currentSection.technicianSignature}
                                disabled={currentSection.status !== WORKFLOW_STATUS.OPEN || activeRole !== ROLES.TECHNICIAN}
                            />
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <SignatureCanvas
                                label="Firma Supervisión (Liberación)"
                                onSave={(sig) => signSection(sig, ROLES.SUPERVISOR)}
                                savedSignature={currentSection.supervisorSignature}
                                disabled={currentSection.status !== WORKFLOW_STATUS.REVIEW || activeRole !== ROLES.SUPERVISOR}
                            />
                        </div>
                    </div>

                    <HoldPointControl
                        status={currentSection.status}
                        role={activeRole}
                        isTechnicianSigned={!!currentSection.technicianSignature}
                        isSupervisorSigned={!!currentSection.supervisorSignature}
                        onSendForReview={submitForReview}
                        onApprove={approveSection}
                    />

                    <div className="flex justify-between pt-8 pb-12">
                        <button
                            disabled={currentStep === 0}
                            onClick={() => goToStep(currentStep - 1)}
                            className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        >
                            Anterior
                        </button>
                        <button
                            disabled={currentSection.status !== WORKFLOW_STATUS.APPROVED || isLastStep}
                            onClick={() => goToStep(currentStep + 1)}
                            className="px-6 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center gap-2"
                        >
                            Siguiente <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
