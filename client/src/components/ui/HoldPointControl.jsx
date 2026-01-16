import { Lock, Unlock, Send, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { WORKFLOW_STATUS, ROLES } from '../../hooks/useWorkflowState';

export default function HoldPointControl({
    status,
    role,
    onSendForReview,
    onApprove,
    isTechnicianSigned,
    isSupervisorSigned
}) {

    // 1. LOCKED STATE
    if (status === WORKFLOW_STATUS.LOCKED) {
        return (
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center justify-center text-gray-400 gap-2">
                <Lock className="w-5 h-5" />
                <span className="font-bold text-sm">Sección Bloqueada - Complete la anterior</span>
            </div>
        );
    }

    // 2. OPEN STATE (Technician Working)
    if (status === WORKFLOW_STATUS.OPEN) {
        if (role === ROLES.TECHNICIAN) {
            const canSend = isTechnicianSigned;
            return (
                <div className="bg-white border-t border-gray-100 pt-6 mt-6">
                    <button
                        onClick={onSendForReview}
                        disabled={!canSend}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${canSend
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {canSend ? <><Send className="w-5 h-5" /> Enviar a Supervisión</> : 'Firme para Enviar'}
                    </button>
                    {!canSend && <p className="text-center text-xs text-orange-500 mt-2 font-bold flex justify-center items-center gap-1"><AlertTriangle className="w-3 h-3" /> Requiere firma del técnico</p>}
                </div>
            );
        } else {
            return (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full"><Clock className="w-5 h-5 text-blue-600" /></div>
                    <div>
                        <h4 className="text-blue-900 font-bold text-sm">Técnico Trabajando</h4>
                        <p className="text-blue-600 text-xs">Esperando que el técnico envíe el reporte.</p>
                    </div>
                </div>
            );
        }
    }

    // 3. REVIEW STATE (Supervisor Reviewing)
    if (status === WORKFLOW_STATUS.REVIEW) {
        if (role === ROLES.SUPERVISOR) {
            const canApprove = isSupervisorSigned;
            return (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mt-6 animate-in fade-in">
                    <h4 className="text-orange-900 font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" /> Revisión Requerida
                    </h4>
                    <p className="text-sm text-orange-700 mb-4">
                        El técnico ha completado esta sección. Revise los datos y firme para aprobar.
                    </p>

                    <button
                        onClick={onApprove}
                        disabled={!canApprove}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${canApprove
                                ? 'bg-[#009A93] hover:bg-[#007f7a] text-white shadow-lg shadow-teal-100'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {canApprove ? <><Unlock className="w-5 h-5" /> Aprobar y Desbloquear Siguiente</> : 'Firme para Aprobar'}
                    </button>
                </div>
            );
        } else {
            return (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full"><Clock className="w-5 h-5 text-orange-600" /></div>
                    <div>
                        <h4 className="text-orange-900 font-bold text-sm">En Revisión</h4>
                        <p className="text-orange-600 text-xs">Esperando aprobación del supervisor.</p>
                    </div>
                </div>
            );
        }
    }

    // 4. APPROVED STATE
    if (status === WORKFLOW_STATUS.APPROVED) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-center text-green-700 gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm">Sección Completada y Aprobada</span>
            </div>
        );
    }

    return null;
}
