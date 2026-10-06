import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, AlertTriangle, Plus } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { SidebarPaciente } from "../components/SidebarPaciente";

export function MeusAgendamentos() {
    const navigate = useNavigate();
    const [modalCancelar, setModalCancelar] = useState(false);
    const [cancelado, setCancelado] = useState(false);

    return (
        <div className="min-h-screen bg-[#FBFBFC] flex font-main text-neutral-dark">
            {/* Barra lateral do paciente */}
            <SidebarPaciente />

            {/* Conteúdo Principal */}
            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">Meus Agendamentos</h1>
                        <p className="text-sm text-neutral-gray mt-1">
                            Acompanhe suas consultas marcadas e o histórico de atendimentos.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => navigate("/agendar")}
                        className="py-2.5 px-4 bg-primary-main hover:bg-primary-dark text-white rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Novo Agendamento
                    </Button>
                </div>

                {!cancelado ? (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-neutral-border/60 pb-4">
                            <h3 className="text-lg font-bold text-neutral-dark">Limpeza / Profilaxia</h3>
                            <Badge status="confirmada" />
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-gray">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary-main" />
                                <span>03 de Setembro de 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-main" />
                                <span>10:00</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary-main" />
                                <span>Dra. Thais Tardelli</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/agendar")}
                                className="px-4 py-2 border border-primary-main text-primary-main hover:bg-primary-light rounded-xl text-xs font-semibold transition cursor-pointer"
                            >
                                Remarcar
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalCancelar(true)}
                                className="px-4 py-2 text-neutral-gray hover:text-red-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                            >
                                Cancelar Consulta
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-neutral-border text-center space-y-4">
                        <p className="text-neutral-gray text-sm">Você não possui consultas ativas no momento.</p>
                        <Button
                            type="button"
                            onClick={() => navigate("/agendar")}
                            className="py-2.5 px-5 bg-primary-main hover:bg-primary-dark text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Agendar uma Consulta
                        </Button>
                    </div>
                )}

                {/* Modal de Cancelamento (Figma) */}
                {modalCancelar && (
                    <div className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-xl border border-neutral-border">
                            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-dark">Cancelar esta consulta?</h3>
                                <p className="text-xs text-neutral-gray mt-1">
                                    Tem certeza que deseja cancelar sua consulta? Esta ação não pode ser desfeita.
                                </p>
                            </div>

                            <div className="bg-[#F8F9FA] p-4 rounded-xl text-left text-xs space-y-1.5 border border-neutral-border/60">
                                <p><strong className="text-neutral-gray">Procedimento:</strong> Limpeza / Profilaxia</p>
                                <p><strong className="text-neutral-gray">Data:</strong> Quinta-feira, 03 de Setembro de 2026</p>
                                <p><strong className="text-neutral-gray">Horário:</strong> 10:00</p>
                                <p><strong className="text-neutral-gray">Profissional:</strong> Dra. Thais Tardelli</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalCancelar(false)}
                                    className="py-3 px-4 border border-neutral-border rounded-xl text-xs font-semibold text-neutral-dark hover:bg-neutral-bg transition cursor-pointer"
                                >
                                    Não, Manter
                                </button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setCancelado(true);
                                        setModalCancelar(false);
                                    }}
                                    className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                                >
                                    Sim, Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default MeusAgendamentos;