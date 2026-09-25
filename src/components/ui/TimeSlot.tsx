import React from "react";

interface TimeSlotProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  time: string;
  isSelected?: boolean;
}

export function TimeSlot({
  time,
  isSelected = false,
  disabled = false,
  className = "",
  ...props
}: TimeSlotProps) {
  // Estilo base comum
  const baseStyles =
    "px-6 py-3.5 rounded-2xl text-body-medium font-semibold font-main transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[100px] select-none";

  // Variantes baseadas na seleção do usuário
  const stateStyles = isSelected
    ? "bg-primary-main text-white shadow-sm"
    : "bg-white text-neutral-dark border border-neutral-border hover:border-primary-main hover:text-primary-main";

  // Estilo para horários indisponíveis/desabilitados
  const disabledStyles = disabled
    ? "opacity-40 cursor-not-allowed bg-neutral-bg text-neutral-gray border-neutral-border hover:border-neutral-border hover:text-neutral-gray"
    : "";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${baseStyles} ${stateStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {time}
    </button>
  );
}
