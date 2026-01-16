import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Construction, FileText, Wrench, Microscope } from "lucide-react"
import TechnicianForm from "./TechnicianForm"
import R3EvaluationForm from "./forms/R3EvaluationForm"
import R7AssemblyForm from "./forms/R7AssemblyForm"

export default function GenericFormPage() {
    const navigate = useNavigate()
    const { formId } = useParams()
    const [subForm, setSubForm] = useState(null) // 'r3' or 'r7'

    // 1. AST Special Route
    if (formId === 'ast') {
        return <TechnicianForm onBack={() => window.history.back()} />
    }

    // 2. R3/R7 Special Logic
    if (formId === 'r3r7') {
        if (subForm === 'r3') return <R3EvaluationForm onBack={() => setSubForm(null)} />
        if (subForm === 'r7') return <R7AssemblyForm onBack={() => setSubForm(null)} />

        // Selector 
        return (
            <div className="min-h-screen bg-gray-50 font-sans p-4 flex flex-col items-center justify-center">
                <button onClick={() => window.history.back()} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm text-gray-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 font-brand mb-8">Seleccione Formulario</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
                    <button
                        onClick={() => setSubForm('r3')}
                        className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all group text-left"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Microscope className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">R3 - Evaluación</h2>
                        <p className="text-gray-500 text-sm">Inspección de llegadas, desarme, metrología y diagnóstico de fallas.</p>
                    </button>

                    <button
                        onClick={() => setSubForm('r7')}
                        className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-[#E42313] transition-all group text-left"
                    >
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Wrench className="w-8 h-8 text-[#E42313]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">R7 - Armado</h2>
                        <p className="text-gray-500 text-sm">Protocolo de ensamblaje, control de juegos axiales, torques y pruebas finales.</p>
                    </button>
                </div>
            </div>
        )
    }

    // Map IDs to Names for better UX
    const formNames = {
        permiso: "Permiso de Trabajo",
        incidente: "Reporte de Incidente",
        observacion: "Observación de Seguridad",
        residuos: "Gestión de Residuos",
        ambiental: "Control Ambiental",
        "inspeccion-amb": "Inspección Ambiental",
        r3r7: "R3-R7 Operaciones",
        inspeccion: "Inspección Diaria",
        checklist: "Checklist de Calidad"
    }

    const formName = formNames[formId] || "Formulario"

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-[#575756] p-4 md:p-8 flex flex-col items-center justify-center text-center">

            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="w-10 h-10 text-gray-400" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 font-brand mb-2">{formName}</h1>
                <p className="text-gray-500 mb-8">
                    Este formulario está en desarrollo. Pronto podrás completarlo digitalmente aquí.
                </p>

                <div className="space-y-3">
                    <button className="w-full bg-[#E42313] hover:bg-[#c41e11] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-red-100">
                        Notificar cuando esté listo
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-100 transition-colors"
                    >
                        Volver
                    </button>
                </div>
            </div>

            <div className="mt-8 text-sm text-gray-400 font-medium">
                ID: {formId}
            </div>

        </div>
    )
}
