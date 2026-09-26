import { LayoutGrid, Calendar, CalendarSearch, Bot, User } from "lucide-react";
import { NavItem } from "./ui/NavItem";

// Tipagem das abas disponíveis
export type AbaPaciente = "inicio" | "agendar" | "agendamentos" | "chatbot" | "perfil";

interface SidebarPacienteProps {
  activeItem: AbaPaciente;
  onNavigate: (aba: AbaPaciente) => void;
}

export function SidebarPaciente({ activeItem, onNavigate }: SidebarPacienteProps) {
  return (
    <aside className="w-[260px] h-screen bg-white border-r border-neutral-border p-6 flex flex-col gap-6 select-none shrink-0 sticky top-0">
      {/* Título / Marca */}
      <div className="pt-2 pb-4 text-center border-b border-neutral-border">
        <h2 className="text-body-medium font-bold text-neutral-dark font-main tracking-tight">
          Dra. Thais Tardelli
        </h2>
      </div>

      {/* Menus de Navegação */}
      <nav className="flex flex-col gap-2">
        <NavItem
          label="Início"
          icon={LayoutGrid}
          isActive={activeItem === "inicio"}
          onClick={() => onNavigate("inicio")}
        />

        <NavItem
          label="Agendar Consulta"
          icon={Calendar}
          isActive={activeItem === "agendar"}
          onClick={() => onNavigate("agendar")}
        />

        <NavItem
          label="Agendamentos"
          icon={CalendarSearch}
          isActive={activeItem === "agendamentos"}
          onClick={() => onNavigate("agendamentos")}
        />

        <NavItem
          label="Chatbot IA"
          icon={Bot}
          isActive={activeItem === "chatbot"}
          onClick={() => onNavigate("chatbot")}
        />

        <NavItem
          label="Meu Perfil"
          icon={User}
          isActive={activeItem === "perfil"}
          onClick={() => onNavigate("perfil")}
        />
      </nav>
    </aside>
  );
}