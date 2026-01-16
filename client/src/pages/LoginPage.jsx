import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { authService } from "../services/api"

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            /* Logic for handler: */
            await authService.login(email, password)
            navigate("/home")
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.message || "Check credentials"))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-[#575756]">

            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-48 mb-6 flex items-center justify-center">
                    <img src="/dbs-logo.png" alt="DBS Paperless" className="w-full h-auto object-contain" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-1 text-gray-900 font-brand">DBS Paperless</h1>
                <p className="text-gray-500 text-sm font-medium">Sistema de Gestión EHS & SGI</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 shadow-xl animate-in fade-in zoom-in duration-500 delay-150">
                <h2 className="text-xl font-bold mb-1 text-gray-900">Iniciar Sesión</h2>
                <p className="text-gray-500 text-sm mb-6">Ingresa tus credenciales corporativas</p>

                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@dbsantasalo.com"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#E42313] focus:ring-1 focus:ring-[#E42313] transition-all placeholder:text-gray-400 font-medium"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#E42313] focus:ring-1 focus:ring-[#E42313] transition-all placeholder:text-gray-400 pr-10 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#E42313] hover:bg-[#c41e11] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-100 hover:shadow-red-200 hover:-translate-y-0.5 mt-2"
                    >
                        Ingresar
                    </button>

                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400 font-bold">O continúa con</span>
                    </div>
                </div>

                {/* Microsoft Button (Fake) */}
                <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 group shadow-sm"
                >
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2 h-2 bg-[#f25022]"></div>
                        <div className="w-2 h-2 bg-[#7fba00]"></div>
                        <div className="w-2 h-2 bg-[#00a4ef]"></div>
                        <div className="w-2 h-2 bg-[#ffb900]"></div>
                    </div>
                    <span>Microsoft 365</span>
                </button>

            </div>

            <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                <p>David Brown Santasalo © 2026</p>
                <p>Sistema Paperless v1.0</p>
            </div>

        </div>
    )
}
