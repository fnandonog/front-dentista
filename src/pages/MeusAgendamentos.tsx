import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, AlertTriangle, Plus, Loader2 } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { SidebarPaciente } from "../components/SidebarPaciente";
import { api } from "../services/api";

interface AgendamentoItem {
    id: number;
    procedimento_nome: string;
    data_hora_inicio: string;
    data_hora_fim: string;
    estado: string;
}

export function MeusAgendamentos() {
    const navigate = useNavigate();
    const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [consultaSelecionada, setConsultaSelecionada] = useState<AgendamentoItem | null>(null);
    const [cancelando, setCancelando] = useState(false);

    const carregarAgendamentos = async () => {
        try {
            setCarregando(true);
            setErro("");
            const data = await api.getAgendamentos();
            // Filtra os que não foram cancelados
            const ativos = Array.isArray(data)
                ? data.filter((item: any) => item.estado !== "CANCELADO")
                : [];
            setAgendamentos(ativos);
        } catch (err: any) {
            setErro(err.message || "Não foi possível carregar os agendamentos.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarAgendamentos();
    }, []);

    const handleConfirmarCancelamento = async () => {
        if (!consultaSelecionada) return;
        try {
            setCancelando(true);
            await api.updateEstadoAgendamento(consultaSelecionada.id, "CANCELADO");
            setConsultaSelecionada(null);
            await carregarAgendamentos();
        } catch (err: any) {
            alert(err.message || "Erro ao cancelar consulta.");
        } finally {
            setCancelando(false);
        }
    };

    const formatarData = (dataStr: string) => {
        if (!dataStr) return { data: "", hora: "" };
        const d = new Date(dataStr);
        return {
            data: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
            hora: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        };
    };

    return (
        <div className="min-h-screen bg-[#FBFBFC] flex font-main text-neutral-dark">
            <SidebarPaciente />

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

                {carregando ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-gray">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-main" />
                        <span className="text-xs">Carregando consultas...</span>
                    </div>
                ) : erro ? (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
                        {erro}
                    </div>
                ) : agendamentos.length > 0 ? (
                    <div className="space-y-4">
                        {agendamentos.map((item) => {
                            const { data, hora } = formatarData(item.data_hora_inicio);
                            return (
                                <div key={item.id} className="bg-white p-6 rounded-2xl border border-neutral-border space-y-6 shadow-xs">
                                    <div className="flex items-center justify-between border-b border-neutral-border/60 pb-4">
                                        <h3 className="text-lg font-bold text-neutral-dark">{item.procedimento_nome}</h3>
                                        <Badge status="confirmada" />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-gray">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary-main" />
                                            <span>{data}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary-main" />
                                            <span>{hora}</span>
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
                                            onClick={() => setConsultaSelecionada(item)}
                                            className="px-4 py-2 text-neutral-gray hover:text-red-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                                        >
                                            Cancelar Consulta
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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

                {/* Modal de Cancelamento Dinâmico */}
                {consultaSelecionada && (
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
                                <p><strong className="text-neutral-gray">Procedimento:</strong> {consultaSelecionada.procedimento_nome}</p>
                                <p><strong className="text-neutral-gray">Data:</strong> {formatarData(consultaSelecionada.data_hora_inicio).data}</p>
                                <p><strong className="text-neutral-gray">Horário:</strong> {formatarData(consultaSelecionada.data_hora_inicio).hora}</p>
                                <p><strong className="text-neutral-gray">Profissional:</strong> Dra. Thais Tardelli</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setConsultaSelecionada(null)}
                                    className="py-3 px-4 border border-neutral-border rounded-xl text-xs font-semibold text-neutral-dark hover:bg-neutral-bg transition cursor-pointer"
                                >
                                    Não, Manter
                                </button>
                                <Button
                                    type="button"
                                    disabled={cancelando}
                                    onClick={handleConfirmarCancelamento}
                                    className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    {cancelando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Sim, Cancelar"}
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