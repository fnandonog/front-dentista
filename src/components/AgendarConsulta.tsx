import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { TimeSlot } from "./ui/TimeSlot";
import { Button } from "./ui/Button";

interface AgendarConsultaProps {
    onSucesso: () => void;
}

export function AgendarConsulta({ onSucesso }: AgendarConsultaProps) {
    const [procedimento, setProcedimento] = useState("Limpeza / Profilaxia");
    const [diaSelecionado, setDiaSelecionado] = useState<number>(3);
    const [horarioSelecionado, setHorarioSelecionado] = useState<string>("10:00");
    const [modalAberto, setModalAberto] = useState(false);

    // Dias do calendário (Setembro 2026 começa na terça-feira)
    const diasMes = [
        { dia: 30, outroMes: true },
        { dia: 31, outroMes: true },
        { dia: 1, outroMes: false },
        { dia: 2, outroMes: false },
        { dia: 3, outroMes: false },
        { dia: 4, outroMes: false },
        { dia: 5, outroMes: false },
        { dia: 6, outroMes: false },
        { dia: 7, outroMes: false },
        { dia: 8, outroMes: false },
        { dia: 9, outroMes: false },
        { dia: 10, outroMes: false },
        { dia: 11, outroMes: false },
        { dia: 12, outroMes: false },
        { dia: 13, outroMes: false },
        { dia: 14, outroMes: false },
        { dia: 15, outroMes: false },
        { dia: 16, outroMes: false },
        { dia: 17, outroMes: false },
        { dia: 18, outroMes: false },
        { dia: 19, outroMes: false },
        { dia: 20, outroMes: false },
        { dia: 21, outroMes: false },
        { dia: 22, outroMes: false },
        { dia: 23, outroMes: false },
        { dia: 24, outroMes: false },
        { dia: 25, outroMes: false },
        { dia: 26, outroMes: false },
        { dia: 27, outroMes: false },
        { dia: 28, outroMes: false },
        { dia: 29, outroMes: false },
        { dia: 30, outroMes: false },
        { dia: 1, outroMes: true },
        { dia: 2, outroMes: true },
        { dia: 3, outroMes: true },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-dark">Agendar Consulta</h1>
                <p className="text-sm text-neutral-gray mt-1">
                    Escolha o procedimento, a data e o melhor horário para seu atendimento.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Coluna 1: Procedimento e Data */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-6">
                    <h2 className="text-base font-bold text-neutral-dark">1. Procedimento e Data</h2>

                    <div>
                        <label className="block text-xs font-semibold text-neutral-gray mb-2">
                            Procedimento Odontológico
                        </label>
                        <select
                            value={procedimento}
                            onChange={(e) => setProcedimento(e.target.value)}
                            className="w-full px-4 py-3 bg-[#FAFAFB] border border-neutral-border rounded-xl text-sm font-medium text-neutral-dark outline-none focus:border-primary-main cursor-pointer"
                        >
                            <option value="Limpeza / Profilaxia">Limpeza / Profilaxia</option>
                            <option value="Clareamento Dental">Clareamento Dental</option>
                            <option value="Ortodontia & Alinhadores">Ortodontia & Alinhadores</option>
                            <option value="Estética Bucal & Facetas">Estética Bucal & Facetas</option>
                        </select>
                    </div>

                    {/* Calendário */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <button type="button" className="p-1 hover:bg-neutral-bg rounded-lg text-neutral-gray">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="font-bold text-sm text-neutral-dark">Setembro 2026</span>
                            <button type="button" className="p-1 hover:bg-neutral-bg rounded-lg text-neutral-gray">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-gray">
                            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                            {diasMes.map((item, index) => {
                                const isSelected = !item.outroMes && item.dia === diaSelecionado;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={item.outroMes}
                                        onClick={() => setDiaSelecionado(item.dia)}
                                        className={`h-9 w-9 mx-auto flex items-center justify-center rounded-full transition-all ${item.outroMes
                                                ? "text-neutral-gray/40 cursor-default"
                                                : isSelected
                                                    ? "bg-primary-main text-white font-bold shadow-sm"
                                                    : "text-neutral-dark hover:bg-neutral-bg cursor-pointer"
                                            }`}
                                    >
                                        {item.dia}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Horários Disponíveis e Resumo */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-6">
                    <h2 className="text-base font-bold text-neutral-dark">2. Horários Disponíveis</h2>

                    <div>
                        <span className="block text-xs font-semibold text-neutral-gray mb-3">Manhã</span>
                        <div className="grid grid-cols-3 gap-3">
                            {["09:00", "10:00", "10:40"].map((hora) => (
                                <TimeSlot
                                    key={hora}
                                    time={hora}
                                    isSelected={horarioSelecionado === hora}
                                    onClick={() => setHorarioSelecionado(hora)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="block text-xs font-semibold text-neutral-gray mb-3">Tarde</span>
                        <div className="grid grid-cols-3 gap-3">
                            {["15:00", "15:30", "16:30"].map((hora) => (
                                <TimeSlot
                                    key={hora}
                                    time={hora}
                                    isSelected={horarioSelecionado === hora}
                                    onClick={() => setHorarioSelecionado(hora)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Caixa de Resumo */}
                    <div className="bg-[#F8F9FA] p-4 rounded-xl text-xs space-y-1.5 border border-neutral-border/60">
                        <p><strong className="text-neutral-gray">Procedimento:</strong> {procedimento}</p>
                        <p><strong className="text-neutral-gray">Data:</strong> Quinta-feira, {String(diaSelecionado).padStart(2, "0")} de Setembro de 2026</p>
                        <p><strong className="text-neutral-gray">Horário:</strong> {horarioSelecionado}</p>
                        <p><strong className="text-neutral-gray">Profissional:</strong> Dra. Thais Tardelli</p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setModalAberto(true)}
                        className="w-full bg-primary-main hover:bg-primary-dark text-white rounded-xl py-3.5 font-semibold text-sm"
                    >
                        Confirmar Agendamento
                    </Button>
                </div>
            </div>

            {/* Modal de Confirmação (Figma) */}
            {modalAberto && (
                <div className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-xl border border-neutral-border">
                        <div className="w-14 h-14 rounded-full bg-primary-light text-primary-main flex items-center justify-center mx-auto">
                            <Check className="w-7 h-7 stroke-[2.5]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-dark">Consulta Agendada!</h3>
                            <p className="text-xs text-neutral-gray mt-1">Sua consulta foi confirmada com sucesso.</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-4 rounded-xl text-left text-xs space-y-1.5 border border-neutral-border/60">
                            <p><strong className="text-neutral-gray">Procedimento:</strong> {procedimento}</p>
                            <p><strong className="text-neutral-gray">Data:</strong> Quinta-feira, {String(diaSelecionado).padStart(2, "0")} de Setembro de 2026</p>
                            <p><strong className="text-neutral-gray">Horário:</strong> {horarioSelecionado}</p>
                            <p><strong className="text-neutral-gray">Profissional:</strong> Dra. Thais Tardelli</p>
                        </div>

                        <div className="space-y-2">
                            <Button
                                type="button"
                                onClick={() => {
                                    setModalAberto(false);
                                    onSucesso();
                                }}
                                className="w-full bg-primary-main hover:bg-primary-dark text-white py-3 rounded-xl text-sm"
                            >
                                Ver Meus Agendamentos
                            </Button>
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="text-xs text-neutral-gray hover:text-neutral-dark transition"
                            >
                                Voltar ao Início
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}