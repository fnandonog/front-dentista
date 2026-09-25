import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  // Gera um ID automático se não for passado nenhum
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {/* Rótulo superior (Label) */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-small font-semibold text-neutral-dark font-main"
        >
          {label}
        </label>
      )}

      {/* Campo de Entrada */}
      <input
        id={inputId}
        className={`w-full px-5 py-3.5 bg-white border border-neutral-border rounded-2xl text-neutral-dark text-body-medium placeholder:text-neutral-gray font-main focus:outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-light transition-all ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />

      {/* Mensagem de Erro / Validação */}
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
}
