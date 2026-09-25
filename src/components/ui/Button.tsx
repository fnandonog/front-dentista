import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  // Estilos base comuns a todos os botões
  const baseStyles =
    "px-6 py-3 rounded-lg font-semibold text-body-small transition-colors flex items-center justify-center gap-2 cursor-pointer";

  // Mapeamento das variações de cores do seu Figma
  const variants = {
    primary: "bg-primary-main text-white hover:bg-primary-dark",
    secondary:
      "bg-primary-light text-primary-main hover:bg-primary-main hover:text-white",
    outline:
      "border border-neutral-border text-neutral-dark hover:bg-neutral-bg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
