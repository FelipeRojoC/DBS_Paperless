import { useNavigate, useParams } from "react-router-dom"
import {
    ArrowLeft, Printer, Download, User, MapPin, Calendar, Clock,
    AlertTriangle, Camera, FileText, CheckCircle, XCircle
} from "lucide-react"

export default function FormDetailPage({ isManager = false }) {
    const navigate = useNavigate()
    const { formId } = useParams()

    const formData = {
        id: formId || "AST-2026-0045",
        type: "AST",
        title: "Mantenimiento Reductor Principal",
        status: "pending",
        author: "Carlos Méndez",
        authorRole: "Técnico Mecánico",
        area: "Taller Mecánico",
        location: "Nave 2 - Sector B",
        createdAt: "13/01/2026 08:30",
        updatedAt: "13/01/2026 10:15",
        description: "Análisis de seguridad para el mantenimiento preventivo del reductor principal de la línea de producción #3. Incluye cambio de aceite, revisión de sellos y ajuste de acoplamientos.",
        risks: [
            { id: 1, description: "Atrapamiento en partes móviles", severity: "Alta", control: "Bloqueo LOTO del equipo" },
            { id: 2, description: "Contacto con aceite caliente", severity: "Media", control: "EPP térmico, esperar enfriamiento" },
        ],
        epp: ["Casco", "Gafas de seguridad", "Guantes mecánicos", "Zapatos de seguridad"],
        signatures: [
            { role: "Técnico Ejecutor", name: "Carlos Méndez", signed: true, date: "13/01/2026 09:45" },
            { role: "Supervisor", name: null, signed: false, date: null },
        ],
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-[#575756] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900 font-brand">{formData.id}</h1>
                                <span className="px-2 py-0.5 text-xs font-bold rounded bg-gray-200 text-gray-700">{formData.type}</span>
                                <StatusBadge status={formData.status} />
                            </div>
                            <p className="text-gray-500">{formData.title}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-700">
                            <Printer className="w-4 h-4" /> Imprimir
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-700">
                            <Download className="w-4 h-4" /> PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* General Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Información General</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <InfoItem icon={User} label="Autor" value={formData.author} sub={formData.authorRole} />
                                <InfoItem icon={MapPin} label="Ubicación" value={formData.area} sub={formData.location} />
                                <InfoItem icon={Calendar} label="Creado" value={formData.createdAt} />
                                <InfoItem icon={Clock} label="Actualizado" value={formData.updatedAt} />
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase">Descripción</p>
                                <p className="mt-1 text-sm leading-relaxed">{formData.description}</p>
                            </div>
                        </div>

                        {/* Risks */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" /> Identificación de Riesgos
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 rounded-l-lg">Riesgo</th>
                                            <th className="px-4 py-2">Severidad</th>
                                            <th className="px-4 py-2 rounded-r-lg">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {formData.risks.map(risk => (
                                            <tr key={risk.id}>
                                                <td className="px-4 py-3 font-medium">{risk.description}</td>
                                                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-bold">{risk.severity}</span></td>
                                                <td className="px-4 py-3 text-gray-600">{risk.control}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* EPP & Photos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-3">EPP Requerido</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.epp.map(item => (
                                        <span key={item} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Camera className="w-4 h-4" /> Evidencias
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-sm text-gray-500">
                                    3 archivos adjuntos
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        {/* Signatures */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Firmas</h3>
                            <div className="space-y-4">
                                {formData.signatures.map(sig => (
                                    <div key={sig.role} className={`p-3 rounded-xl border ${sig.signed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase">{sig.role}</p>
                                            {sig.signed ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-gray-400" />}
                                        </div>
                                        {sig.signed ? (
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{sig.name}</p>
                                                <p className="text-xs text-green-700">{sig.date}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">Pendiente</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Manager Actions */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
                            {isManager ? (
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> Aprobar
                                    </button>
                                    <button className="w-full py-3 bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                        <XCircle className="w-5 h-5" /> Rechazar
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm border border-yellow-200">
                                    <p className="font-bold mb-1">Esperando Aprobación</p>
                                    Este formulario está siendo revisado por su supervisor.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    const config = {
        pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700", icon: Clock },
        approved: { label: "Aprobado", className: "bg-green-100 text-green-700", icon: CheckCircle },
    }[status] || { label: status, className: "bg-gray-100 text-gray-700", icon: null }

    const Icon = config.icon

    return (
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${config.className}`}>
            {Icon && <Icon className="w-3 h-3" />} {config.label}
        </span>
    )
}

function InfoItem({ icon: Icon, label, value, sub }) {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
                {sub && <p className="text-xs text-gray-500">{sub}</p>}
            </div>
        </div>
    )
}
