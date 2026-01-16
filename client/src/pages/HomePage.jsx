import { useNavigate } from "react-router-dom"
import { Shield, HardHat, BarChart3, ChevronRight } from "lucide-react"

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8 font-sans">

            {/* Import Montserrat locally if not globally available, though it should be in App/index */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Myriad+Pro:wght@400;600&display=swap');
        .font-brand { font-family: 'Montserrat', sans-serif; }
      `}</style>

            {/* Background Decor - Subtle DBS Red accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#E42313] z-50"></div>

            <div className="z-10 w-full max-w-5xl text-center space-y-2 md:space-y-4 flex-grow flex flex-col justify-center">

                {/* Header Section */}
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {/* Logo - Unboxed and Clean */}
                        <img
                            src="/dbs-logo.png"
                            alt="DBS Logo"
                            className="h-8 md:h-12 w-auto object-contain mb-2 hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#000000] mb-2 font-brand tracking-tight">
                        DBS Paperless
                    </h1>
                    <p className="text-[#575756] text-xl md:text-2xl font-medium tracking-wide">
                        Sistema EHS / SGI Digital
                    </p>
                </div>

                <div className="w-24 h-1 bg-[#E42313] mx-auto rounded-full opacity-80"></div>
            </div>

            {/* Selection Area */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                <h2 className="text-2xl md:text-3xl font-bold text-[#575756] font-brand">
                    Selecciona tu perfil
                </h2>

                {/* Cards Container */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto px-2">

                    {/* Technician Card */}
                    <button
                        onClick={() => navigate('/technician')}
                        className="group relative bg-white border-2 border-gray-100 hover:border-[#F7AB59] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(247,171,89,0.3)] hover:-translate-y-1 flex flex-col items-center text-center h-full ring-offset-2 focus:ring-2 focus:ring-[#F7AB59] outline-none"
                    >
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronRight className="w-6 h-6 text-[#F7AB59]" />
                        </div>

                        <div className="mb-6 p-5 rounded-2xl bg-[#F7AB59]/10 group-hover:bg-[#F7AB59] transition-colors duration-300">
                            <HardHat className="w-12 h-12 md:w-14 md:h-14 text-[#F7AB59] group-hover:text-white transition-colors duration-300" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-[#000000] mb-3 font-brand group-hover:text-[#F7AB59] transition-colors">
                            Técnico / Mecánico
                        </h3>

                        <p className="text-[#575756] text-base md:text-lg mb-8 leading-relaxed font-medium">
                            Crear formularios, ver estado de firmas y gestionar documentos.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 w-full text-left space-y-2 border border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-[#575756] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E42313]"></div>
                                Crear AST, R3-R7, Inspecciones
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#575756] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E42313]"></div>
                                Ver mis formularios
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#575756] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E42313]"></div>
                                Seguimiento de aprobaciones
                            </div>
                        </div>
                    </button>

                    {/* Supervisor Card */}
                    <button
                        onClick={() => navigate('/supervisor')}
                        className="group relative bg-white border-2 border-gray-100 hover:border-[#009A93] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,154,147,0.3)] hover:-translate-y-1 flex flex-col items-center text-center h-full ring-offset-2 focus:ring-2 focus:ring-[#009A93] outline-none"
                    >
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronRight className="w-6 h-6 text-[#009A93]" />
                        </div>

                        <div className="mb-6 p-5 rounded-2xl bg-[#009A93]/10 group-hover:bg-[#009A93] transition-colors duration-300">
                            <BarChart3 className="w-12 h-12 md:w-14 md:h-14 text-[#009A93] group-hover:text-white transition-colors duration-300" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-[#000000] mb-3 font-brand group-hover:text-[#009A93] transition-colors">
                            Supervisor / Gerencia
                        </h3>

                        <p className="text-[#575756] text-base md:text-lg mb-8 leading-relaxed font-medium">
                            Dashboard KPIs, aprobar formularios, reportes y estadísticas.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 w-full text-left space-y-2 border border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-[#575756] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#009A93]"></div>
                                Dashboard con métricas
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#575756] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#009A93]"></div>
                                Aprobar/Rechazar formularios
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#575756] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#009A93]"></div>
                                Reportes y estadísticas
                            </div>
                        </div>
                    </button>

                </div>
            </div>

            {/* Footer */}
            <div className="w-full text-center py-6 mt-auto">
                <p className="text-sm font-bold text-[#575756]/60">
                    David Brown Santasalo Chile © 2026
                </p>
            </div>
        </div>
    )
}
