import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { SidebarPaciente } from "../components/SidebarPaciente";
import { api } from "../services/api";

interface ProcedimentoDB {
    id: number;
    nome: string;
    duracao_minutos: number;
    descricao?: string;
}

const NOMES_MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Grade de 30 em 30 min (09:00 até 19:30)
const SLOTS_HORARIOS = [
    // Manhã
    { hora: "09:00", periodo: "manha" },
    { hora: "09:30", periodo: "manha" },
    { hora: "10:00", periodo: "manha" },
    { hora: "10:30", periodo: "manha" },
    { hora: "11:00", periodo: "manha" },
    { hora: "11:30", periodo: "manha" },
    // Tarde / Noite
    { hora: "13:00", periodo: "tarde" },
    { hora: "13:30", periodo: "tarde" },
    { hora: "14:00", periodo: "tarde" },
    { hora: "14:30", periodo: "tarde" },
    { hora: "15:00", periodo: "tarde" },
    { hora: "15:30", periodo: "tarde" },
    { hora: "16:00", periodo: "tarde" },
    { hora: "16:30", periodo: "tarde" },
    { hora: "17:00", periodo: "tarde" },
    { hora: "17:30", periodo: "tarde" },
    { hora: "18:00", periodo: "tarde" },
    { hora: "18:30", periodo: "tarde" },
    { hora: "19:00", periodo: "tarde" },
    { hora: "19:30", periodo: "tarde" },
];

