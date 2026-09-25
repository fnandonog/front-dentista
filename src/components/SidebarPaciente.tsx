import { useState } from "react";
import { LayoutGrid, Calendar, CalendarSearch, Bot, User } from "lucide-react";
import { NavItem } from "./ui/NavItem";

export function SidebarPaciente() {
  // Define o item ativo padrão (ex: 'agendar')
  const [activeItem, setActiveItem] = useState("agendar");

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-neutral-border p-6 flex flex-col gap-6 select-none shrink-0">
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
          onClick={() => setActiveItem("inicio")}
        />

        <NavItem
          label="Agendar Consulta"
          icon={Calendar}
          isActive={activeItem === "agendar"}
          onClick={() => setActiveItem("agendar")}
        />

        <NavItem
          label="Agendamentos"
          icon={CalendarSearch}
          isActive={activeItem === "agendamentos"}
          onClick={() => setActiveItem("agendamentos")}
        />

        <NavItem
          label="Chatbot IA"
          icon={Bot}
          isActive={activeItem === "chatbot"}
          onClick={() => setActiveItem("chatbot")}
        />

        <NavItem
          label="Meu Perfil"
          icon={User}
          isActive={activeItem === "perfil"}
          onClick={() => setActiveItem("perfil")}
        />
      </nav>
    </aside>
  );
}
