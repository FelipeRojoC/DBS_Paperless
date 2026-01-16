import { useState } from "react"
import {
    ArrowLeft, Save, Send, Shield, AlertTriangle, Plus, Trash2,
    CheckCircle, Camera, PenTool, Calendar, Clock
} from "lucide-react"
import { formService, authService } from "../services/api"
import { useNavigate } from "react-router-dom"

export default function TechnicianForm({ onBack }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: "",
        area: "",
        location: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        description: "",
    })

    const [risks, setRisks] = useState([
        { id: 1, description: "", severity: "Media", control: "" }
    ])

    const [selectedEpp, setSelectedEpp] = useState([])

    const eppOptions = [
        { id: "casco", label: "Casco" },
        { id: "gafas", label: "Gafas de seguridad" },
        { id: "guantes", label: "Guantes" },
        { id: "zapatos", label: "Zapatos de Seguridad" },
        { id: "auditiva", label: "Protección Auditiva" },
        { id: "arnes", label: "Arnés" },
        { id: "mascarilla", label: "Mascarilla" },
        { id: "ignifuga", label: "Ropa Ignífuga" },
    ]

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const addRisk = () => {
        setRisks([...risks, { id: Date.now(), description: "", severity: "Media", control: "" }])
    }

    const removeRisk = (id) => {
        if (risks.length > 1) {
            setRisks(risks.filter(r => r.id !== id))
        }
    }

    const updateRisk = (id, field, value) => {
        setRisks(risks.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    const toggleEpp = (id) => {
        setSelectedEpp(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        )
    }

    const handleSubmit = async () => {
        try {
            const currentUser = authService.getCurrentUser()
            if (!currentUser) {
                alert("Sesión expirada. Por favor inicie sesión nuevamente.")
                return
            }

            const payload = {
                template_id: null, // Should be fetched or passed link prop
                service_order_id: null, // Context needed
                technician_id: currentUser.id,
                form_data: {
                    ...formData,
                    risks,
                    selectedEpp
                }
            }

            await formService.submitForm(payload)
            alert("Formulario enviado exitosamente")
            navigate("/home")
        } catch (error) {
            console.error(error)
            alert("Error al enviar el formulario")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8 font-sans text-[#575756]">

            <div className="w-full max-w-4xl space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-500" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2 rounded-xl">
                                <Shield className="w-8 h-8 text-[#E42313]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 font-brand">AST - Análisis Seguro</h1>
                                <p className="text-gray-500">Nuevo Formulario</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                            <Save className="w-4 h-4" /> Borrador
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-4 py-2 bg-[#E42313] text-white rounded-xl font-bold hover:bg-[#c41e11] shadow-lg shadow-red-100">
                            <Send className="w-4 h-4" /> Enviar
                        </button>
                    </div>
                </div>

                {/* General Information */}
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Información General</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Título del Trabajo</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#E42313] outline-none transition-colors font-medium"
                                placeholder="Ej: Mantenimiento Preventivo Cinta 3"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Área</label>
                            <select
                                value={formData.area}
                                onChange={(e) => handleInputChange('area', e.target.value)}
                                className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#E42313] outline-none font-medium"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="mecanica">Mecánica</option>
                                <option value="electrica">Eléctrica</option>
                                <option value="operaciones">Operaciones</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Ubicación Específica</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#E42313] outline-none font-medium"
                                placeholder="Ej: Nave Principal, Sector B"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Fecha Ejecución</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className="w-full mt-1 pl-10 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#E42313] outline-none font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Hora Inicio</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#E42313] outline-none font-medium text-center"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Hora Fin</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#E42313] outline-none font-medium text-center"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Descripción detallada</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#E42313] outline-none font-medium min-h-[100px]"
                                placeholder="Describa el paso a paso de la actividad..."
                            />
                        </div>
                    </div>
                </section>

                {/* Risks Section */}
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" /> Identificación de Riesgos
                        </h2>
                        <button
                            onClick={addRisk}
                            className="text-xs font-bold text-white bg-gray-900 px-3 py-1.5 rounded-lg hover:bg-black transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Agregar Riesgo
                        </button>
                    </div>

                    <div className="space-y-4">
                        {risks.map((risk, index) => (
                            <div key={risk.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                                <button
                                    onClick={() => removeRisk(risk.id)}
                                    className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-1 flex items-center justify-center md:justify-start">
                                        <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                    </div>

                                    <div className="md:col-span-5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Riesgo</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Caída a mismo nivel"
                                            value={risk.description}
                                            onChange={(e) => updateRisk(risk.id, 'description', e.target.value)}
                                            className="w-full mt-1 p-2 bg-white rounded-lg border border-gray-200 text-sm focus:border-orange-400 outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Severidad</label>
                                        <select
                                            value={risk.severity}
                                            onChange={(e) => updateRisk(risk.id, 'severity', e.target.value)}
                                            className="w-full mt-1 p-2 bg-white rounded-lg border border-gray-200 text-sm focus:border-orange-400 outline-none"
                                        >
                                            <option>Baja</option>
                                            <option>Media</option>
                                            <option>Alta</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-4">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Control</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Orden y Limpieza"
                                            value={risk.control}
                                            onChange={(e) => updateRisk(risk.id, 'control', e.target.value)}
                                            className="w-full mt-1 p-2 bg-white rounded-lg border border-gray-200 text-sm focus:border-orange-400 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* EPP Section */}
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">EPP Requerido</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {eppOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => toggleEpp(option.id)}
                                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-2 ${selectedEpp.includes(option.id)
                                    ? 'border-[#009A93] bg-[#009A93]/10 text-[#009A93]'
                                    : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedEpp.includes(option.id) ? 'border-[#009A93] bg-[#009A93]' : 'border-gray-400'
                                    }`}>
                                    {selectedEpp.includes(option.id) && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Photos & Signature Placeholder */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center cursor-pointer hover:border-blue-300 transition-colors group">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-gray-900">Adjuntar Evidencia</h3>
                        <p className="text-sm text-gray-500 mt-1">Fotos del área o equipos (Máx 5)</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center cursor-pointer hover:border-[#E42313] transition-colors group">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <PenTool className="w-8 h-8 text-[#E42313]" />
                        </div>
                        <h3 className="font-bold text-gray-900">Firmar Documento</h3>
                        <p className="text-sm text-gray-500 mt-1">Firma digital del técnico responsable</p>
                    </div>
                </section>

            </div>
        </div>
    )
}