export function AgendarConsulta() {
    const navigate = useNavigate();

    const hoje = useMemo(() => new Date(), []);
    const [mesAtualVisualizado, setMesAtualVisualizado] = useState(hoje.getMonth());
    const [anoAtualVisualizado, setAnoAtualVisualizado] = useState(hoje.getFullYear());
    const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());

    // Estados de Procedimentos Dinâmicos do Banco
    const [procedimentos, setProcedimentos] = useState<ProcedimentoDB[]>([]);
    const [procedimentoId, setProcedimentoId] = useState<number | null>(null);
    const [carregandoProcedimentos, setCarregandoProcedimentos] = useState(true);

    const [horarioSelecionado, setHorarioSelecionado] = useState<string>("09:00");

    const [agendamentosExistentes, setAgendamentosExistentes] = useState<any[]>([]);
    const [carregandoHorarios, setCarregandoHorarios] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);

    // Carregar procedimentos reais cadastrados no banco
    useEffect(() => {
        async function fetchProcedimentos() {
            try {
                setCarregandoProcedimentos(true);
                const data = await api.getProcedimentos();
                if (Array.isArray(data) && data.length > 0) {
                    setProcedimentos(data);
                    setProcedimentoId(data[0].id);
                }
            } catch (err: any) {
                console.error("Erro ao carregar procedimentos:", err);
                setErro("Não foi possível carregar os procedimentos disponíveis.");
            } finally {
                setCarregandoProcedimentos(false);
            }
        }
        fetchProcedimentos();
    }, []);

    // Procedimento ativo selecionado
    const procedimentoAtual = useMemo(() => {
        return (
            procedimentos.find((p) => p.id === procedimentoId) || {
                id: 1,
                nome: "Consulta Odontológica",
                duracao_minutos: 30
            }
        );
    }, [procedimentos, procedimentoId]);

    // Impede voltar antes do mês corrente
    const isMesAtual =
        mesAtualVisualizado === hoje.getMonth() &&
        anoAtualVisualizado === hoje.getFullYear();

    // Carrega agendamentos existentes no backend para verificação de conflitos
    useEffect(() => {
        async function fetchAgendamentos() {
            try {
                setCarregandoHorarios(true);
                const data = await api.getHorariosOcupados();
                if (Array.isArray(data)) {
                    setAgendamentosExistentes(data);
                }
            } catch (err) {
                console.error("Erro ao buscar horários ocupados:", err);
            } finally {
                setCarregandoHorarios(false);
            }
        }
        fetchAgendamentos();
    }, [mesAtualVisualizado, anoAtualVisualizado]);

    // Navegação de Meses
    const handleMesAnterior = () => {
        if (isMesAtual) return;
        if (mesAtualVisualizado === 0) {
            setMesAtualVisualizado(11);
            setAnoAtualVisualizado((prev) => prev - 1);
        } else {
            setMesAtualVisualizado((prev) => prev - 1);
        }
        setDiaSelecionado(1);
    };

    const handleProximoMes = () => {
        if (mesAtualVisualizado === 11) {
            setMesAtualVisualizado(0);
            setAnoAtualVisualizado((prev) => prev + 1);
        } else {
            setMesAtualVisualizado((prev) => prev + 1);
        }
        setDiaSelecionado(1);
    };

    // Grade do calendário do mês selecionado
    const diasCalendario = useMemo(() => {
        const primeiroDiaSemana = new Date(anoAtualVisualizado, mesAtualVisualizado, 1).getDay();
        const totalDiasMes = new Date(anoAtualVisualizado, mesAtualVisualizado + 1, 0).getDate();
        const totalDiasMesAnterior = new Date(anoAtualVisualizado, mesAtualVisualizado, 0).getDate();

        const dias = [];

        // Dias do mês anterior para preencher a primeira semana
        for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
            dias.push({
                dia: totalDiasMesAnterior - i,
                outroMes: true,
                desabilitado: true
            });
        }

        // Dias do mês atual
        for (let i = 1; i <= totalDiasMes; i++) {
            const dataComparar = new Date(anoAtualVisualizado, mesAtualVisualizado, i);
            const hojeZerado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            const ehPassado = dataComparar < hojeZerado;

            dias.push({
                dia: i,
                outroMes: false,
                desabilitado: ehPassado
            });
        }

        // Preenche o restante até múltiplo de 7
        const resto = (7 - (dias.length % 7)) % 7;
        for (let i = 1; i <= resto; i++) {
            dias.push({
                dia: i,
                outroMes: true,
                desabilitado: true
            });
        }

        return dias;
    }, [mesAtualVisualizado, anoAtualVisualizado, hoje]);

    // Validação de conflito de horários corrigida para UTC/Local
    const isHorarioOcupado = (horarioStr: string) => {
        const [h, m] = horarioStr.split(":").map(Number);

        // Data e hora local exata
        const slotInicio = new Date(anoAtualVisualizado, mesAtualVisualizado, diaSelecionado, h, m, 0).getTime();
        const slotFim = slotInicio + (procedimentoAtual.duracao_minutos * 60000);
        const slotPadraoFim = slotInicio + (30 * 60000);

        return agendamentosExistentes.some((item) => {
            if (!item.data_hora_inicio || !item.data_hora_fim) return false;

            const agendamentoInicio = new Date(item.data_hora_inicio).getTime();
            const agendamentoFim = new Date(item.data_hora_fim).getTime();

            const conflitoIntervalo = slotInicio < agendamentoFim && slotFim > agendamentoInicio;
            const slotCaiDentro = slotInicio < agendamentoFim && slotPadraoFim > agendamentoInicio;

            return conflitoIntervalo || slotCaiDentro;
        });
    };

    const handleAgendar = async () => {
        setErro("");

        if (!procedimentoId) {
            setErro("Selecione um procedimento para continuar.");
            return;
        }

        if (isHorarioOcupado(horarioSelecionado)) {
            setErro("Este horário já está ocupado. Por favor, escolha outro.");
            return;
        }

        try {
            setSalvando(true);

            const pad = (n: number) => String(n).padStart(2, "0");
            const mesFormatado = pad(mesAtualVisualizado + 1);
            const diaFormatado = pad(diaSelecionado);
            const dataBase = `${anoAtualVisualizado}-${mesFormatado}-${diaFormatado}`;

            const [h, m] = horarioSelecionado.split(":").map(Number);
            const dataInicio = new Date(anoAtualVisualizado, mesAtualVisualizado, diaSelecionado, h, m, 0);
            const dataFim = new Date(dataInicio.getTime() + procedimentoAtual.duracao_minutos * 60000);

            const strInicio = `${dataBase} ${pad(dataInicio.getHours())}:${pad(dataInicio.getMinutes())}:00`;
            const strFim = `${dataBase} ${pad(dataFim.getHours())}:${pad(dataFim.getMinutes())}:00`;

            await api.createAgendamento({
                procedimento_id: procedimentoId,
                data_hora_inicio: strInicio,
                data_hora_fim: strFim,
                observacao: "Agendamento realizado via painel web"
            });

            setModalAberto(true);
        } catch (err: any) {
            setErro(err.message || "Erro ao agendar consulta.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFC] flex font-main text-neutral-dark">
            <SidebarPaciente />

            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-dark">Agendar Consulta</h1>
                    <p className="text-sm text-neutral-gray mt-1">
                        Escolha o procedimento, a data e o melhor horário para seu atendimento.
                    </p>
                </div>

                {erro && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                        {erro}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Coluna 1: Procedimento e Calendário Dinâmico */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-6">
                        <h2 className="text-base font-bold text-neutral-dark">1. Procedimento e Data</h2>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-gray mb-2">
                                Procedimento Odontológico
                            </label>
                            {carregandoProcedimentos ? (
                                <div className="flex items-center gap-2 p-3 bg-[#FAFAFB] border border-neutral-border rounded-xl text-xs text-neutral-gray">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary-main" />
                                    <span>Carregando opções disponíveis...</span>
                                </div>
                            ) : (
                                <select
                                    value={procedimentoId ?? ""}
                                    onChange={(e) => setProcedimentoId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-[#FAFAFB] border border-neutral-border rounded-xl text-sm font-medium text-neutral-dark outline-none focus:border-primary-main cursor-pointer"
                                >
                                    {procedimentos.map((proc) => (
                                        <option key={proc.id} value={proc.id}>
                                            {proc.nome} (~{proc.duracao_minutos} min)
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Calendário */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <button
                                    type="button"
                                    onClick={handleMesAnterior}
                                    disabled={isMesAtual}
                                    className={`p-1.5 rounded-lg transition ${isMesAtual
                                            ? "text-neutral-300 cursor-not-allowed"
                                            : "hover:bg-neutral-bg text-neutral-gray hover:text-neutral-dark cursor-pointer"
                                        }`}
                                    title={isMesAtual ? "Não é possível agendar em meses passados" : "Mês anterior"}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <span className="font-bold text-sm text-neutral-dark">
                                    {NOMES_MESES[mesAtualVisualizado]} {anoAtualVisualizado}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleProximoMes}
                                    className="p-1.5 hover:bg-neutral-bg rounded-lg text-neutral-gray hover:text-neutral-dark cursor-pointer transition"
                                    title="Próximo mês"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-gray">
                                <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                                {diasCalendario.map((item, index) => {
                                    const isSelected = !item.outroMes && item.dia === diaSelecionado;

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            disabled={item.desabilitado}
                                            onClick={() => setDiaSelecionado(item.dia)}
                                            className={`h-9 w-9 mx-auto flex items-center justify-center rounded-full transition-all ${item.desabilitado
                                                    ? "text-neutral-300 cursor-not-allowed"
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

                    {/* Coluna 2: Horários Disponíveis */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-neutral-dark">2. Horários Disponíveis</h2>
                            {carregandoHorarios && (
                                <span className="text-xs text-neutral-gray flex items-center gap-1">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-main" /> Verificando vagas...
                                </span>
                            )}
                        </div>

                        {/* Manhã */}
                        <div>
                            <span className="block text-xs font-semibold text-neutral-gray mb-2.5">
                                Manhã (09:00 - 11:30)
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                                {SLOTS_HORARIOS.filter((s) => s.periodo === "manha").map((slot) => {
                                    const ocupado = isHorarioOcupado(slot.hora);
                                    const selecionado = horarioSelecionado === slot.hora;

                                    return (
                                        <button
                                            key={slot.hora}
                                            type="button"
                                            disabled={ocupado}
                                            onClick={() => setHorarioSelecionado(slot.hora)}
                                            className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${ocupado
                                                    ? "bg-neutral-100 border-neutral-200 text-neutral-400 line-through cursor-not-allowed opacity-60"
                                                    : selecionado
                                                        ? "bg-primary-main border-primary-main text-white shadow-sm"
                                                        : "bg-white border-neutral-border text-neutral-dark hover:border-primary-main/60 cursor-pointer"
                                                }`}
                                        >
                                            {slot.hora}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tarde e Noite */}
                        <div>
                            <span className="block text-xs font-semibold text-neutral-gray mb-2.5">
                                Tarde / Noite (13:00 - 19:30)
                            </span>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {SLOTS_HORARIOS.filter((s) => s.periodo === "tarde").map((slot) => {
                                    const ocupado = isHorarioOcupado(slot.hora);
                                    const selecionado = horarioSelecionado === slot.hora;

                                    return (
                                        <button
                                            key={slot.hora}
                                            type="button"
                                            disabled={ocupado}
                                            onClick={() => setHorarioSelecionado(slot.hora)}
                                            className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${ocupado
                                                    ? "bg-neutral-100 border-neutral-200 text-neutral-400 line-through cursor-not-allowed opacity-60"
                                                    : selecionado
                                                        ? "bg-primary-main border-primary-main text-white shadow-sm"
                                                        : "bg-white border-neutral-border text-neutral-dark hover:border-primary-main/60 cursor-pointer"
                                                }`}
                                        >
                                            {slot.hora}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Resumo */}
                        <div className="bg-[#F8F9FA] p-4 rounded-xl text-xs space-y-1.5 border border-neutral-border/60">
                            <p><strong className="text-neutral-gray">Procedimento:</strong> {procedimentoAtual.nome}</p>
                            <p>
                                <strong className="text-neutral-gray">Data:</strong>{" "}
                                {String(diaSelecionado).padStart(2, "0")} de {NOMES_MESES[mesAtualVisualizado]} de {anoAtualVisualizado}
                            </p>
                            <p><strong className="text-neutral-gray">Horário Selecionado:</strong> {horarioSelecionado}</p>
                            <p><strong className="text-neutral-gray">Profissional:</strong> Dra. Thais Tardelli</p>
                        </div>

                        <Button
                            type="button"
                            onClick={handleAgendar}
                            disabled={salvando || isHorarioOcupado(horarioSelecionado) || carregandoProcedimentos}
                            className="w-full bg-primary-main hover:bg-primary-dark text-white rounded-xl py-3.5 font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                            {salvando ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Confirmando no sistema...
                                </>
                            ) : (
                                "Confirmar Agendamento"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Modal de Confirmação */}
                {modalAberto && (
                    <div className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-xl border border-neutral-border">
                            <div className="w-14 h-14 rounded-full bg-primary-light text-primary-main flex items-center justify-center mx-auto">
                                <Check className="w-7 h-7 stroke-[2.5]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-dark">Consulta Agendada!</h3>
                                <p className="text-xs text-neutral-gray mt-1">Sua consulta foi salva com sucesso no banco de dados.</p>
                            </div>

                            <Button
                                type="button"
                                onClick={() => navigate("/meus-agendamentos")}
                                className="w-full bg-primary-main hover:bg-primary-dark text-white py-3 rounded-xl text-sm cursor-pointer"
                            >
                                Ver Meus Agendamentos
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AgendarConsulta;