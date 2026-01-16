import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Filter, ChevronDown, Eye, Download, Trash2, Copy,
    Clock, CheckCircle, AlertTriangle, FileText, ArrowLeft
} from "lucide-react"

const allForms = [
    { id: "AST-2026-0045", type: "AST", title: "Mantenimiento Reductor Principal", status: "pending", author: "Carlos Méndez", area: "Taller Mecánico", date: "13/01/2026", isMine: true },
    { id: "R7-2026-0123", type: "R3-R7", title: "Operación Torno CNC #3", status: "approved", author: "María González", area: "Mecanizado", date: "13/01/2026", isMine: true },
    { id: "INS-2026-0089", type: "Inspección", title: "Checklist Diario - Área Soldadura", status: "approved", author: "Pedro Silva", area: "Soldadura", date: "12/01/2026", isMine: false },
    { id: "INC-2026-0012", type: "Incidente", title: "Cuasi-accidente Zona de Carga", status: "pending", author: "Ana Torres", area: "Logística", date: "12/01/2026", isMine: false },
    { id: "PER-2026-0034", type: "Permiso", title: "Trabajo en Altura - Puente Grúa", status: "rejected", author: "Luis Vargas", area: "Mantenimiento", date: "11/01/2026", isMine: true },
    { id: "AST-2026-0044", type: "AST", title: "Cambio de Rodamientos Motor #5", status: "approved", author: "Roberto Díaz", area: "Taller Mecánico", date: "11/01/2026", isMine: false },
]

export default function FormsListPage({ showOnlyMine = false }) {
    const navigate = useNavigate()
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const filteredForms = allForms.filter((form) => {
        if (showOnlyMine && !form.isMine) return false
        if (statusFilter !== "all" && form.status !== statusFilter) return false
        if (typeFilter !== "all" && form.type !== typeFilter) return false
        return true
    })

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-[#575756] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-gray-500 hover:text-[#E42313] transition-colors mb-2 font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 font-brand">
                            {showOnlyMine ? "Mis Formularios" : "Gestión de Formularios"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{filteredForms.length} documentos encontrados</p>
                    </div>

                    <div className="flex gap-2 relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 text-sm font-medium"
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                                        >
                                            <option value="all">Todos</option>
                                            <option value="pending">Pendientes</option>
                                            <option value="approved">Aprobados</option>
                                            <option value="rejected">Rechazados</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                                        <select
                                            value={typeFilter}
                                            onChange={(e) => setTypeFilter(e.target.value)}
                                            className="w-full mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                                        >
                                            <option value="all">Todos</option>
                                            <option value="AST">AST</option>
                                            <option value="R3-R7">R3-R7</option>
                                            <option value="Inspección">Inspección</option>
                                            <option value="Permiso">Permiso</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID / Tipo</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Título</th>
                                    {!showOnlyMine && <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Autor</th>}
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Área</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredForms.map((form) => (
                                    <tr
                                        key={form.id}
                                        onClick={() => navigate(`/forms/${form.id}`)}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-mono text-gray-900 font-medium">{form.id}</span>
                                                <span className="inline-flex mt-1">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600 uppercase tracking-wide">
                                                        {form.type}
                                                    </span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 group-hover:text-[#E42313] transition-colors">{form.title}</span>
                                        </td>
                                        {!showOnlyMine && (
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{form.author}</span>
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">{form.area}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">{form.date}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={form.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button title="Ver Detalle" className="p-2 text-gray-400 hover:text-[#009A93] hover:bg-[#009A93]/10 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button title="Descargar" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredForms.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No se encontraron formularios.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    const config = {
        pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700 border border-yellow-200", icon: Clock },
        approved: { label: "Aprobado", className: "bg-green-100 text-green-700 border border-green-200", icon: CheckCircle },
        rejected: { label: "Rechazado", className: "bg-red-100 text-red-700 border border-red-200", icon: AlertTriangle },
    }[status] || { label: status, className: "bg-gray-100 text-gray-700", icon: null }

    const Icon = config.icon

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${config.className}`}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {config.label}
        </span>
    )
}
