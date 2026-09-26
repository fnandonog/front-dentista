export type StatusType = "confirmada" | "pendente" | "concluida";

interface BadgeProps {
  status: StatusType;
  className?: string;
}

export function Badge({ status, className = "" }: BadgeProps) {
  // Configuração das cores e textos de cada variação
  const statusConfig = {
    confirmada: {
      label: "Confirmada",
      styles: "bg-[#EAF6ED] text-[#2D7A3A]", // Verde suave + texto verde
    },
    pendente: {
      label: "Pendente",
      styles: "bg-[#FFF0E9] text-[#E8A589]", // Laranja suave + texto secundário
    },
    concluida: {
      label: "Concluída",
      styles: "bg-[#F4F6F8] text-[#8A94A6]", // Cinza claro + texto cinza neutro
    },
  };

  const current = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center justify-center px-6 py-2 rounded-full font-semibold text-body-small font-main transition-colors select-none ${current.styles} ${className}`}
    >
      {current.label}
    </span>
  );
}
