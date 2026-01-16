import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Shield, Leaf, Ribbon, Plus, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export default function CategoryPage() {
    const navigate = useNavigate()
    const { categoryId } = useParams()

    const categoryData = {
        seguridad: {
            title: "Seguridad",
            description: "Formularios de Seguridad y Salud Ocupacional",
            icon: Shield,
            color: "text-[#E42313]",
            bgColor: "bg-red-50",
            forms: [
                { id: "ast", name: "AST - Análisis Seguro de Trabajo", description: "Identificación de peligros y controles.", required: true },
                { id: "permiso", name: "Permiso de Trabajo", description: "Autorización para trabajos de alto riesgo.", required: true },
                { id: "incidente", name: "Reporte de Incidente", description: "Registro de accidentes y condiciones.", required: false },
                { id: "observacion", name: "Observación de Seguridad", description: "Registro de observaciones preventivas.", required: false },
            ],
            recent: [
                { id: "AST-2026-0045", title: "Mantenimiento Reductor", status: "pending", date: "Hace 2 horas" },
                { id: "PER-2026-0034", title: "Trabajo en Altura", status: "rejected", date: "Hace 1 día" },
            ],
        },
        medioambiente: {
            title: "Medio Ambiente",
            description: "Formularios de Gestión Ambiental",
            icon: Leaf,
            color: "text-[#009A93]",
            bgColor: "bg-teal-50",
            forms: [
                { id: "residuos", name: "Gestión de Residuos", description: "Control y clasificación de residuos.", required: true },
                { id: "ambiental", name: "Control Ambiental", description: "Monitoreo de emisiones y efluentes.", required: false },
                { id: "inspeccion-amb", name: "Inspección Ambiental", description: "Verificación de cumplimiento.", required: false },
            ],
            recent: [
                { id: "RES-2026-0023", title: "Retiro Residuos", status: "approved", date: "Ayer" },
            ],
        },
        calidad: {
            title: "Calidad",
            description: "Formularios de Sistema de Gestión de Calidad",
            icon: Ribbon,
            color: "text-sky-600",
            bgColor: "bg-sky-50",
            forms: [
                { id: "r3r7", name: "R3-R7 Operaciones", description: "Registro de operaciones de manufactura.", required: true },
                { id: "inspeccion", name: "Inspección Diaria", description: "Checklist de verificación de equipos.", required: true },
                { id: "checklist", name: "Checklist de Calidad", description: "Control de calidad de productos.", required: false },
            ],
            recent: [
                { id: "R7-2026-0123", title: "Operación Torno CNC", status: "approved", date: "Hace 4 horas" },
            ],
        },
    }

    const data = categoryData[categoryId] || categoryData.seguridad
    const Icon = data.icon

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-[#575756] p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <button
                        onClick={() => navigate('/technician')}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#E42313] transition-colors mb-6 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al Dashboard
                    </button>

                    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className={`w-16 h-16 rounded-2xl ${data.bgColor} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-8 h-8 ${data.color}`} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-brand">{data.title}</h1>
                            <p className="text-gray-500 mt-1">{data.description}</p>
                        </div>
                    </div>
                </div>

                {/* Forms Grid */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-brand">Selecciona el Formulario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.forms.map((form) => (
                            <button
                                key={form.id}
                                onClick={() => navigate(`/technician/forms/${form.id}`)}
                                className="group bg-white border-2 border-transparent hover:border-gray-200 hover:shadow-lg rounded-2xl p-5 transition-all text-left flex items-start gap-4 ring-offset-2 focus:ring-2 focus:ring-[#E42313] outline-none"
                            >
                                <div className={`p-3 rounded-xl ${data.bgColor} group-hover:scale-110 transition-transform`}>
                                    <Plus className={`w-6 h-6 ${data.color}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-bold text-gray-900 group-hover:text-[#E42313] transition-colors">{form.name}</h4>
                                        {form.required && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-50 text-red-600 border border-red-100 uppercase tracking-wide">
                                                Obligatorio
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{form.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-brand">Recientes en {data.title}</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {data.recent.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-gray-100 text-gray-500">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow">
                                        <h5 className="text-sm font-bold text-gray-900">{item.title}</h5>
                                        <p className="text-xs text-gray-500">{item.id} • {item.date}</p>
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    const config = {
        pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
        approved: { label: "Aprobado", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
        rejected: { label: "Rechazado", className: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle },
    }[status] || { label: status, className: "bg-gray-100 text-gray-700", icon: FileText }

    const Icon = config.icon

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${config.className}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    )
}
