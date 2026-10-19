import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MeusAgendamentos } from "./pages/MeusAgendamentos";
import { AgendarConsulta } from "./pages/AgendarConsulta";
import { MeuPerfil } from "./pages/MeuPerfil";
import { InicioPaciente } from "./pages/InicioPaciente";
import { ChatbotPaciente } from "./pages/ChatbotPaciente";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Área da Clínica */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Área do Paciente */}
        <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
        <Route path="/agendar" element={<AgendarConsulta />} />
        <Route path="/inicio" element={<InicioPaciente />} />
        <Route path="/perfil" element={<MeuPerfil />} />
        <Route path="/chatbot" element={<ChatbotPaciente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;