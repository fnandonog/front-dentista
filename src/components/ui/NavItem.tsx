import React from "react";
import type { LucideIcon } from "lucide-react";

interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export function NavItem({
  label,
  icon: Icon,
  isActive = false,
  className = "",
  ...props
}: NavItemProps) {
  // Estilo base comum do item
  const baseStyles =
    "flex items-center gap-3.5 px-6 py-4 rounded-2xl font-semibold text-body-medium font-main transition-all duration-200 cursor-pointer w-full text-left select-none";

  // Variantes do Figma: Ativo vs Inativo
  const stateStyles = isActive
    ? "bg-primary-light text-primary-main"
    : "bg-transparent text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark";

  return (
    <button
      type="button"
      className={`${baseStyles} ${stateStyles} ${className}`}
      {...props}
    >
      <Icon className="w-6 h-6 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
