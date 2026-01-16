import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TechnicianDashboard from './pages/TechnicianDashboard'
import CategoryPage from './pages/CategoryPage'
import GenericFormPage from './pages/GenericFormPage'
import SupervisorDashboard from './pages/SupervisorDashboard'
import FormsListPage from './pages/FormsListPage'
import FormDetailPage from './pages/FormDetailPage'

import TechnicianForm from './pages/TechnicianForm'
import R7AssemblyForm from './components/FormEngine/R7AssemblyForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Technician Routes */}
        <Route path="/technician" element={<TechnicianDashboard />} />
        <Route path="/technician/category/:categoryId" element={<CategoryPage />} />
        <Route path="/technician/forms/:formId" element={<GenericFormPage />} />
        <Route path="/technician/ast" element={<TechnicianForm onBack={() => window.history.back()} />} />
        <Route path="/technician/r7" element={<R7AssemblyForm />} />

        {/* Shared / Common Routes */}
        <Route path="/my-forms" element={<FormsListPage showOnlyMine={true} />} />
        <Route path="/forms/:formId" element={<FormDetailPage />} />

        {/* Supervisor Routes */}
        <Route path="/supervisor" element={<SupervisorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App