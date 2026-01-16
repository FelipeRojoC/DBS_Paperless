import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, UserCheck, Shield, ClipboardCheck, ChevronRight, Check } from 'lucide-react';
import { useWorkflowState, WORKFLOW_STATUS, ROLES } from '../../hooks/useWorkflowState';
import HoldPointControl from '../../components/ui/HoldPointControl';
import SignatureCanvas from '../../components/ui/SignatureCanvas';
import PhotoCapture from '../../components/ui/PhotoCapture';

const INITIAL_SECTIONS = [
    { id: 'general', title: '1. Identificación y Datos Generales' },
    { id: 'visual', title: '2. Inspección Visual Inicial' },
    { id: 'disassembly', title: '3. Desarme y Evaluación' },
    { id: 'dimensional', title: '4. Verificación Dimensional' },
];

export default function R3EvaluationForm({ onBack }) {
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

    // -- Renders for specific section content --
    const renderSectionContent = () => {
        const isLocked = currentSection.status === WORKFLOW_STATUS.LOCKED;
        const disabled = isLocked || (activeRole === ROLES.TECHNICIAN && currentSection.status !== WORKFLOW_STATUS.OPEN);

        switch (currentSection.id) {
            case 'general':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">N° Orden de Servicio (OS)</label>
                                <input
                                    type="text"
                                    disabled={disabled}
                                    value={currentSection.data?.osNumber || ''}
                                    onChange={(e) => updateSectionData('osNumber', e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none font-mono"
                                    placeholder="Ej: OS-2026-001"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente</label>
                                <input
                                    type="text"
                                    disabled={disabled}
                                    value={currentSection.data?.client || ''}
                                    onChange={(e) => updateSectionData('client', e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                    placeholder="Ej: Minera Escondida"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Equipo / Tag</label>
                                <input
                                    type="text"
                                    disabled={disabled}
                                    value={currentSection.data?.tag || ''}
                                    onChange={(e) => updateSectionData('tag', e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                    placeholder="Ej: Reductor Cinta 04"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Recepción</label>
                                <input
                                    type="date"
                                    disabled={disabled}
                                    value={currentSection.data?.date || ''}
                                    onChange={(e) => updateSectionData('date', e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'visual':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estado de Recepción (Fotos)</label>
                            <PhotoCapture
                                photos={currentSection.data?.photos || []}
                                onCapture={(photos) => updateSectionData('photos', photos)}
                                maxPhotos={4}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observaciones Visuales</label>
                            <textarea
                                disabled={disabled}
                                value={currentSection.data?.observations || ''}
                                onChange={(e) => updateSectionData('observations', e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none min-h-[100px]"
                                placeholder="Describa fugas de aceite, daños en pintura, estado de pernos, etc."
                            />
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                            <input
                                type="checkbox"
                                disabled={disabled}
                                checked={currentSection.data?.oilLeak || false}
                                onChange={(e) => updateSectionData('oilLeak', e.target.checked)}
                                className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                            />
                            <span className="text-sm font-medium text-yellow-800">¿Presenta fugas de aceite evidentes?</span>
                        </div>
                    </div>
                );
            case 'disassembly':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {['Rodamientos', 'Engranajes', 'Ejes', 'Sellos'].map((item) => (
                                <div key={item} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <span className="font-bold text-gray-700">{item}</span>
                                    <select
                                        disabled={disabled}
                                        value={currentSection.data?.[`status_${item}`] || ''}
                                        onChange={(e) => updateSectionData(`status_${item}`, e.target.value)}
                                        className="p-2 bg-white rounded-lg border border-gray-200 text-sm"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="good">Buen Estado</option>
                                        <option value="repair">Requiere Reparación</option>
                                        <option value="replace">Requiere Reemplazo</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comentarios del Técnico</label>
                            <textarea
                                disabled={disabled}
                                value={currentSection.data?.disassemblyComments || ''}
                                onChange={(e) => updateSectionData('disassemblyComments', e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                rows={3}
                            />
                        </div>
                    </div>
                );
            case 'dimensional':
                return (
                    <div className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Componente</th>
                                        <th className="px-4 py-3">Nominal (mm)</th>
                                        <th className="px-4 py-3">Lectura (mm)</th>
                                        <th className="px-4 py-3">Desviación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map(i => (
                                        <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900 border-r">Eje Entrada - Sección {i}</td>
                                            <td className="px-4 py-3"><input disabled={disabled} className="w-20 p-1 border rounded" placeholder="100.00" /></td>
                                            <td className="px-4 py-3"><input disabled={disabled} className="w-20 p-1 border rounded" placeholder="0.00" /></td>
                                            <td className="px-4 py-3 font-bold text-red-500">+0.05</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 text-sm mb-2">Carga de Instrumentos</h4>
                            <p className="text-xs text-blue-700 mb-2">Adjunte foto de la calibración del micrómetro utilizado.</p>
                            <PhotoCapture
                                photos={currentSection.data?.calibPhotos || []}
                                onCapture={(photos) => updateSectionData('calibPhotos', photos)}
                                maxPhotos={1}
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

            {/* Top Navigation Bar */}
            <div className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">R3 - Evaluación Reductores</h1>
                        <p className="text-xs text-gray-500">M6-RS R3-B1 • OS-Pending</p>
                    </div>
                </div>

                {/* Role Switcher (DEV ONLY) */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveRole(ROLES.TECHNICIAN)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${activeRole === ROLES.TECHNICIAN ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                            }`}
                    >
                        <User className="w-3 h-3" /> Técnico
                    </button>
                    <button
                        onClick={() => setActiveRole(ROLES.SUPERVISOR)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${activeRole === ROLES.SUPERVISOR ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'
                            }`}
                    >
                        <UserCheck className="w-3 h-3" /> Supervisor
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left: Steps Navigator */}
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

                {/* Right: Active Form Section */}
                <div className="md:col-span-9 space-y-6">

                    {/* Section Header */}
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

                    {/* Signatures & Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Technician Signature */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <SignatureCanvas
                                label="Firma Técnico Responsable"
                                onSave={(sig) => signSection(sig, ROLES.TECHNICIAN)}
                                savedSignature={currentSection.technicianSignature}
                                disabled={currentSection.status !== WORKFLOW_STATUS.OPEN || activeRole !== ROLES.TECHNICIAN}
                            />
                        </div>

                        {/* Supervisor Signature */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <SignatureCanvas
                                label="Firma Supervisión (Aprobación)"
                                onSave={(sig) => signSection(sig, ROLES.SUPERVISOR)}
                                savedSignature={currentSection.supervisorSignature}
                                disabled={currentSection.status !== WORKFLOW_STATUS.REVIEW || activeRole !== ROLES.SUPERVISOR}
                            />
                        </div>
                    </div>

                    {/* Workflow Control Actions */}
                    <HoldPointControl
                        status={currentSection.status}
                        role={activeRole}
                        isTechnicianSigned={!!currentSection.technicianSignature}
                        isSupervisorSigned={!!currentSection.supervisorSignature}
                        onSendForReview={submitForReview}
                        onApprove={approveSection}
                    />

                    {/* Step Navigation (Mobile mostly) */}
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
