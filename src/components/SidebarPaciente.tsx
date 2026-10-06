import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Calendar, CalendarSearch, Bot, User, LogOut } from "lucide-react";
import { NavItem } from "./ui/NavItem";

export type AbaPaciente = "inicio" | "agendar" | "agendamentos" | "chatbot" | "perfil";

interface SidebarPacienteProps {
  activeItem?: AbaPaciente;
  onNavigate?: (aba: AbaPaciente) => void;
}

export function SidebarPaciente({ activeItem, onNavigate }: SidebarPacienteProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapeia a URL atual para a aba ativa caso activeItem não seja passado
  const getCurrentActive = (): AbaPaciente => {
    if (activeItem) return activeItem;
    if (location.pathname.includes("/agendar")) return "agendar";
    if (location.pathname.includes("/meus-agendamentos")) return "agendamentos";
    if (location.pathname.includes("/perfil")) return "perfil";
    return "agendamentos";
  };

  const currentTab = getCurrentActive();

  const handleItemClick = (aba: AbaPaciente) => {
    if (onNavigate) {
      onNavigate(aba);
      return;
    }

    switch (aba) {
      case "inicio":
      case "agendamentos":
        navigate("/meus-agendamentos");
        break;
      case "agendar":
        navigate("/agendar");
        break;
      case "perfil":
        navigate("/perfil");
        break;
      case "chatbot":
        // Pode abrir modal ou navegar se tiver rota
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("@clinica:token");
    navigate("/login");
  };

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-neutral-border p-6 flex flex-col justify-between select-none shrink-0 sticky top-0">
      <div className="space-y-6">
        {/* Título / Marca */}
        <div className="pt-2 pb-4 text-center border-b border-neutral-border">
          <h2 className="text-body-medium font-bold text-neutral-dark font-main tracking-tight">
            Dra. Thais Tardelli
          </h2>
          <p className="text-[10px] text-neutral-gray tracking-widest uppercase">Área do Paciente</p>
        </div>

        {/* Menus de Navegação */}
        <nav className="flex flex-col gap-2">
          <NavItem
            label="Início"
            icon={LayoutGrid}
            isActive={currentTab === "inicio"}
            onClick={() => handleItemClick("inicio")}
          />

          <NavItem
            label="Agendar Consulta"
            icon={Calendar}
            isActive={currentTab === "agendar"}
            onClick={() => handleItemClick("agendar")}
          />

          <NavItem
            label="Agendamentos"
            icon={CalendarSearch}
            isActive={currentTab === "agendamentos"}
            onClick={() => handleItemClick("agendamentos")}
          />

          <NavItem
            label="Chatbot IA"
            icon={Bot}
            isActive={currentTab === "chatbot"}
            onClick={() => handleItemClick("chatbot")}
          />

          <NavItem
            label="Meu Perfil"
            icon={User}
            isActive={currentTab === "perfil"}
            onClick={() => handleItemClick("perfil")}
          />
        </nav>
      </div>

      {/* Botão de Sair (Logout) */}
      <div className="pt-4 border-t border-neutral-border/60">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-neutral-gray hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}

export default SidebarPaciente;