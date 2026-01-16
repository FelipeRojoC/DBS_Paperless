import { useNavigate } from "react-router-dom"
import {
    Bell, LogOut, CheckCircle, Clock, AlertTriangle,
    FileText, BarChart3, Users, ChevronRight
} from "lucide-react"
import FormsListPage from "./FormsListPage"
import { useState } from "react"

export default function SupervisorDashboard() {
    const navigate = useNavigate()
    const [view, setView] = useState("dashboard")

    // Get user from localStorage
    const userName = localStorage.getItem("dbs_user_name") || "Administrador"
    const userInitials = userName.slice(0, 2).toUpperCase()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#575756]">

            {/* Header - Reuse or Componentize later */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img src="/dbs-logo.png" alt="DBS" className="h-full w-full object-contain" />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-gray-900 font-brand tracking-tight">DBS Paperless</h1>
                            <p className="text-xs text-gray-500 font-medium">Panel de Supervisión</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500">Gerente de Planta</p>
                            </div>
                            <div className="w-10 h-10 bg-[#001e2b] text-white rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-sm font-bold">{userInitials}</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                                title="Salir"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                        { id: 'approvals', label: 'Aprobaciones Pendientes', icon: Clock },
                        { id: 'all-forms', label: 'Historial de Formularios', icon: FileText },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${view === tab.id
                                ? 'border-[#009A93] text-[#009A93] bg-[#009A93]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.id === 'approvals' && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">3</span>
                            )}
                        </button>
                    ))}
                </div>

                {view === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <KPICard title="Pendientes de Firma" value="3" icon={Clock} color="text-yellow-600" bg="bg-yellow-50" />
                            <KPICard title="Aprobados Hoy" value="12" icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
                            <KPICard title="Rechazados (Mes)" value="5" icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
                            <KPICard title="Total Activos" value="45" icon={Users} color="text-blue-600" bg="bg-blue-50" />
                        </div>

                        {/* Recent Approvals Needed */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 font-brand">Requieren tu Atención</h3>
                                <button onClick={() => setView('approvals')} className="text-sm font-bold text-[#009A93] hover:underline flex items-center gap-1">
                                    Ver todos <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Reusing FormsListPage in 'embedded' mode/style? Or just listing top 3 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="divide-y divide-gray-50">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">JS</div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Permiso de Altura - Nave 3</p>
                                                    <p className="text-xs text-gray-500">Juan Soto • Hace 2 horas</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-[#009A93] text-white text-sm font-bold rounded-lg hover:bg-[#007F7A] transition-colors">
                                                Revisar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'approvals' && (
                    <FormsListPage showOnlyMine={false} />
                )}

                {view === 'all-forms' && (
                    <FormsListPage showOnlyMine={false} />
                )}
            </main>
        </div>
    )
}

function KPICard({ title, value, icon: Icon, color, bg }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-bold text-gray-500 mb-1">{title}</p>
                <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    )
}
