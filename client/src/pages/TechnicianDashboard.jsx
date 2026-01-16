import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { formService } from "../services/api"
import { Shield, Leaf, Ribbon, FileText, Clock, CheckCircle, Search, Bell, Menu, User, ChevronRight, LogOut, Plus } from "lucide-react"

export default function TechnicianDashboard() {
    const navigate = useNavigate()
    // Get user from localStorage or default
    const userName = localStorage.getItem("dbs_user_name") || "Juan Rodríguez"
    const userRole = localStorage.getItem("dbs_user_role") || "Técnico Mecánico"
    const userInitials = userName.slice(0, 2).toUpperCase()
    const [recentForms, setRecentForms] = useState([])

    const handleLogout = () => {
        localStorage.removeItem("dbs_user_tokan"); // Typo in original login? Standardize
        localStorage.removeItem("dbs_user_name");
        localStorage.removeItem("dbs_user_role");
        localStorage.removeItem("token"); // Just in case
        navigate('/login');
    };

    const isSupervisor = userRole.toLowerCase().includes('supervisor') || userRole.toLowerCase().includes('jefe');

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const forms = await formService.getSubmissions()
                setRecentForms(forms)
            } catch (error) {
                console.error("Failed to fetch forms", error)
            }
        }
        fetchForms()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#575756]">

            {/* Top Navigation Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img src="/dbs-logo.png" alt="DBS" className="h-full w-full object-contain" />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-gray-900 font-brand tracking-tight">DBS Paperless</h1>
                            <p className="text-xs text-gray-500 font-medium">Sistema EHS / SGI</p>
                        </div>
                    </div>

                    {/* Right: User Profile & Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>

                        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500">{userRole}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${isSupervisor ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                <span className="text-sm font-bold">{userInitials}</span>
                            </div>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors ml-2" title="Cerrar Sesión">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

                {/* Greeting Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 font-brand">
                            ¡Hola, {userName.split(' ')[0]}!
                        </h2>
                        <p className="text-lg text-gray-500 mt-1">
                            ¿Qué formulario necesitas crear hoy?
                        </p>
                    </div>
                    <div>
                        {/* Optional: Date or Weather widget */}
                        <p className="text-sm font-medium text-gray-400">
                            15 de Enero, 2026
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-100 transition-all">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Mis Formularios</p>
                            <p className="text-4xl font-extrabold text-[#000000]">18</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#F7AB59] transition-all">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Pendientes de Firma</p>
                            <p className="text-4xl font-extrabold text-[#F7AB59]">3</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F7AB59] group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-green-400 transition-all">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Aprobados</p>
                            <p className="text-4xl font-extrabold text-green-500">12</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Create New Form Section */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 font-brand flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[#E42313]" />
                        Crear Nuevo Formulario
                    </h3>

                    {/* Responsive Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Card 1: Seguridad (Red) */}
                        <div
                            onClick={() => navigate('/technician/category/seguridad')}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-[#E42313] transition-colors duration-300">
                                <Shield className="w-7 h-7 text-[#E42313] group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2 font-brand group-hover:text-[#E42313] transition-colors">Seguridad</h4>
                            <p className="text-sm text-gray-500 mb-6 h-10">AST, Permisos de Trabajo, Incidentes, Observaciones.</p>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); window.open('https://share.teamforms.app/form/NThlMzdiMmYtZWNiYi00MmRlLTllNDYtZDdjNWEwYTFjYTY0OjcwMzg4MWYxLTRhOGQtNDBjYy1hMjI3LTYxODE3ZTUxMzI4YTo1ZjdhNGMxOC1mMmEyLTQ2MjMtODJlOC0wZjM0NTJlNTQ4ZmE=', '_blank'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-[#E42313] hover:text-white hover:border-[#E42313] transition-all"
                                >
                                    AST
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/technician/forms/permiso'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-[#E42313] hover:text-white hover:border-[#E42313] transition-all"
                                >
                                    Permiso de Trabajo
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/technician/forms/incidente'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-[#E42313] hover:text-white hover:border-[#E42313] transition-all"
                                >
                                    Reporte
                                </button>
                            </div>
                        </div>

                        {/* Card 2: Medio Ambiente (Green/Teal for DBS) */}
                        <div
                            onClick={() => navigate('/technician/category/medioambiente')}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:bg-[#009A93] transition-colors duration-300">
                                <Leaf className="w-7 h-7 text-[#009A93] group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2 font-brand group-hover:text-[#009A93] transition-colors">Medio Ambiente</h4>
                            <p className="text-sm text-gray-500 mb-6 h-10">Gestión de Residuos, Control Ambiental, Inspecciones.</p>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/technician/forms/residuos'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-[#009A93] hover:text-white hover:border-[#009A93] transition-all"
                                >
                                    Gestión Residuos
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/technician/forms/ambiental'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-[#009A93] hover:text-white hover:border-[#009A93] transition-all"
                                >
                                    Control
                                </button>
                            </div>
                        </div>

                        {/* Card 3: Calidad (Blue/Teal) */}
                        <div
                            onClick={() => navigate('/technician/category/calidad')}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors duration-300">
                                <Ribbon className="w-7 h-7 text-sky-500 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2 font-brand group-hover:text-sky-500 transition-colors">Calidad</h4>
                            <p className="text-sm text-gray-500 mb-6 h-10">R3-R7 Operaciones, Inspecciones, Checklist Diario.</p>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); window.open('https://share.teamforms.app/form/NjhlYzlhNDEtOTQyOC00ZmI1LWE5MGItZTRlMGEyZTJjN2U3OjcwMzg4MWYxLTRhOGQtNDBjYy1hMjI3LTYxODE3ZTUxMzI4YTpjNjRkM2YxMC0xNDdkLTQwMDgtOWFkMi05OWM1NzQwMWYyNTk=', '_blank'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                                >
                                    R3
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/technician/r7'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                                >
                                    R7
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/technician/forms/inspeccion'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                                >
                                    Inspección
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/technician/forms/checklist'); }}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                                >
                                    Checklist
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 font-brand">Actividad Reciente</h3>
                        <button className="text-sm text-[#E42313] font-semibold hover:underline">Ver todo</button>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {recentForms.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <p>No hay formularios recientes</p>
                            </div>
                        ) : (
                            recentForms.map((form) => (
                                <div key={form.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 cursor-pointer min-h-[72px]">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-grow">
                                        <h5 className="text-base font-bold text-gray-900">{form.form_data?.title || "Formulario Sin Título"}</h5>
                                        <p className="text-sm text-gray-500">
                                            {new Date(form.created_at).toLocaleDateString()} • {form.form_name || 'AST'}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${form.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                        form.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                                        } shrink-0`}>
                                        {form.status === 'approved' ? 'Aprobado' :
                                            form.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-gray-300" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </main>
        </div>
    )
}
